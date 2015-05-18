import {Grid} from './helpers/Grid';
import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Color from 'famous/utilities/Color';
import Material from 'famous/webgl-materials/Material';
import Camera from 'famous/components/Camera';
import Sphere from 'famous/webgl-geometries/primitives/Sphere';
import DOMElement from 'famous/dom-renderables/DOMElement';

module.exports = function init(scene) {
	/*
		Add camera
	*/

	var camera = new Camera(scene);
		camera.setDepth(1000);

	/*
		Create grid
	*/

	var DIMENSIONS = [10, 10];
	var GRIDSIZE = 1000;
	var NUMMESHES = 100;

	var grid = new Grid({
		dimensions: [DIMENSIONS[0], DIMENSIONS[1]],
		padding: 10
	})
		.setMountPoint(0.5, 0.5, 0.5)
		.setAlign(0.5, 0.5, 0.5)
		.setSizeMode(1, 1, 1)
		.setAbsoluteSize(GRIDSIZE, GRIDSIZE, GRIDSIZE / DIMENSIONS[0])

	scene.addChild(grid);

	/*
		Add a sphere to each node
	*/

	var sphere = new Sphere({ detail: 8 });
	var normalMaterial = Material.normal();

	for (var i = 0; i < NUMMESHES; i++) {
		var node = grid.get(i)
			.setOrigin(0.5, 0.5, 0.5)

		// var element = new DOMElement(node)
		// 	.setProperty('background-color', 'blue')

		var mesh = new Mesh(node)
			.setGeometry(sphere)
			.setBaseColor(normalMaterial)
	}

	/*
		Rotate spheres
	*/

	FamousEngine.getClock().setInterval(function() {
		var time = Date.now();

		for (var i = 0; i < grid.children.length; i++) {
			grid.children[i].setRotation(0, Math.sin(time * 0.0005, 0) * 3, 0);
		}

	}, 16)
}
