var FamousEngine = require('famous/core/FamousEngine');
var GestureHandler = require('famous/components/GestureHandler');
var DOMElement = require('famous/dom-renderables/DOMElement');
var Mesh = require('famous/webgl-renderables/Mesh');
var Plane = require('famous/webgl-geometries').Plane;
var Color = require('famous/utilities').Color;

var math = require('famous/math');
var physics = require('famous/physics');

var PhysicsEngine = require('famous/physics/PhysicsEngine');

var plane = new Plane();

var w = window.innerWidth;
var h = window.innerHeight;

var world = new PhysicsEngine({ origin: new math.Vec3(w/2, 0*h/2,0), iterations: 50 });

window.onresize = function() {
    w = window.innerWidth;
    h = window.innerHeight;
    world.setOrigin(w/2, 0*h/2,0);
}

function App(node) {
    this.node = node;
    this.children = [];

    for (var i = 1, len = world.bodies.length; i < len; i++) {
        this.children.push(new BoxView(node.addChild(), world.bodies[i]));
    }

    FamousEngine.requestUpdate(this);
}

App.prototype.onUpdate = function(time) {
    world.update(time);

    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i].update(time);
    }

    FamousEngine.requestUpdateOnNextTick(this);
}

function BoxView(node, body) {
    this.node = node;
    this.body = body;

    var s = body.size;
    this.node.setSizeMode(1,1,1);
    this.node.setAbsoluteSize(s[0],s[1],s[2]);
    this.node.setMountPoint(0.5,0.5);
    this.node.setOrigin(0.5,0.5);

    this.el = new DOMElement(node);
    this.el.setProperty('background', 'black')

    // this.mesh = new Mesh(node);
    // this.mesh.setGeometry(plane);
    // this.mesh.setBaseColor(new Color('black'));
}

BoxView.prototype.update = function(time) {
    var t = world.getTransform(this.body);
    var p = t.position;
    var r = t.rotation;

    this.node.setPosition(p[0],p[1],p[2]);
    this.node.setRotation(r[0],r[1],r[2],r[3]);
}


var base = Math.floor(Math.random() * 360);

var boxes = [];
var constraints = [];
var direction = new math.Vec3(0,0,0);
var pos = new math.Vec3();

var gravity = new physics.Gravity1D(boxes, {acceleration : new math.Vec3(500,0,0)})

var num = 200;

if (navigator.userAgent.match(/iPhone|iPad/)) num = 50;

var offset = window.innerHeight/num;

for (var i = 0; i < num; i++) {
    var box = new physics.Box({
        size: [10000,2,1000],
        mass : 10,
    });

    direction.add({x:0,y:offset,z:0});
    box.position.copy(direction);

    boxes.push(box);

    if (i > 0) {
        var anchor = math.Vec3.add(boxes[i-1].position, boxes[i].position, new math.Vec3()).scale(0.5)

        var p = new physics.BallAndSocket(boxes[i-1], boxes[i], {
            anchor: math.Vec3.clone(anchor).add({x:10,y:0,z:0})
        });

        var p2 = new physics.BallAndSocket(boxes[i-1], boxes[i], {
            anchor: math.Vec3.clone(anchor).subtract({x:10,y:0,z:0})
        });

        constraints.push(p, p2);
    }
}

var drag = new physics.Drag(boxes, {strength : 3});
var rdrag = new physics.RotationalDrag(boxes, {strength : 10});
var mouseSpring = new physics.Spring(null,boxes[0], {
    period: .1,
    dampingRatio: 0.5,
    anchor: math.Vec3.clone(boxes[0].position)
});

world.add(boxes, gravity, constraints, drag, rdrag, mouseSpring);

var lasty = boxes[0].position.y;
var move = function(e) {
    e.preventDefault();
    var t = e.touches ? e.touches[0] : e;
    var delta = t.clientY - lasty;
    lasty = t.clientY;
    mouseSpring.anchor.set(t.clientX,t.clientY, null).subtract(world.origin);
};

document.addEventListener('mousemove', move);
document.addEventListener('touchmove', move);

var root = FamousEngine.createScene('body');
var app = new App(root.addChild());
