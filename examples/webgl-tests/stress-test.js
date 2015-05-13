import {Grid} from './helpers/Grid';
import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Color from 'famous/utilities/Color';
import Material from 'famous/webgl-materials/Material';
import Camera from 'famous/components/Camera';

var Geometries = {};

var scene = FamousEngine.createScene('body');
var camera = new Camera(scene);
	camera.setDepth(1000);

var DIMENSIONS = [6, 6];

var gridNode = scene.addChild()
	.setMountPoint(0.5, 0.5, 0.5)
	.setAlign(0.5, 0.5, 0.5)
	.setProportionalSize(0.5, 0.5, 0.5)

var grid = new Grid(gridNode, {
	dimensions: [DIMENSIONS[0], DIMENSIONS[1]]
});

for (var i = 0; i < DIMENSIONS[0] * DIMENSIONS[1]; i++) {
	var node = grid.get(i++)
		.setOrigin(0.5, 0.5, 0.5)

	var mesh = new Mesh(node)
		.setGeometry('Sphere', { detail: 8 })
		.setBaseColor(Material.normal())
}

FamousEngine.getClock().setInterval(function() {
	var time = Date.now();

	// for (var i = 0; i < grid.children.length; i++) {
	// 	grid.children[i].node.setRotation(0, Math.sin(time * 0.0005, 0) * 3, 0);
	// }

}, 16)
