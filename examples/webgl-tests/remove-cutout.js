import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Material from 'famous/webgl-materials/Material';
import DOMElement from 'famous/dom-renderables/DOMElement';

var scene = FamousEngine.createScene('body');

/*
	Create shared node
*/

var centerNode = scene.addChild()
	.setMountPoint(0.5, 0.5, 0.5)
	.setAlign(0.5, 0.5, 0.5)
	.setSizeMode(1, 1, 1)
	.setAbsoluteSize(300, 300, 300);

/*
	Create DOMNode
*/

var domNode = centerNode.addChild()
	.setMountPoint(0.5, 0.5, 0.5)
	.setAlign(0.5, 0.5, 0.5)
	.setOrigin(0.5, 0.5, 0.5);

var content = '', i = 119;
while (i--) content += 'DOM ';

var domEl = new DOMElement(domNode, { cutout: false })
	.setContent(content);

/*
	Create meshNode
*/

var meshNode = centerNode.addChild()
	.setMountPoint(0.5, 0.5, 0.5)
	.setAlign(0.5, 0.5, 0.5)
	.setOrigin(0.5, 0.5, 0.5);

var mesh = new Mesh(meshNode)
	.setGeometry('GeodesicSphere')
	.setBaseColor(Material.normal());

/*
	Update loop
*/

var cutoutStatus = false;
FamousEngine.getClock().setInterval(function() {
	var time = Date.now();

	meshNode.setRotation(0, Math.sin(time * 0.001) * 2.0, 0);
	domNode.setRotation(0, Math.sin(time * 0.001) * 3.0, 0);

	if (Math.random() < 0.01) domEl.setCutoutState((cutoutStatus = !cutoutStatus));
}, 16);
