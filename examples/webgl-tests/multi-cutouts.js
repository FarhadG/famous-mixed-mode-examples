import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Material from 'famous/webgl-materials/Material';
import DOMElement from 'famous/dom-renderables/DOMElement';

var material = Material.normal();

function init(scene) {
	/*
		Create shared node
	*/

	var centerNode = scene.addChild()
		.setMountPoint(0.5, 0.5, 0.5)
		.setAlign(0.5, 0.5, 0.5)
		.setSizeMode(1, 1, 1)
		.setAbsoluteSize(800, 800, 800);

	/*
		Update loop
	*/

	var sphereCutouts = [];
	var n = 5;
	var i = n;
	while (i--) {
		sphereCutouts.push(
			new CutoutSphere(
				centerNode.addChild(),
				{
					align: [i * 1/n, 0.5, 0.5],
					size: [1/n, 1/n, 1/n]
				}
			)
		);
	}

	var cutoutStatus = false;
	FamousEngine.getClock().setInterval(function() {
		var time = Date.now();

		for (var i = 0; i < sphereCutouts.length; i++) {
			sphereCutouts[i].meshNode.setRotation(0, Math.sin(time * 0.001) * 2.0, 0);
			sphereCutouts[i].domNode.setRotation(0, Math.sin(time * 0.001) * 3.0, 0);
		};
	}, 16);
}

class CutoutSphere {
	constructor(node, options) {
		
		/*
			Create DOMNode
		*/

		this.domNode = node.addChild()
			.setMountPoint(0.5, 0.5, 0.5)
			.setAlign(options.align[0], options.align[1], options.align[2])
			.setProportionalSize(options.size[0], options.size[1], options.size[2])
			.setOrigin(0.5, 0.5, 0.5);

		var content = '', i = 20;
		while (i--) content += 'DOM ';

		var domEl = new DOMElement(this.domNode)
			.setContent(content);

		/*
			Create meshNode
		*/

		this.meshNode = node.addChild()
			.setMountPoint(0.5, 0.5, 0.5)
			.setAlign(options.align[0], options.align[1], options.align[2])
			.setProportionalSize(options.size[0], options.size[1], options.size[2])
			.setOrigin(0.5, 0.5, 0.5);

		var mesh = new Mesh(this.meshNode)
			.setGeometry('GeodesicSphere')
			.setBaseColor(material);
	}
}