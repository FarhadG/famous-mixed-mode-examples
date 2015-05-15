import FamousEngine from 'famous/core/FamousEngine';
import Mesh from 'famous/webgl-renderables/Mesh';
import Color from 'famous/utilities/Color';
import DOMElement from 'famous/dom-renderables/DOMElement';

module.exports = function init(scene) {
    var child;

    function add() {
        child = DOMWebGLNode(scene);
        setTimeout(remove, 1000);
    }

    function remove() {
        scene.removeChild(child);
        setTimeout(add, 1000);
    }

    add();

    FamousEngine.getClock().setInterval(function() {
        var time = Date.now();

        child.setPosition(Math.sin(time * 0.01) * 300, 0, 0);
    }, 16);
}

function DOMWebGLNode(node) {
    var child = node.addChild()
        .setSizeMode(0, 0, 0)
        .setProportionalSize(0.5, 0.5, 0.5)
        .setMountPoint(0.5, 0.5, 0.5)
        .setAlign(0.5, 0.5, 0.5)

    var element = new DOMElement(child);
        element.setProperty('background-color', 'blue')

    var mesh = new Mesh(child)
        .setGeometry('Circle')
        .setBaseColor(new Color('pink'))

    return child;
}