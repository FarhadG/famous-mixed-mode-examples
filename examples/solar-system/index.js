'use strict';

/**
 * Module dependencies
 */
var FamousEngine = require('famous/core/FamousEngine');
var Camera = require('famous/components/Camera');
var Plane = require('./Plane');
var Planet = require('./Planet');
var Sun = require('./Sun');


/**
 * Add the models to the body.
 * It's better to add a single scene into the main root (e.g. body)
 */
var scene = FamousEngine.createScene('body');
var cameraNode = scene.addChild();
var camera = new Camera(cameraNode);
camera.setDepth(1200);

var root = cameraNode.addChild();
new Plane(root.addChild());
new Planet(root.addChild());
new Sun(root.addChild());
