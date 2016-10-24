const xml = require('xml');

function pathString(stack) {
	let path = [];
	stack.forEach(function(p) {
		path.push(`${p.c} ${p.x} ${p.y}`);
	});
	return path.join(' ');
}

function boundingBox(stack) {
	let x = y = 0;
	let minX = minY = Infinity;
	let maxX = maxY = -Infinity;
	stack.forEach(function(p) {
		x = (p.c === 'M') ? p.x : x + p.x;
		y = (p.c === 'M') ? p.y : x + p.y;
		minX = Math.min(minX, x);
		minY = Math.min(minY, y);
		maxX = Math.max(maxX, x);
		maxY = Math.max(maxY, y);
	});
	return {'minX': minX, 'minY': minY, 'maxX': maxX, 'maxY': maxY};
}

function animateElement(fromPath, toPath, duration) {
  const valuesPath = `${fromPath};${toPath};${fromPath};`;
  let elem = [{animate: {_attr:{
    attributeName: 'd',
    begin: '0s',
    dur: duration,
    values: valuesPath,
    repeatCount: 'indefinite'
  }}}];

 return xml(elem);
}

exports.iterate = function(axiom, rules, iterations) {
  for (let i = 0; i < iterations; i++) {
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

  for(let i = 0, c =''; c = stream.charAt(i); i++){
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

 
  return pathString(stack);
}

