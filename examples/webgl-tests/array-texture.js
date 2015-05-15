import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Material from 'famous/webgl-materials/Material';
import Camera from 'famous/components/Camera';
import TextureRegistry from 'famous/webgl-materials/TextureRegistry';

module.exports = function(scene) {
	/*
		Add camera
	*/

	var camera = new Camera(scene)
		.setDepth(1000)

	/*
		Create data array
	*/

	var data = new Uint8Array(768);
	for (var i = 0; i < data.length; i++) {
		data[i] = Math.round(Math.random() * 255);
	}

	/*
		Save data array as texure
	*/

	var arrayTexture = TextureRegistry.register(
		'arrayTexture',
		data,
		{
			width: 16,
			height: 16,
			format: 'RGB'
		}
	);

	/*
		Add child node
	*/

	var child = scene.addChild()
		.setOrigin(0.5, 0.5, 0.5)
		.setRotation(0.5, 0, 0.5)
		.setAlign(0.5, 0.5, 0.5)
		.setMountPoint(0.5, 0.5, 0.5)
		.setSizeMode(1, 1, 1)
		.setAbsoluteSize(400, 400, 1);

	/*
		Add mesh with array texture
	*/

	var mesh = new Mesh(child)
		.setGeometry('Plane', { detail: 50 })
		.setBaseColor(Material.image([], { texture: arrayTexture }))
}


