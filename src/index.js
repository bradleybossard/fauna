const xml = require('xml');

function pathString(stack) {
	let path = [];
	stack.forEach(function(p) {
		path.push(`${p.c} ${p.x} ${p.y}`);
	});
	return path.join(' ');
}

function boundingBox(stacks) {
	let x = y = 0;
	let minX = minY = Infinity;
	let maxX = maxY = -Infinity;
	stacks.forEach(function(stack) {
		stack.forEach(function(p) {
			x = (p.c === 'M') ? p.x : x + p.x;
			y = (p.c === 'M') ? p.y : y + p.y;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		});
	});
	return {'minX': minX, 'minY': minY, 'maxX': maxX, 'maxY': maxY};
}

function pathLength(stack) {
  let length = 0.0;
  let x = y = 0;
  stack.forEach(function(p) {
    if (p.c == 'l') {
      let xDiff = p.x - x;
      let yDiff = p.y - y;
			length += Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
		}
    ({x, y} = p);
	});
  return length;
}

function animateElement(fromPath, toPath, duration) {
  const valuesPath = `${fromPath};${toPath};${fromPath};`;
  return [{animate: {_attr:{
    attributeName: 'd',
    begin: '0s',
    dur: duration,
    values: valuesPath,
    repeatCount: 'indefinite'
  }}}];
}

function pathElement(path, name, minX, minY, animateEls) {
  const attrs =  {
		d : path,
    id: name,
		transform: `translate(${-minX},${-minY})`,
    class: name 
  };
  let root = [
    {_attr: attrs},
  ];

	animateEls.forEach(function(el) {
    root.push({'animate': el});
	});

  return root;
}

function shufflePath(stack) {
  // TODO(bradleybossard) : Implment this function
}

function renderPath(stacks, pathName) {
  let animateEls = [];
  const fromStack = stacks[0];
  const box = boundingBox(stacks);
  const fromPath = pathString(fromStack);
  const fromLength = pathLength(fromStack); 

  if (stacks.length > 1) {
    const toStack = stacks[1];
    const animateEl = animateElement(fromPath, toPath, 10); 
    animateEls.push(animateEl);
	}
  const pathSvg = pathElement(fromPath, pathName, box.minX, box.minY, animateEls);
  return {path: pathSvg, box: box, length: fromLength};
}

function styleElement(props, pathName) {
  return `.${pathName} {
    stroke: ${props.stroke};
    stroke-linecap: ${props['stroke-linecap']};
    stroke-linejoin: ${props['stroke-linejoin']};
    stroke-width: ${props['stroke-width']};
    stroke-opacity: ${props['stroke-opacity']};
    stroke-dasharray: ${props['stroke-dasharray']};
    stroke-dashoffset: ${props['stroke-dashoffset']};
  }`;
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

  for(let i = 0, c =''; c = stream.charAt(i); i++) {
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
        let deltaX = lineLength * Math.cos(Math.PI / 180 * angle)
        let deltaY = lineLength * Math.sin(Math.PI / 180 * angle)
        deltaX = Math.abs(deltaX) < 0.000001 ? 0 : deltaX;
        deltaY = Math.abs(deltaY) < 0.000001 ? 0 : deltaY;
        stack.push({'c': 'l', 'x': deltaX, 'y': deltaY});
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
        ({angle, point, alpha} = tempStack.pop());
        stack.push({'c': 'M', 'x': point.x, 'y': point.y});
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

exports.toSvg = function(stacks, pathName, props) {
  const path = renderPath(stacks, pathName);
  const style = styleElement(props, pathName);
  const svgWidth = path.box.maxX - path.box.minX;
  const svgHeight = path.box.maxY - path.box.minY;

  const attrs = {
    'viewBox': `0 0 ${svgWidth} ${svgHeight}`,
    'width': svgWidth,
    'height': svgHeight,
    'xmlns:cc': 'http://creativecommons.org/ns#',
    'xmlns:dc': 'http://purl.org/dc/elements/1.1',
    'xmlns:rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'xmlns:svg': 'http://www.w3.org/2000/svg',
		'xmlns:xlink' : 'http://www.w3.org/1999/xlink',
    'xmlns': 'http://www.w3.org/2000/svg',
	};

  const use = {'_attr': {
    'x': 0,
    'y': 0,
    'class': pathName,
    'xlink:href': '#' + pathName
	}};

  const defs = [{path: path.path}];

  let root = [{svg: [
    {_attr: attrs},
    {style: style},
    {use: use},
    {defs: defs}
  ]}];

  return xml(root);
}

