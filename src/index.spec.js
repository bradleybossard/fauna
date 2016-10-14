var expect = require('chai').expect;
var fauna = require('./index.js');

describe('iterate test', function() {
  it('simple iteration', function() {
    const expandedString = fauna.iterate('L', {'L': 'LFLR+'}, 2);
    expect(expandedString).to.be.equal('LFLR+FLFLR+R+');
  });

  it('simple iteration', function() {
    const expandedString = fauna.iterate('a', {'a': 'bac', 'c': 'ddd'}, 4);
    expect(expandedString).to.be.equal('bbbbacddddddddd');
  });
});

describe('toCommand test', function() {
  it('covert stream', function() {
    //const expandedString = fauna.iterate('a', {'a': 'bab'}, 2);
    //expect(expandedString).to.be.equal('bbabb');
    const commands = fauna.toCommands(1, 30, 0.1, 0.1, 'bbabb');
  });
});
