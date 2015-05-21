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

/**
 * Sphere view constructing a basic WebGL mesh
 */
function Sphere(node) {
    this.dispatch = node;
    node.setSizeMode(1, 1, 1);
    this._id = node.addComponent(this);
    this.position = new Position(this.dispatch);
    this.rotation = new Rotation(this.dispatch);
    this.align = new Align(this.dispatch);
    this.origin = new Origin(this.dispatch);
    this.mountPoint = new MountPoint(this.dispatch);
    this.size = new Size(this.dispatch);
    this.mesh = new Mesh(this.dispatch);

    /**
     * Set the geometry to any of the given primitives: e.g. we have the Icosahedron required in above
     * Set its color -- refer to Color for functionality such as inputs, transitions, etc.
     */
    this.mesh.setGeometry('GeodesicSphere');
    this.mesh.setBaseColor(new Color('white'));

    this.align.set(0.5, 0.5, 0.5);
    this.mountPoint.set(0.5, 0.5, 0.5);
    this.origin.set(0.5, 0.5, 0.5);
    this.size.setAbsolute(400, 400, 400);

    node.requestUpdate(this._id);
}


/**
 * Move the mesh around in the scene
 */
Sphere.prototype.onUpdate = function() {
    this.position.setX(Math.sin(Date.now() * 0.0003) * 200);
    this.dispatch.requestUpdateOnNextTick(this._id);
};


/**
 * Expose
 */
module.exports = Sphere;
