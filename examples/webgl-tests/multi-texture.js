import Famous from 'famous/core/Famous';
import Node from 'famous/core/Node';

import Mesh from 'famous/webgl-renderables/Mesh';
import PointLight from 'famous/webgl-renderables/lights/PointLight';

import Material from 'famous/webgl-materials/Material';
import Color from 'famous/utilities/Color';
import Camera from 'famous/components/Camera';

/*
	Register custom Materials
*/

Material.registerExpression('vec3Texture', { glsl: 'texture2D($TEXTURE, v_TextureCoordinate).rgb;', output: 3 });
Material.registerExpression('heightFromTexture', { glsl: 'vec3(0.0, 0.0, length(texture2D($TEXTURE, v_TextureCoordinate).rgb)) * normals;', output: 3 });
Material.registerExpression('specTexture', { glsl: 'vec4(0.6, 0.6, 0.6, 500.0 - length(texture2D($TEXTURE, v_TextureCoordinate).rgb) * 500.);', output: 4 });

/*
	Instantiate custom materials with desired textures
*/

var diffuseMap  = Material.image([], { texture: 'images/brick-diffuse-map.png' });
var normalMap   = Material.vec3Texture([], { texture: 'images/brick-normal-map.png' });
var heightMap   = Material.heightFromTexture([], { texture: 'images/brick-height-map.png' });
var specularMap = Material.specTexture([], { texture: 'images/brick-specular-map.png' });

/*
	Create context and camera
*/

var ctx = Famous.createContext();
var camera = new Camera(ctx);
	camera.setDepth(1000);

/*
	Create mesh node
*/

var texturedNode = ctx.addChild()
	.setAlign(0.5, 0.5, 0.5)
	.setMountPoint(0.5, 0.5, 0.5)
	.setOrigin(0.5, 0.5, 0.5)
	.setSizeMode(1, 1, 1) // absolute size
	.setAbsoluteSize(800, 800, 75)

/*
	Add WebGL mesh
*/

var mesh = new Mesh(texturedNode)
	.setGeometry('Plane', { detail: 250 })
	.setBaseColor(diffuseMap)
	// .setBaseColor(new Color('pink'))
	.setNormals(normalMap)
	.setPositionOffset(heightMap)
	.setGlossiness(specularMap)
	// .setGlossiness(new Color('white'), 300)

/*
	Create mesh node
*/

var lightNode = ctx.addChild()
	.setAlign(0.5, 0.5, 0.5)
	.setMountPoint(0.5, 0.5, 0.5)
	.setSizeMode(1, 1, 1)
	.setAbsoluteSize(50, 50, 50);

var light = new PointLight(lightNode);
	light.setColor(new Color('white'))

/*
	Update function
*/

Famous.getClock().setInterval(function update() {
	var time = Date.now();

	texturedNode.setRotation(Math.sin(time * 0.001) * 0.1, Math.cos(time * 0.001) * 0.1, 0);
	lightNode.setPosition(Math.sin(time * 0.0014) * 200, Math.sin(time * 0.0010) * 200, 200);
}, 16);

/*
	Attach to scene
*/

ctx.addChild(lightNode);
ctx.addChild(texturedNode);
