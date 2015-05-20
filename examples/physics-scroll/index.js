'use strict';

var Context = require('famous/core').Context;
var FamousEngine = require('famous/core').FamousEngine;

var DOMElement = require('famous/dom-renderables').DOMElement;
var components = require('famous/components');
var Camera = components.Camera;
var GestureHandler = components.GestureHandler;

var math = require('famous/math');
var physics = require('famous/physics');

var PhysicsEngine = physics.PhysicsEngine;

var w = window.innerWidth;
var h = window.innerHeight;

window.onresize = function() {
    w = window.innerWidth;
    h = window.innerHeight;
    world.setOrigin(w/2,h/2,0);
}

var world = new PhysicsEngine({ origin: new math.Vec3(w/2,h/2,0) });

var impulse = new math.Vec3();

function App(node) {
    this.node = node;
    this.el = new DOMElement(node, {cutout: false});
    this.last = [0,0];

    this.node.addUIEvent('wheel');
    this.el.on('wheel', function wheel(e) {
        impulse.set(e.deltaY*1000, -e.deltaX*1000, 0);
        ghost.applyAngularImpulse(impulse);
    });

    this.gestures = new GestureHandler(node);

    this.gestures.on('drag', function drag(e) {
        var d = e.centerDelta;
        impulse.set(-d.y*3000, d.x*3000, 0);
        ghost.applyAngularImpulse(impulse);
    });

    this.camera = new Camera(node);
    this.camera.setDepth(4 * radius);

    this.engine = world;
    this.children = [];

    for (var i = 1, len = world.bodies.length; i < len; i++) {
        this.children.push(new BoxView(node.addChild(), world.bodies[i]));
    }

    FamousEngine.requestUpdate(this);
}

App.prototype.onUpdate = function(time) {
    this.engine.update(time);

    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i].update();
    }

    FamousEngine.requestUpdateOnNextTick(this);
};

function BoxView(node, body) {
    this.node = node;
    this.body = body;

    var s = body.size;
    this.node.setSizeMode(1,1,1);
    this.node.setAbsoluteSize(s[0],s[1],s[2]);
    this.node.setOrigin(0.5,0.5,0.5);
    this.node.setMountPoint(0.5,0.5,0.5);

    this.el = new DOMElement(node);
    this.el.setProperty('background', body.color);
    this.el.setProperty('color', 'white');
    this.el.setProperty('textAlign', 'center');
    this.el.setProperty('fontSize', '40px');
    this.el.setProperty('lineHeight', s[1]+'px');

    this.content = '';
}

BoxView.prototype.update = function() {
    var c = this.body.content + '';
    if (c !== this.content) this.el.setContent(c);
    var s = this.body.size;
    this.node.setAbsoluteSize(s[0],s[1],s[2]);
    var t = world.getTransform(this.body);
    this.node.setPosition(t.position[0],t.position[1],t.position[2]);
    this.node.setRotation(t.rotation[0],t.rotation[1],t.rotation[2],t.rotation[3]);
};

var ghost = new physics.Box({
    size: [w/10,h/10,h/10],
    mass: 1e3,
    restrictions: ['xyz', 'y']
});

ghost.content = '';
ghost.color = 'black';

world.add(ghost);

var radius = w*0.3;
ghost.setPosition(0,0,-radius);

var blades = [];
var springs = [];
var forces = [];
var num = 30;

var qs = [];
var rs = [];

var base = Math.floor(360 * Math.random());
for (var i = 0; i < num; i++) {
    var size = [400,2*Math.PI*radius/num,100];

    var theta = -i * 2 * Math.PI / num;
    var r = new math.Vec3(0,0,radius);
    r.rotateX(theta)

    var q = new math.Quaternion().fromEuler(theta,0,0);

    rs.push(r);
    qs.push(q);

    var blade = new physics.Box({
        size: size,
        position: math.Vec3.add(r, ghost.position, new math.Vec3()),
        orientation: math.Quaternion.clone(q)
    });

    var spring = new physics.Spring(null, blade, {
        period: 2.3,
        dampingRatio: 0.8,
        anchor: math.Vec3.add(r, ghost.position, new math.Vec3())
    });

    blade.content = i+1;
    blade.color = 'hsl('+(base + (i*17)%360)+',50%,50%)';

    blades.push(blade);
    springs.push(spring);
}

var rdrag = new physics.RotationalDrag(ghost, {
    strength: 1e6
});

forces.push(rdrag);

var ws = [];
world.on('prestep', function(time) {
    blades.forEach(function(b, i) {
        ws[i] = ws[i] || [];
        ws[i][0] = b.orientation.w;
        ws[i][1] = b.orientation.x;
        ghost.orientation.rotateVector(rs[i], springs[i].anchor).add(ghost.position);
        math.Quaternion.multiply(qs[i], ghost.orientation, b.orientation);
    });
});

var count = 0;
world.on('poststep', function(time) {
    blades.forEach(function(b, i) {
        var w = ws[i][0];
        var x = ws[i][1];

        var cw = b.orientation.w;
        var cx = b.orientation.x;
        if (w > 0 && x > 0 && cw < 0 && cx > 0) {
            if (i === 0) count++;
            if (count > 0) b.content += num;
        }
        else if (w < 0 && x < 0 && cw > 0 && cx < 0) {
            if (i === 0) count++;
            if (count > 0) b.content += num;
        }
        else if (w < 0 && x > 0 && cw > 0 && cx > 0) {
            if (i === 0) count = Math.max(0, count - 1);
            b.content = Math.max(b.content - num, i + 1);
        }
        else if (w > 0 && x < 0 && cw < 0 && cx < 0) {
            if (i === 0) count = Math.max(0, count - 1);
            b.content = Math.max(b.content - num, i + 1);
        }
    });
});

world.add(blades, springs, forces);

var root = FamousEngine.createScene('body');
var scene = new App(root.addChild());
