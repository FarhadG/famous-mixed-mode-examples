'use strict';

var Compositor = require('famous/renderers/Compositor');
var ThreadManager = require('famous/renderers/ThreadManager');
var Engine = require('famous/engine/Engine');
var Famous = require('famous/core/Famous');
require('famous/stylesheets');

// Boilerplate

var compositor = new Compositor();
var engine = new Engine();
var threadManager = new ThreadManager(Famous.getChannel(), compositor, engine);

// App Code

// require('../examples/webgl-tests/multi-texture');
// require('../examples/webgl-tests/add-remove');
// require('../examples/webgl-tests/cutout-layering');
// require('../examples/webgl-tests/primitives');
require('../examples/webgl-tests/stress-test');

