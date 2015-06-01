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
var PointLight = require('famous/webgl-renderables/lights/PointLight');
var AmbientLight = require('famous/webgl-renderables/lights/AmbientLight');
var Size = require('famous/components/Size');
var Mesh = require('famous/webgl-renderables/Mesh');
var Color = require('famous/utilities/Color');

/**
 * Planet view constructing a basic WebGL mesh
 */
function Planet(node) {
    this.dispatch = node;
    this.dispatch.setSizeMode(1, 1, 1);
    this._id = node.addComponent(this);
    this.position = new Position(this.dispatch);
    this.rotation = new Rotation(this.dispatch);
    this.align = new Align(this.dispatch);
    this.origin = new Origin(this.dispatch);
    this.mountPoint = new MountPoint(this.dispatch);
    this.size = new Size(this.dispatch);
    this.mesh = new Mesh(this.dispatch);

    /**
     * Set Ambient light (a light that emits equally in the scene)
     */
    this.ambience = new AmbientLight(this.dispatch);
    this.ambience.setColor(new Color('#444400'));

    /**
     * Set the geometry to any of the given primitives: e.g. we have the Icosahedron required in above
     * Set its color -- refer to Color for functionality such as inputs, transitions, etc.
     */
    this.mesh.setGeometry('GeodesicSphere');
    this.mesh.setBaseColor(new Color('white'));

    this.align.set(0.5, 0.5, 0.5);
    this.mountPoint.set(0.5, 0.5, 0.5);
    this.origin.set(0.5, 0.5, 0.5);
    this.size.setAbsolute(100, 100, 100);

    this.dispatch.requestUpdate(this._id);
}


/**
 * Orbit the mesh around the sun
 */
Planet.prototype.onUpdate = function() {
    var delta = Date.now() * 0.00009;
    this.rotation.setY(delta);
    this.position.setX(Math.cos(delta) * 450);
    this.position.setY(Math.sin(delta) * 450);

    this.dispatch.requestUpdateOnNextTick(this._id);
};


/**
 * Expose
 */
module.exports = Planet;
