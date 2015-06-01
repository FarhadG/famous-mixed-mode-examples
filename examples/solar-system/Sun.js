/**
 * Module dependencies
 */
var Origin = require('famous/components/Origin');
var Rotation = require('famous/components/Rotation');
var Position = require('famous/components/Position');
var Align = require('famous/components/Align');
var Origin = require('famous/components/Origin');
var MountPoint = require('famous/components/MountPoint');
var PointLight = require('famous/webgl-renderables/lights/PointLight');
var AmbientLight = require('famous/webgl-renderables/lights/AmbientLight');
var DynamicGeometry = require('famous/webgl-geometries/DynamicGeometry');
var Material = require('famous/webgl-materials/Material');
var Sphere = require('famous/webgl-geometries/primitives/Sphere');
var Size = require('famous/components/Size');
var Mesh = require('famous/webgl-renderables/Mesh');
var Color = require('famous/utilities/Color');

/**
 * Create a dynamic geometry from a sphere
 */
var sunGeometry = new DynamicGeometry();
sunGeometry.fromGeometry(new Sphere({ detail: 100 }));

/**
 * Fill displacement buffer with the same number of values
 * as the indices of the geometry.
 */
var displacement = [];
var vertexLength = sunGeometry.getLength();
for(var i = 0; i < vertexLength; i++) {
    displacement.push(Math.random());
}


/**
 * Insert the displacement values into the buffer
 */
sunGeometry.setVertexBuffer('a_Displacement', displacement, 1);

/**
 * Custom expression for the vertex shader
 */
var shader =
    `vec3 sunDisplacement() {
        v_Displacement = a_Displacement;
        return a_normals * vec3(a_Displacement * 10.0 * u_Amplitude);
    }`;

/**
 * Register the custom expression inside of the material graph
 */
Material.registerExpression('sunVertex', {
    output: 3,
    glsl: 'sunDisplacement();',
    defines: shader
});

/**
 * Set the various variables' default values and types
 * E.g. 1 is the value as well as it being a float (scalar)
 *      [1, 1] represents a vec2(1.0, 1.0)
 */
var sunVertex = Material.sunVertex(null, {
    attributes: {
        a_Displacement: 1
    },
    uniforms: {
        u_Amplitude: 1
    },
    varyings: {
        v_Displacement: 1
    }
});

/**
 * Custom expression for the fragment shader.
 * The amplitude uniform (u_Amplitude) is being used
 * to clamp the color values.
 */
Material.registerExpression('sunFragment', {
    output: 4,
    glsl:
        `vec4(
            clamp(v_Displacement * u_Amplitude * 3.0, 0.0, 1.0),
            clamp(v_Displacement * u_Amplitude * 3.0 - 1.0, 0.0, 1.0),
            clamp(v_Displacement * u_Amplitude * 3.0 - 2.0, 0.0, 1.0),
            1.0
        );`,
});


/**
 * Variables for helping animate the geometry on every 'tick'
 */
var frame = 0;
var amplitude = 0;


function Sun(node) {
    this.dispatch = node;
    this.dispatch.setSizeMode(1, 1, 1);
    this._id = node.addComponent(this);

    this.mesh = new Mesh(this.dispatch);
    this.rotation = new Rotation(this.dispatch);
    this.position = new Position(this.dispatch);
    this.size = new Size(this.dispatch);
    this.align = new Align(this.dispatch);
    this.origin = new Origin(this.dispatch);
    this.pointLight = new PointLight(this.dispatch);
    this.pointLight.setColor(new Color('yellow'));

    /**
     * Set flat shading to 'True', so that the mesh is not affected
     * by any light source
     */
    this.mesh.setFlatShading(true);

    this.mesh.setGeometry(sunGeometry);
    this.mesh.setPositionOffset(sunVertex);
    this.mesh.setBaseColor(Material.sunFragment());
    this.size.setAbsolute(75, 75, 75);
    this.align.set(0.5, 0.5, 0.5);
    this.origin.set(0.5, 0.5, 0.5);
    this.position.setZ(100);

    this.dispatch.requestUpdate(this._id);
}


Sun.prototype.onUpdate = function() {
    /**
     * Rotate and expand/contract the geometry
     */
    var delta = Date.now() * 0.0003;
    this.rotation.setY(delta);
    amplitude = (0.1 * Math.sin(frame * 0.25) + 0.7);
    sunVertex.setUniform('u_Amplitude', amplitude);
    frame += 0.1;

    this.dispatch.requestUpdateOnNextTick(this._id);
};


/**
 * Expose
 */
module.exports = Sun;
