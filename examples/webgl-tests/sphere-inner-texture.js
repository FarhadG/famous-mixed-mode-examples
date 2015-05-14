import {FamousEngine, Node} from 'famous/core';
import {Mesh} from 'famous/webgl-renderables';
import {Material} from 'famous/webgl-materials';
import {TextureRegistry} from 'famous/webgl-materials';
import {Camera} from 'famous/components';
import {Sphere, GeometryHelper, DynamicGeometry} from 'famous/webgl-geometries';

var scene = Famous.createScene('body');
var camera = new Camera(scene);
	camera.setDepth(800);

document.body.style.backgroundColor = 'black';

/*
	Create centered node for spheres to share
*/

var mainNode = scene.addChild()
	.setAlign(0.5, 0.5, 0.5)
	.setMountPoint(0.5, 0.5, 0.5)
	.setOrigin(0.5, 0.5, 0.5)
	.setSizeMode(Node.ABSOLUTE_SIZE, Node.ABSOLUTE_SIZE, Node.ABSOLUTE_SIZE)
	.setAbsoluteSize(400, 400, 400)
	.setPosition(0, 0, 620);

/*
	Create video element
*/

var video = document.createElement('video');
	video.src = 'video/video.mp4';
	video.autoplay = true;

/*
	Create video texture sphere
*/

var videoChild = mainNode.addChild();
	videoChild.setOpacity(0.7);

// Create video texture and make sure to set resampleRate to tell Famous how
// frequently to resample that texture

// var videoTexture = TextureRegistry.register('videoTexture', video, { resampleRate: 16 });
var videoTexture = TextureRegistry.register('videoTexture', video, { resampleRate: 16 });
var mesh = new Mesh(videoChild)
	.setGeometry(new Sphere({ detail: 30 }))
	.setBaseColor(Material.image([], { texture: videoTexture }));

/*
	Create wireframe sphere
*/

var wireChild = mainNode.addChild();
var wireSphere = new DynamicGeometry();

	// Here I we change the indices and drawType of a regular sphere so
	// that we get the 'wireframe' look from our geometry.

	wireSphere.fromGeometry(new Sphere({ detail: 30 }));
	wireSphere.setIndices(GeometryHelper.trianglesToLines(wireSphere.spec.bufferValues[3]));
	wireSphere.setDrawType('LINES');

var wireMesh = new Mesh(wireChild)
	.setGeometry(wireSphere)
	.setBaseColor(Material.normal());

/*
	Update sphere rotation
*/

var rotation = [0, 0, 640];

FamousEngine.getClock().setInterval(function() {
	mainNode.setRotation(rotation[0] += velocity[1], rotation[1] += velocity[0], 0);
}, 16);

/*
	Add mouse controls
*/

var velocity = [0, 0];

window.document.addEventListener('mousemove', function(e) {
	var locationX = e.x / innerWidth * 2 - 1;
	var locationY = e.y / innerHeight * 2 - 1;

	velocity[0] = locationX * 0.015;
	velocity[1] = -locationY * 0.015;
});