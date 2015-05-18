import {Grid} from './helpers/Grid';
import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Color from 'famous/utilities/Color';
import {Primitives} from './helpers/Primitives';
import Material from 'famous/webgl-materials/Material';
import Camera from 'famous/components/Camera';

module.exports = function init (scene) {
	var camera = new Camera(scene);
		camera.setDepth(1000);

	var grid = new Grid({ dimensions: [4, 4], padding: 30 })
		.setSizeMode(1, 1, 1)
		.setMountPoint(0.5, 0.5, 0.5)
		.setAlign(0.5, 0.5, 0.5)
		.setAbsoluteSize(800, 800, 200);

	scene.addChild(grid);

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
			child.setRotation(0, Math.sin(time * 0.0005, 0) * 3, 0);
		});

	}, 16)
}
