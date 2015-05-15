'use strict';

var FamousEngine = require('famous/core/FamousEngine');

var GestureHandler = require('famous/components/GestureHandler');
var DOMElement = require('famous/dom-renderables/DOMElement');

var physics = require('famous/physics');
var math = require('famous/math');

var world = new physics.PhysicsEngine();

function App(root) {
    this.node = root;
    this.views = [];
    this.engine = world;

    FamousEngine.requestUpdate(this);
}

App.prototype.grid = function(n) {
    var bodies = [];
    var forces = [];

    var sqrt = Math.sqrt(n);
    var p = 1 / sqrt;
    for(var i = 0; i < n; i++) {
        var panel = this.node.addChild();
        panel.setProportionalSize(p - 0.001,p - 0.001,0);
        panel.setAlign((i % sqrt) * p, Math.floor(i / sqrt) * p,0);

        var bView = new BoxView(panel.addChild(), {
            mass: 10,
            size: [100,200,300]
        });

        var b = bView.body;

        bodies.push(b);
        var spring = new physics.Spring(null,b, {period:1.5, dampingRatio:0.6, anchor: new math.Vec3()});
        var rspring = new physics.RotationalSpring(null,b, {period:2, dampingRatio:0.5});
        forces.push(spring, rspring);

        b.spring = spring;
        b.rspring = rspring;
    }

    var rdrag = new physics.RotationalDrag(bodies, {strength: 3e4});
    var drag = new physics.Drag(bodies, {strength: 3});

    world.add(drag, rdrag, forces, bodies);
};

App.prototype.onUpdate = function(t) {
    this.engine.update(t);
    FamousEngine.requestUpdateOnNextTick(this);
};

var j = 0;

var base = (Math.random()*360)|0;

function BoxView(node, options) {
    this.node = node;
    this.body = new physics.Box(options);

    this.j = ++j;

    this.node.setOrigin(0.5,0.5,0.5);

    this.el = new DOMElement(node);
    this.el.setProperty('textAlign', 'center');
    this.el.setProperty('background', 'black');
    this.el.setProperty('color', 'white');
    this.el.setProperty('fontSize', '40px');
    this.el.setProperty('lineHeight', '100px');
    this.el.setProperty('zIndex', j + '');
    this.el.setProperty('background', 'hsl('+((base += 37) % 360)+',40%,50%)');
    this.el.setContent(j + '');

    this.gestures = new GestureHandler(node, [
        {event:'pinch', callback: pinch.bind(this)},
        {event:'drag', callback: drag.bind(this)},
        {event:'tap', callback: tap.bind(this), threshold: 300, points: 1},
        {event:'rotate', callback: rotate.bind(this)}
    ]);

    FamousEngine.requestUpdate(this);
}

BoxView.prototype.onUpdate = function() {
    var t = world.getTransform(this.body);
    this.node.setPosition(t.position[0],t.position[1],t.position[2]);
    this.node.setRotation(t.rotation[0],t.rotation[1],t.rotation[2],t.rotation[3]);
    this.el.setProperty('background', 'hsl('+((base += 37) % 360)+'60%,60%)');
    FamousEngine.requestUpdateOnNextTick(this);
}

function tap(e) {
    this.el.setProperty('zIndex', ++j + '');
}

var hz = 1000 / world.step;

function rotate(e) {
    var theta = e.rotationDelta;
    if (e.status === 'end') this.body.setAngularVelocity(0,0,theta * hz);
    else this.body.setAngularVelocity(0,0,0);
    var q = new math.Quaternion().fromEuler(0,0,theta);
    this.body.orientation.multiply(q);
}

function pinch(e) {
    var s = this.node.getScale();
    var x = s[0];
    var y = s[1];
    var z = s[2];

    var d = e.scaleDelta + 1;
    this.node.setScale(x*d,y*d,z*d);
}

function drag(e) {
    if (e.status === 'start') {
        this.body.position.z = 1000;
        this.body.setVelocity(0,0,0);
        world.remove(this.body.spring, this.body.rspring);
    }
    else if (e.status === 'end') {
        if (e.current === 0) {
            this.node.setScale(1, 1, 1, {duration: 1500, curve: 'outBounce'});
            world.add(this.body.spring, this.body.rspring);
        }
    }
    var d = e.centerDelta;
    if (e.points === 1) {
        if (e.current === 0) this.body.setVelocity(d.x * hz, d.y * hz, 0);
        this.body.position.x += d.x;
        this.body.position.y += d.y;
    }
    else {
        var x = d.x * 0.005;
        var y = d.y * 0.005;
        var q = new math.Quaternion().fromEuler(0,x,0);
        var q1 = new math.Quaternion().fromEuler(-y,0,0);
        this.body.orientation.multiply(q).multiply(q1);
    }
}

var root = FamousEngine.createScene('body');
var app = new App(root);
app.grid(9);
