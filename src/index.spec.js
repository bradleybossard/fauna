const expect = require('chai').expect;
const rewire = require('rewire');
const fauna = rewire('./index.js');

const pathString = fauna.__get__('pathString');

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

describe('toCommand test', function() {
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

describe('toCommand test', function() {
  it('covert stream', function(done) {
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



