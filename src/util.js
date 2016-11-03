const fs = require('fs');
const fauna = require('./index.js');

// This function is used to generate golden data for
// index.spec.js
function generateTestdata() {
  const props = {
    'stroke': '#000',
    'stroke-linecap': 'butt',
    'stroke-linejoin': 'miter',
    'stroke-width': '1px',
    'stroke-opacity': '1.0',
    'stroke-dasharray': '20 20',
    'stroke-dashoffset': '10.0',
  };
  const iterations = 2;
  const axiom = 'L';
  const rules = {
    "L": "c+R[]F-L[]FL-FR+",
    "R": "-LF+RFR+FL-"
  };
  const length = 5;
  const alpha = 90;
  const lengthGrowth = 0;
  const alphaGrowth = 0;
  const pathName = 'path1';
  const stream = fauna.iterate(axiom, rules, iterations);
  let stacks = [];
  const stack = fauna.toCommands(length, alpha, lengthGrowth, alphaGrowth, stream); 
  stacks.push(stack);
  const stacksString = JSON.stringify(stacks);
  const propsString = JSON.stringify(props);
  const svg = fauna.toSvg(stacks, pathName, props);
  fs.writeFile('src/testdata/expected.svg', svg, function(err) {
    if(err) {
      throw err;
    }
  });
  fs.writeFile('src/testdata/stacks.json', stacksString, function(err) {
    if(err) {
      throw err;
    }
  });
  fs.writeFile('src/testdata/props.json', propsString, function(err) {
    if(err) {
      throw err;
    }
  });
}

generateTestdata();
