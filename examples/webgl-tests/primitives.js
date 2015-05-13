import {Grid} from './helpers/Grid';
import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Color from 'famous/utilities/Color';
import {Primitives} from './helpers/Primitives';
import Material from 'famous/webgl-materials/Material';
import Camera from 'famous/components/Camera';

var Geometries = {};

var ctx = FamousEngine.createScene('body');
var camera = new Camera(ctx);
	camera.setDepth(1000);

var gridNode = ctx.addChild()
	.setSizeMode(1, 1, 1)
	.setMountPoint(0.5, 0.5, 0.5)
	.setAlign(0.5, 0.5, 0.5)
	.setAbsoluteSize(800, 800, 200);

var grid = new Grid(gridNode, {
	dimensions: [4, 4],
	verticalGutters: 300,
	horizontalGutters: 300
});

var i = 0;
for (var key in Primitives) {
	var node = grid.get(i++)
		.setOrigin(0.5, 0.5, 0.5)

	var mesh = new Mesh(node)
		.setGeometry(key)
		.setBaseColor(Material.normal())
}

FamousEngine.getClock().setInterval(function() {
	var time = Date.now();

	grid.children.forEach(function(child) {
		child.node.setRotation(0, Math.sin(time * 0.0005, 0) * 3, 0);
	});

}, 16)
