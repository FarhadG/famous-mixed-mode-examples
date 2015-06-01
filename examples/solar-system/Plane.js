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
    this.position = new Position(node);
    this.mesh = new Mesh(node);
    this.size = new Size(node);
    this.size.setMode('relative', 'relative', 'relative');
    this.size.setProportional(2, 2, 2);

    node.setAlign(0.5, 0.5, 0.5);
    node.setMountPoint(0.5, 0.5, 0.5);

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
