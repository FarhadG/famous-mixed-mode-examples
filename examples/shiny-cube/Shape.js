'use strict';

/**
 * Module dependencies
 */
var Origin = require('famous/components/Origin');
var Rotation = require('famous/components/Rotation');
var Position = require('famous/components/Position');
var Align = require('famous/components/Align');
var Origin = require('famous/components/Origin');
var MountPoint = require('famous/components/MountPoint');
var Size = require('famous/components/Size');
var Mesh = require('famous/webgl-renderables/Mesh');
var Color = require('famous/utilities/Color');
var Vec3 = require('famous/math/Vec3');

/**
 * Shape view constructing a basic WebGL mesh
 */
function Shape(node) {
    this.dispatch = node;
    this._id = node.addComponent(this);
    node.requestUpdate(this._id);

    this.position = new Position(this.dispatch);
    this.rotation = new Rotation(this.dispatch);
    this.align = new Align(this.dispatch);
    this.origin = new Origin(this.dispatch);
    this.mountPoint = new MountPoint(this.dispatch);
    this.size = new Size(this.dispatch);
    this.mesh = new Mesh(this.dispatch);

    /**
     * Set the geometry to any of the given primitives.
     * Set its color -- refer to Color for functionality such as inputs, transitions, etc.
     * Set it's glossiness with a color (default is the same as the light color) and with a glossiness strength
     */
    this.mesh.setGeometry('Box');
    var color = new Color('white');
    this.mesh.setBaseColor(color);
    this.mesh.setGlossiness(color, 40);

    this.align.set(0.5, 0.5, 0.5);
    this.mountPoint.set(0.5, 0.5, 0.5);
    this.origin.set(0.5, 0.5, 0.5);

    node.setSizeMode(1, 1, 1);
    this.size.setAbsolute(400, 400, 400);

    this.radius = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
    this.randomDirection = new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
    this.pos = new Vec3(Math.random() - 0.5, Math.random() - 0.5, 0);
    this.pos.scale(this.radius);
}


/**
 * Move the mesh around in the scene
 */
Shape.prototype.onUpdate = function() {
    var delta = Date.now() * 0.0003;
    var dir = Vec3.cross(this.pos, this.randomDirection, new Vec3());
    dir.normalize().scale(2);
    this.pos.add(dir);
    this.position.set(this.pos.x, this.pos.y, Math.sin(delta) * 300);
    this.rotation.set(delta, delta * 1.2, delta * 0.7);

    this.dispatch.requestUpdateOnNextTick(this._id);
};


module.exports = Shape;
