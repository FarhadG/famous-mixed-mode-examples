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
function Plane(node) {
    this.dispatch = node;
    this.position = new Position(this.dispatch);
    this.mesh = new Mesh(this.dispatch);

    /**
     * Set the geometry to any of the given primitives: e.g. we have the Icosahedron required in above
     * Set its color -- refer to Color for functionality such as inputs, transitions, etc.
     */
    this.mesh.setGeometry('Plane');
    this.mesh.setBaseColor(new Color('#151515'));

    /**
     * Push the plane back into the background
     */
    this.position.setZ(-700);
}


/**
 * Expose
 */
module.exports = Plane;
