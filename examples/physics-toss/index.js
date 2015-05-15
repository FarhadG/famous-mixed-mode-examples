var FamousEngine = require('famous/core/FamousEngine');
var GestureHandler = require('famous/components/GestureHandler');
var DOMElement = require('famous/dom-renderables/DOMElement');

var math = require('famous/math');
var physics = require('famous/physics');

var PhysicsEngine = require('famous/physics/PhysicsEngine');

var w = window.innerWidth;
var h = window.innerHeight;

var ballSocket;
var z = 0;

var world = new PhysicsEngine({ origin: new math.Vec3(w/2, h/2,0)});

window.onresize = function() {
    w = window.innerWidth;
    h = window.innerHeight;
    world.setOrigin(w/2, h/2,0);
}

function App(node) {
    this.node = node;
    this.children = [];

    for (var i = 0, len = world.bodies.length; i < len; i++) {
        this.children.push(new BoxView(node.addChild(), world.bodies[i]));
    }

    FamousEngine.requestUpdate(this);
}

App.prototype.onUpdate = function(time) {
    world.update(time);

    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i].update();
    }

    FamousEngine.requestUpdateOnNextTick(this);
}

function BoxView(node, body) {
    this.node = node;
    this.body = body;

    this.node.setProportionalSize(0.99,0.99,0);
    this.node.setMountPoint(0.5,0.5);
    this.node.setOrigin(0.5,0.5);

    this.el = new DOMElement(node);
    this.el.setProperty('background', body.color);
    this.el.setProperty('zIndex', body.zIndex);
    this.el.setProperty('borderRadius', '20px')
    this.el.setProperty('color', 'white');
    this.el.setProperty('textAlign', 'center');
    this.el.setProperty('fontSize', '40px');
    this.el.setProperty('lineHeight', '100px');

    this.el.setContent(''+(body.i+1));

    this.gestures = new GestureHandler(node);
    this.gestures.on('drag', function drag(e) {
        switch(e.status) {
            case 'move':
                mouseghost.position.set(e.center.x,e.center.y,0).subtract(world.origin);
                break;
            case 'start':
                body.dragging = true;
                mouseghost.position.set(e.center.x,e.center.y,0).subtract(world.origin);
                body.zIndex = ++z;
                ballSocket = new physics.BallAndSocket(body, mouseghost, {
                    anchor: math.Vec3.clone(mouseghost.position)
                });

                world.add(ballSocket);
                var j = body.i;
                world.remove(springs[j], rsprings[j]);
                break;
            case 'end':
                body.dragging = false;
                world.remove(ballSocket);
                world.add(springs[i], rsprings[i]);
                break;
        }
    });
}

BoxView.prototype.update = function() {
    var t = world.getTransform(this.body);
    var p = t.position;
    var r = t.rotation;

    this.node.setPosition(p[0],p[1],p[2]);
    this.node.setRotation(r[0],r[1],r[2],r[3]);
    this.el.setProperty('zIndex', this.body.zIndex);
}

var mouseghost = new physics.Particle({
    mass: 1e8,
    restrictions: ['xyz', 'xyz']
});

var panelBodies = [];
var springs = [];
var rsprings = [];
var hinges = [];
var num = 10;

var base = Math.floor(360 * Math.random());
for (var i = 0; i < num; i++) {
    var size = [w*0.95,h*0.95,100];
    var panelBody = new physics.Box({
        size: size,
        mass: 1,
        restrictions: ['z', 'xy']
    });

    panelBody.i = i;
    panelBody.color = 'hsl('+(base + (i*90)%360)+',50%,50%)';
    panelBody.dragging = false;

    panelBody.setPosition(-num*0.5 + i,-num*0.5 + i, 0);

    var spring = new physics.Spring(null, panelBody, {
        period: 0.2,
        dampingRatio: 1,
        anchor: math.Vec3.clone(panelBody.position)
    });

    var rspring = new physics.RotationalSpring(null, panelBody, {
        period: 0.2,
        dampingRatio: 1
    });

    panelBodies.push(panelBody);
    springs.push(spring);
    rsprings.push(rspring);
}

var drag = new physics.Drag(panelBodies, {
    strength: 0.7
});

var rdrag = new physics.RotationalDrag(panelBodies, {
    strength: 5
});

world.add(panelBodies, springs, rsprings, drag, rdrag);

var center = new math.Vec3();
var diff = new math.Vec3();

world.on('prestep', function(time) {
    panelBodies.forEach(function(b, i) {
        var relative = math.Vec3.subtract(b.position, center, diff);
        if (relative.dot(b.velocity) > 0 && b.velocity.length() > 250) {
            world.remove(springs[i], rsprings[i]);
        }
        else if (relative.length() > w*0.65) {
            world.remove(springs[i], rsprings[i]);
        } else {
            if (!b.dragging && relative.length() < w*0.25) world.add(springs[i], rsprings[i]);
        }
    });
});

var root = FamousEngine.createScene('body');
var app = new App(root.addChild());
