function iterate(axiom, rules, iterations) {
  for (var i = 0; i < iterations; i++) {
    axiom = axiom.replace(/\w/g, function(c) {
      return rules[c] || c;
    });
  }
}

export {
  iterate: iterate
}
