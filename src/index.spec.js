var expect = require('chai').expect;
var fauna = require('./index.js');

describe('iterate test', function() {
  it('simple iteration', function() {
    const expandedString = fauna.iterate('a', {'a': 'bab'}, 2);
    expect(expandedString).to.be.equal('bbabb');
  });

  it('simple iteration', function() {
    const expandedString = fauna.iterate('a', {'a': 'bac', 'c': 'ddd'}, 4);
    expect(expandedString).to.be.equal('bbbbacddddddddd');
  });
});
