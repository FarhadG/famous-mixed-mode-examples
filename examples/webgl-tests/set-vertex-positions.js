import DynamicGeometry from 'famous/webgl-geometries/DynamicGeometry';
import Mesh from 'famous/webgl-renderables/Mesh';
import FamousEngine from 'famous/core/FamousEngine';

module.exports = function init(scene) {
    var clock = FamousEngine.getClock();

    var rootNode = scene.addChild()
        .setAlign(0.5, 0.5, 0.5)
        .setOrigin(0.5, 0.5, 0.5)
        .setMountPoint(0.5, 0.5, 0.5)
        .setSizeMode(1, 1, 1)
        .setAbsoluteSize(500, 500);

    var geometry = new DynamicGeometry();

    var mesh = new Mesh(rootNode);
        mesh.setGeometry(geometry);

    var vtxPositions = [-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0];

    clock.setInterval(function update() {
        var time = clock.getTime();

        let c = (Math.cos(time * 0.001) * 0.5) + 0.5;
        let s = (Math.sin(time * 0.001) * 0.5) + 0.5;
        vtxPositions[0] = c * -1;
        vtxPositions[3] = c;
        vtxPositions[6] = s * -1;
        vtxPositions[9] = s;
        geometry.setVertexPositions(vtxPositions);
        mesh.setGeometry(geometry)
    }, 16);
}