exports.iterate = function(axiom, rules, iterations) {
  for (var i = 0; i < iterations; i++) {
    axiom = axiom.replace(/\w/g, function(c) {
      return rules[c] || c;
    });
  }
  return axiom;
}

exports.toCommands = function(length, alpha, lengthGrowth, alphaGrowth, stream) {
  let point = {'x': 0, 'y': 0}; 
  let angle = -90;
  let pathLength = 0;
  let stack = [];
  let tempStack = [];

  stack.push({'c': 'M', 'x': 0, 'y': 0});

  for (var c in stream) {
    switch(stream[c]) {
      case '(':
        alpha *= 1 - angleGrowth;
        break;
      case ')':
        alpha *= 1 + angleGrowth;
        break;
      case '<':
        lineLength *= 1 - lengthGrowth;
        break;
      case '>':
        lineLength *= 1 + lengthGrowth;
        break;
      case 'F':
        const deltaX = lineLength * Math.cos(Math.PI / 180 * angle)
        const deltaY = lineLength * Math.sin(Math.PI / 180 * angle)
        stack.push({'c': 'l', 'x': 0, 'y': 0});
        point.x += deltaX;
        point.y += deltaY;
        break;
      case '+':
        angle += alpha;
        break;
      case '-':
        angle -= alpha;
        break;
      case '[':
        tempStack.push({'angle': angle, 'point': point, 'alpha': alpha});
        break;
      case ']':
        angle, point, alpha = tempStack.pop()
        break;
      case '!':
        angle *= -1.0;
        break;
      case '|':
        angle += 180;
        break;
    }
    return stack;
  }
}

exports.toPaths = function(stack) {

}

