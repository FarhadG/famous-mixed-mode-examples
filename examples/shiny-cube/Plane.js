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
 * Plane view constructing a basic WebGL mesh
 */
function Plane(node, glossinessColor) {
    this.dispatch = node;
    this.position = new Position(this.dispatch);
    this.size = new Size(this.dispatch);
    this.mountPoint = new MountPoint(this.dispatch);
    this.align = new Align(this.dispatch);
    this.mesh = new Mesh(this.dispatch);

    /**
     * Set the geometry to any of the given primitives.
     * Set its color and glossiness from the given constructor input
     */
    this.mesh.setGeometry('Plane');
    this.mesh.setBaseColor(new Color('#333'));
    this.mesh.setGlossiness(glossinessColor, 20);

    this.size.setProportional(2.8, 2.8, 2.8);
    this.mountPoint.set(0.5, 0.5, 0.5);
    this.align.set(0.5, 0.5, 0.5);

    /**
     * Push the plane back into the background
     */
    this.position.setZ(-1000);
}


/**
 * Expose
 */
module.exports = Plane;
