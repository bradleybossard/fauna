'use strict';

var fs = require('fs');
var fauna = require('./index.js');

// This function is used to generate golden data for
// index.spec.js
function generateTestdata() {
  var props = {
    'stroke': '#000',
    'stroke-linecap': 'butt',
    'stroke-linejoin': 'miter',
    'stroke-width': '1px',
    'stroke-opacity': '1.0',
    'stroke-dasharray': '20 20',
    'stroke-dashoffset': '10.0'
  };
  var iterations = 2;
  var axiom = 'L';
  var rules = {
    "L": "c+R[]F-L[]FL-FR+",
    "R": "-LF+RFR+FL-"
  };
  var length = 5;
  var alpha = 90;
  var lengthGrowth = 0;
  var alphaGrowth = 0;
  var pathName = 'path1';
  var stream = fauna.iterate(axiom, rules, iterations);
  var stacks = [];
  var stack = fauna.toCommands(length, alpha, lengthGrowth, alphaGrowth, stream);
  stacks.push(stack);
  var stacksString = JSON.stringify(stacks);
  var propsString = JSON.stringify(props);
  var svg = fauna.toSvg(stacks, pathName, props);
  fs.writeFile('src/testdata/expected.svg', svg, function (err) {
    if (err) {
      throw err;
    }
  });
  fs.writeFile('src/testdata/stacks.json', stacksString, function (err) {
    if (err) {
      throw err;
    }
  });
  fs.writeFile('src/testdata/props.json', propsString, function (err) {
    if (err) {
      throw err;
    }
  });
}

generateTestdata();