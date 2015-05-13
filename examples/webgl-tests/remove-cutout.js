import Famous from 'famous/core/Famous';
import Mesh from 'famous/webgl-renderables/Mesh';
import Color from 'famous/utilities/Color';
import DOMElement from 'famous/dom-renderables/DOMElement';

var ctx = Famous.createContext('body');

/*
	Create shared node
*/

var centerNode = ctx.addChild()
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

var domEl = new DOMElement(domNode, { cutout: false })
	.setProperty('background-color', 'blue');

/*
	Create meshNode
*/

var meshNode = centerNode.addChild()
	.setMountPoint(0.5, 0.5, 0.5)
	.setAlign(0.5, 0.5, 0.5)
	.setOrigin(0.5, 0.5, 0.5);

var mesh = new Mesh(meshNode)
	.setGeometry('Sphere')
	.setBaseColor(new Color('pink'));

/*
	Update loop
*/

var cutoutStatus = false;
Famous.getClock().setInterval(function() {
	var time = Date.now();

	meshNode.setRotation(0, Math.sin(time * 0.001) * 2.0, 0);
	domNode.setRotation(0, Math.sin(time * 0.001) * 3.0, 0);

	if (Math.random() < 0.01) domEl.setCutoutState((cutoutStatus = !cutoutStatus));
}, 16);
