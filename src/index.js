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
  let lineLength = length;
  let tempStack = [];
  let stack = [{'c': 'M', 'x': 0, 'y': 0}];

  for(var i = 0, c =''; c = stream.charAt(i); i++){
    switch(c) {
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
  }
  return stack;
}

exports.toPaths = function(stack) {
  const xml = require('xml');
 
  function pathString(stack) {
    let path = [];
    stack.forEach(function(p) {
      path.push(`${p.c} ${p.x} ${p.y}`);
    });
    return path.join(' ');
  }

  return pathString(stack);
}

