'use strict';

/**
 * Module dependencies
 */
var FamousEngine = require('famous/core/FamousEngine');
var Camera = require('famous/components/Camera');
var Color = require('famous/utilities/Color');
var Shape = require('./Shape');
var Backdrop = require('./Plane');
var Light = require('./Light');


/**
 * Helper function for creating a random color
 */
function randomColor() {
    var r = Math.random() * 255;
    var g = Math.random() * 255;
    var b = Math.random() * 255;
    return [r, g, b];
}


/**
 * Create the context and attach a camera for perspective.
 */
var root = FamousEngine.createScene('body');
var cameraNode = root.addChild();
var camera = new Camera(cameraNode);
var root = cameraNode.addChild();
camera.setDepth(1500);


/**
 * Add a shape to the scene
 */
new Shape(root.addChild());


/**
 * Add four lights (maximum of 4 lights, currently) with random colors.
 */
for(var i = 0; i < 4; i++) {
    new Light(root.addChild(), new Color(randomColor()));
}


/**
 * Create a backdrop with a random glossiness color
 */
var glossinessColor = new Color(randomColor());
var backdrop = new Backdrop(root.addChild(), glossinessColor);


/**
 * Animate the glossiness color of the mesh on a timed interval.
 */
setInterval(function() {
    glossinessColor.set(randomColor(), { duration: 2000 });
    backdrop.mesh.setGlossiness(glossinessColor, 20);
}, 3000);
