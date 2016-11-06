const expect = require('chai').expect;
const rewire = require('rewire');
const fauna = rewire('./index.js');
const util = require('util');
const fs = require('fs');

const pathString = fauna.__get__('pathString');
const boundingBox = fauna.__get__('boundingBox');
const animateElement = fauna.__get__('animateElement');
const pathElement = fauna.__get__('pathElement');
const pathLength = fauna.__get__('pathLength');
const renderPath = fauna.__get__('renderPath');
const styleElement = fauna.__get__('styleElement');

describe('iterate test', function() {
  it('should iterate properly 1', function(done) {
    const actual = fauna.iterate('L', {'L': 'LFLR+'}, 2);
    const expected = 'LFLR+FLFLR+R+';
    expect(actual).to.be.equal(expected);
		done();
  });

  it('should iterate properly 2', function(done) {
    const actual = fauna.iterate('a', {'a': 'bac', 'c': 'ddd'}, 4);
    const expected = 'bbbbacddddddddd';
    expect(actual).to.be.equal(expected);
		done();
  });
});

describe('toCommands test', function() {
  it('covert stream', function(done) {
    const expected = [ { c: 'M', x: 0, y: 0 },
                       { c: 'l', x: 0, y: -1 },
                       { c: 'l', x: 1, y: 0 },
                       { c: 'l', x: 1, y: 0 } ];
    const actual = fauna.toCommands(1, 90, 0.1, 0.1, 'LFLR+FLFLR+R+');
    expect(actual).to.be.deep.equal(expected);
		done();
	});
});

describe('pathString test', function() {
  it('should compose the pathString', function(done) {
    const stack = [{ c: 'M', x: 0, y: 0 },
							 		 { c: 'l', x: 0, y: 0 },
								 	 { c: 'l', x: 0, y: 0 },
									 { c: 'l', x: 0, y: 0 }];
    const expected = 'M 0 0 l 0 0 l 0 0 l 0 0';
    const actual = pathString(stack);
    expect(actual).to.be.equal(expected);
		done();
	});
});

describe('boundingBox test', function() {
  it('should calculate the bounding box properly', function(done) {
    const stack1 = [{ c: 'M', x: -4, y: 0 },
							 	 	  { c: 'M', x: 0, y: -4 },
								 	  { c: 'M', x: 4, y: 0 },
									  { c: 'M', x: 0, y: 4 }];
    const stack2 = [{ c: 'M', x: -8, y: 0 },
							 		  { c: 'M', x: 0, y: -8 },
								 	  { c: 'M', x: 0, y: 0 },
									  { c: 'M', x: 0, y: 0 }];
    const stacks = [stack1, stack2];
    const expected = {'minX': -8, 'minY': -8, 'maxX': 4, 'maxY': 4};
    const actual = boundingBox(stacks);
    expect(actual).to.be.deep.equal(expected);
		done();
	});
});

describe('animationElement test', function() {
  it('should produce an animate xml element properly', function(done) {
    const fromPath = '1 2 1';
    const toPath = '3 4 3';
    const duration = 20;
    const expected = [{_attr:{
			attributeName: 'd',
      begin: '0s',
      dur: '20s',
      values: '1 2 1;3 4 3;1 2 1;',
      repeatCount: 'indefinite'
    }}];
    const actual = animateElement(fromPath, toPath, duration);
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe('pathElement test', function() {
  it('should produce an path xml element properly', function(done) {
    const path = '1 2 1';
    const name = 'pathname';
    const minX = minY = -10;
    const animateEls = [{animate: {_attr:{
			attributeName: 'd',
      begin: '0s',
      dur: 20,
      values: '1 2 1;3 4 3;1 2 1;',
      repeatCount: 'indefinite'
    }}}];
    const expected = [ { _attr: { d: '1 2 1', id: 'pathname', transform: 'translate(10,10)', class: 'pathname' } }, { animate: { animate: { _attr: { attributeName: 'd', begin: '0s', dur: 20, values: '1 2 1;3 4 3;1 2 1;', repeatCount: 'indefinite' } } } } ];
    const actual = pathElement(path, name, minX, minY, animateEls);
    //console.log(util.inspect(actual, false, null));
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe('pathLength test', function() {
  it('should calculate the length of a path', function(done) {
		const stack = [{c: 'M', x:0, y:0}, {c: 'l', x:3, y:3}];
		const expected = Math.sqrt(18);
		const actual = pathLength(stack);
		expect(actual).to.be.equal(expected);
		done();
  });
});

describe('renderPath test', function() {
  it('should render path correctly', function(done) {
    const pathName = 'test1';
		const stack1 = [{c: 'M', x:0, y:0}, {c: 'l', x:3, y:3}];
    const stacks = [stack1];
    const expected = { path: [ { _attr: { d: 'M 0 0 l 3 3', id: 'test1',transform: 'translate(0,0)',class: 'test1' } } ],box: { minX: 0, minY: 0, maxX: 3, maxY: 3 },length: 4.242640687119285 };
    const actual = renderPath(stacks, pathName);
    //console.log(util.inspect(actual, false, null));
    expect(actual).to.be.deep.equal(expected);
    done();
	});
});

describe('styleElement test', function() {
  it('should produce style element correctly', function(done) {
    const props = {
			'stroke': '#FFF',
			'stroke-linecap': 'butt',
			'stroke-linejoin': 'miter',
			'stroke-width': '1px',
			'stroke-opacity': '1.0',
			'stroke-dasharray': '20 20',
			'stroke-dashoffset': '10.0',
		};
    const pathName = 'test1';
    const expected = '.test1 {\n    stroke: #FFF;\n    stroke-linecap: butt;\n    stroke-linejoin: miter;\n    stroke-width: 1px;\n    stroke-opacity: 1.0;\n    stroke-dasharray: 20 20;\n    stroke-dashoffset: 10.0;\n  }';
    const actual = styleElement(props, pathName);
    expect(actual).to.be.deep.equal(expected);
    done();
	});
});

describe('toSvg test', function() {
  it('should produce an SVG', function(done) {
    const pathName = 'path1';
		const props = JSON.parse(fs.readFileSync('./src/testdata/props.json', 'utf8'));
		const stacks = JSON.parse(fs.readFileSync('./src/testdata/stacks.json', 'utf8'));
		const expected = fs.readFileSync('./src/testdata/expected.svg', 'utf8');
    const actual = fauna.toSvg(stacks, pathName, props); 
    expect(actual).to.be.equal(expected);
    done();
  });
});

describe('runConfig test', function() {
  it('should produce an SVG', function(done) {
		const config = JSON.parse(fs.readFileSync('./configs/hilbert.json', 'utf8'));
		const expected = fs.readFileSync('./src/testdata/hilbert-expected.svg', 'utf8');
    const actual = fauna.runConfig(config);
    expect(actual).to.be.equal(expected);
    done();
  });
});
