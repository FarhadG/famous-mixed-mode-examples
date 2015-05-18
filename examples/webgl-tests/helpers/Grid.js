import Size from 'famous/components/Size';
import Position from 'famous/components/Position';
import Node from 'famous/core/Node';

export class Grid extends Node {
    constructor(options) {
        super();

        this.children = [];

        createChildren.call(this,
            options.dimensions,
            options.padding
        );
    }

    get(index) {
        return this.children[index];
    }
}

function createChildren (dimensions, padding) {
    var child;
    var alignX = 1 / dimensions[0];
    var alignY = 1 / dimensions[1];

    for (var i = 0; i < dimensions[0]; i++) {
        for (var j = 0; j < dimensions[1]; j++) {
            child = this.addChild()
                .setAlign(alignX * j, alignY * i, 0.5)
                .setProportionalSize(alignX, alignY)
                .setPosition(padding * j, padding * i)

            this.children.push(child);
        }
    }
}