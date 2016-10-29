const expect = require('chai').expect;
const rewire = require('rewire');
const fauna = rewire('./index.js');
//const util = require('util');

const pathString = fauna.__get__('pathString');
const boundingBox = fauna.__get__('boundingBox');
const animateElement = fauna.__get__('animateElement');
const pathElement = fauna.__get__('pathElement');
const pathLength = fauna.__get__('pathLength');
const renderPath = fauna.__get__('renderPath');

describe('iterate test', function() {
  it('simple iteration', function(done) {
    const expandedString = fauna.iterate('L', {'L': 'LFLR+'}, 2);
    expect(expandedString).to.be.equal('LFLR+FLFLR+R+');
		done();
  });

  it('simple iteration', function(done) {
    const expandedString = fauna.iterate('a', {'a': 'bac', 'c': 'ddd'}, 4);
    expect(expandedString).to.be.equal('bbbbacddddddddd');
		done();
  });
});

describe('toCommands test', function() {
  it('covert stream', function(done) {
    const expected = [{ c: 'M', x: 0, y: 0 },
											{ c: 'l', x: 0, y: 0 },
											{ c: 'l', x: 0, y: 0 },
											{ c: 'l', x: 0, y: 0 }];
    const commands = fauna.toCommands(1, 30, 0.1, 0.1, 'LFLR+FLFLR+R+');
    expect(commands).to.be.deep.equal(expected);
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
    const path = pathString(stack);
    expect(path).to.be.equal(expected);
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
    const box = boundingBox(stacks);
    expect(box).to.be.deep.equal(expected);
		done();
	});
});

describe('animationElement test', function() {
  it('should produce an animate xml element properly', function(done) {
    const fromPath = '1 2 1';
    const toPath = '3 4 3';
    const duration = 20;
    const expected = [{animate: {_attr:{
			attributeName: 'd',
      begin: '0s',
      dur: 20,
      values: '1 2 1;3 4 3;1 2 1;',
      repeatCount: 'indefinite'
    }}}];
    const el = animateElement(fromPath, toPath, duration);
    expect(el).to.be.deep.equal(expected);
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
    const expected = [ { path: { _attr: { d: '1 2 1', id: 'pathname', transform: 'translate(-10,-10)', class: 'aqua' } } }, { animate: { _attr: { attributeName: 'd', begin: '0s', dur: 20, values: '1 2 1;3 4 3;1 2 1;', repeatCount: 'indefinite' } } } ];
    const el = pathElement(path, name, minX, minY, animateEls);
    expect(el).to.be.deep.equal(expected);
    done();
  });
});

describe('pathLength test', function() {
  it('should calculate the length of a path', function(done) {
		const stack = [{c: 'M', x:0, y:0}, {c: 'l', x:3, y:3}];
		const expected = Math.sqrt(18);
		const length = pathLength(stack);
		expect(length).to.be.equal(expected);
		done();
  });
});

describe('renderPath test', function() {
  it('should render path correctly', function(done) {
    const pathName = 'test1';
		const stack1 = [{c: 'M', x:0, y:0}, {c: 'l', x:3, y:3}];
    const stacks = [stack1];
    const expected = {path:[{path:{_attr:{d:"M 0 0 l 3 3",id:"test1",transform:"translate(undefined,0)",class:"aqua"}}}],box:{minX:0,minY:0,maxX:3,maxY:6},length:4.242640687119285};
    const actual = renderPath(stacks, pathName);
    expect(actual).to.be.deep.equal(expected);
    done();
	});
});

