import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Color from 'famous/utilities/Color';
import DOMElement from 'famous/dom-renderables/DOMElement';

var scene = FamousEngine.createScene('body');
var child = scene.addChild();

function add() {
	child = DOMWebGLNode();

	setTimeout(remove, 1000);
}

function remove() {
	scene.removeChild(child);

	setTimeout(add, 1000);
}

add();

function DOMWebGLNode() {
	child = scene.addChild()
		.setProportionalSize(0.5, 0.5, 0.5)
		.setMountPoint(0.5, 0.5, 0.5)
		.setAlign(0.5, 0.5, 0.5)

	var element = new DOMElement(child);
		element.setProperty('background-color', 'blue')

	var mesh = new Mesh(child)
		.setGeometry('Circle')
		.setBaseColor(new Color('pink'))

	return child
}

FamousEngine.getClock().setInterval(function() {
	var time = Date.now();

	child.setPosition(Math.sin(time * 0.01) * 300, 0, 0);
}, 16);