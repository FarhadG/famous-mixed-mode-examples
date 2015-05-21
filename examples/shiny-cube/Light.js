'use strict';

/**
 * Module dependencies
 */
var Position = require('famous/components/Position');
var PointLight = require('famous/webgl-renderables/lights/PointLight');
var Align = require('famous/components/Align');
var Rotation = require('famous/components/Rotation');
var Origin = require('famous/components/Origin');
var MountPoint = require('famous/components/MountPoint');
var Size = require('famous/components/Size');
var Mesh = require('famous/webgl-renderables/Mesh');
var Vec3 = require('famous/math/Vec3');

/**
 * Lights view containing the point light component.
 * You can also add a mesh to the node, if you'd like for the
 * light to be seen in the scene graph.
 */
function Light(node, color) {
    this.dispatch = node;
    this._id = node.addComponent(this);
    node.requestUpdate(this._id);

    this.position = new Position(this.dispatch);
    this.align = new Align(this.dispatch);
    this.origin = new Origin(this.dispatch);
    this.rotation = new Rotation(this.dispatch);
    this.mountPoint = new MountPoint(this.dispatch);
    node.setSizeMode(1, 1, 1);
    this.size = new Size(this.dispatch);

    /**
     * Create a point (light emits in all directions from the given point).
     * Set its color -- refer to Color for functionality such as inputs, transitions, etc.
     */
    this.pointLight = new PointLight(this.dispatch);
    this.pointLight.setColor(color);

    this.align.set(0.5, 0.5, 0.5);
    this.mountPoint.set(0.5, 0.5, 0.5);
    this.origin.set(0.5, 0.5, 0.5);

    this.tempo = Math.random() * 5;
    this.radius = 500;
    this.pos = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    this.r = new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    this.pos.scale(this.radius);
}

/**
 * Move the lights around randomly
 */
Light.prototype.onUpdate = function() {
    var p = this.pos;
    var dir = Vec3.cross(p, this.r, new Vec3());
    dir.normalize().scale(this.tempo);
    p.add(dir).normalize().scale(this.radius);
    this.rotation.setY(Date.now() * 0.001);
    this.position.set(p.x, p.y, p.z);

    this.dispatch.requestUpdateOnNextTick(this._id);
};

/**
 * Expose
 */
module.exports = Light;
