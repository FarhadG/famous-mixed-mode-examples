var FamousEngine = require('famous/core/FamousEngine');
var GestureHandler = require('famous/components/GestureHandler');
var DOMElement = require('famous/dom-renderables/DOMElement');

var math = require('famous/math');
var physics = require('famous/physics');

var PhysicsEngine = require('famous/physics/PhysicsEngine');

var w = window.innerWidth;
var h = window.innerHeight;

var ballSocket;
var radius;
var z = 0;

var world = new PhysicsEngine({ origin: new math.Vec3(w, h/2,0) });

window.onresize = function() {
    w = window.innerWidth;
    h = window.innerHeight;
    world.setOrigin(w, h/2,0);
    blades.forEach(function(blade) {
        blade.position.normalize().scale(w/2);
    });
    hinges.forEach(function(hinge) {
        hinge.init();
    });
}

function App(node) {
    this.node = node;
    this.children = [];

    for (var i = 1, len = world.bodies.length; i < len; i++) {
        this.children.push(new PanelView(node.addChild(), world.bodies[i]));
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

function PanelView(node, body) {
    this.node = node;
    this.body = body;

    var s = body.size;
    this.node.setSizeMode(0,1,1);
    this.node.setProportionalSize(0.99,null,null);
    this.node.setAbsoluteSize(null,s[1],s[2]);
    this.node.setMountPoint(0.5,0.5);
    this.node.setOrigin(0.5,0.5);

    this.el = new DOMElement(node);
    this.el.setProperty('background', this.body.color)
    this.el.setProperty('zIndex', this.body.zIndex)
    this.el.setProperty('borderRadius', '20px')
    this.el.setProperty('color', 'white');
    this.el.setProperty('textAlign', 'center');
    this.el.setProperty('fontSize', '40px');
    this.el.setProperty('lineHeight', s[1]+'px');
    this.el.setContent(body.content + '');

    this.gestures = new GestureHandler(node);
    this.gestures.on('drag', function drag(e) {
        switch(e.status) {
            case 'move':
                mouseghost.position
                .set(e.center.x,e.center.y,0).subtract(world.origin).subtract(ghost.position)
                .normalize().scale(radius).add(ghost.position);
                break;
            case 'start':
                mouseghost.position.set(e.center.x,e.center.y,0).subtract(world.origin);
                body.zIndex = ++z;
                ballSocket = new physics.BallAndSocket(body, mouseghost, {
                    anchor: math.Vec3.clone(mouseghost.position)
                });

                world.add(ballSocket);

                radius = math.Vec3.subtract(mouseghost.position, ghost.position, new math.Vec3()).length();
                break;
            case 'end':
                world.remove(ballSocket);
                break;
        }
    });
}

PanelView.prototype.update = function() {
    var t = world.getTransform(this.body);
    var p = t.position;
    var r = t.rotation;

    this.node.setPosition(p[0],p[1],p[2]);
    this.node.setRotation(r[0],r[1],r[2],r[3]);
    this.el.setProperty('zIndex', this.body.zIndex);
}

var mouseghost = new physics.Particle({
    mass: 1e8,
    restrictions: ['xyz','xyz']
});

var ghost = new physics.Box({
    size: [10,10,10],
    mass: 1e8,
    restrictions: ['xyz', 'xyz']
});

world.add(ghost);

var blades = [];
var springs = [];
var hinges = [];
var num = 7;
var span = 30;

var base = Math.floor(360 * Math.random());
for (var i = 0; i < num; i++) {
    var size = [w,200,100];
    var blade = new physics.Box({
        size: size,
        mass: 1,
        restrictions: ['z', 'xy']
    });

    blade.content = i+1;
    blade.color = 'hsl('+(base + (i*17)%360)+',50%,50%)';
    blade.zIndex = 0;

    blade.setPosition(ghost.position.x - size[0]/2,ghost.position.y,0);

    var theta = (span-((i+0.5)/num)*span*2)*Math.PI/180;
    var anchor = new math.Quaternion().fromEuler(0,0,theta);

    var spring = new physics.RotationalSpring(null, blade, {
        period: 0.3,
        dampingRatio: 1.5,
        anchor: anchor
    });

    var hinge = new physics.Hinge(blade, ghost, {
        axis : new math.Vec3(0,0,1),
        anchor: math.Vec3.clone(ghost.position)
    });

    blades.push(blade);
    springs.push(spring);
    hinges.push(hinge);
}

var drag = new physics.Drag(blades, {
    strength: 0.7
});

var rdrag = new physics.RotationalDrag(blades, {
    strength: 0.7
});

world.add(blades, hinges, springs, drag, rdrag);

setTimeout(function() {
    blades.forEach(function(b, i) {
        var repulse = new physics.Gravity3D(b, blades.filter(function(e,j) {
            return i !== j;
        }), {
            strength: -3e7,
            max: 10000
        });

        world.add(repulse);
    });
}, 1000);

setInterval(function() {
    blades.sort(function(a,b) {
        return b.orientation.z - a.orientation.z;
    });

    springs.forEach(function(s, i) {
        s.targets[0] = blades[i];
    });
}, 100);

if (window.DeviceMotionEvent) {
    setTimeout(function() {
        var direction = new math.Vec3();
        var worldAcceleration = new physics.Gravity1D(blades, {
            acceleration: direction
        });

        world.add(worldAcceleration);

        window.addEventListener('devicemotion', function(e) {
            var a = e.accelerationIncludingGravity;
            direction.set(a.x,-a.y,a.z).scale(2500);
        });
    }, 1000);
}

var root = FamousEngine.createScene('body');
var app = new App(root.addChild());
