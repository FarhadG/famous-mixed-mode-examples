import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import OBJLoader from 'famous/webgl-geometries/OBJLoader';
import Geometry from 'famous/webgl-geometries/Geometry';
import Material from 'famous/webgl-materials/Material';
import Camera from 'famous/components/Camera';

var url = 'obj/teapot.obj';

var scene = FamousEngine.createScene('body');

var camera = new Camera(scene);
	camera.setDepth(1000)

OBJLoader.load(url, function(buffers) {
	var child = scene.addChild()
		.setAlign(0.5, 0.5, 0.5)
		.setMountPoint(0.5, 0.5, 0.5)
		.setSizeMode(1, 1, 1)
		.setAbsoluteSize(500, 500, 500);

	var objGeometry = new Geometry({
		buffers: [
			{ name: 'a_pos', data: buffers.vertices, size: 3 },
			{ name: 'a_normals', data: buffers.normals, size: 3 },
			{ name: 'indices', data: buffers.indices, size: 1 }
		]
	});

	var mesh = new Mesh(child)
		.setGeometry(objGeometry)
		.setBaseColor(Material.normal())
		.setDrawOptions({ side: 'back' });

}, { normalize: true });