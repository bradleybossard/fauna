"use strict";

var expect = require("chai").expect;
var rewire = require("rewire");
var fauna = rewire("./index.js");
var util = require("util");
var fs = require("fs");

var pathString = fauna.__get__("pathString");
var boundingBox = fauna.__get__("boundingBox");
var animateElement = fauna.__get__("animateElement");
var pathElement = fauna.__get__("pathElement");
var pathLength = fauna.__get__("pathLength");
var renderPath = fauna.__get__("renderPath");
var styleElement = fauna.__get__("styleElement");

describe("iterate test", function () {
  it("should iterate properly 1", function (done) {
    var actual = fauna.iterate("L", { L: "LFLR+" }, 2);
    var expected = "LFLR+FLFLR+R+";
    expect(actual).to.be.equal(expected);
    done();
  });

  it("should iterate properly 2", function (done) {
    var actual = fauna.iterate("a", { a: "bac", c: "ddd" }, 4);
    var expected = "bbbbacddddddddd";
    expect(actual).to.be.equal(expected);
    done();
  });
});

describe("toCommands test", function () {
  it("covert stream", function (done) {
    var expected = [{ c: "M", x: 0, y: 0 }, { c: "l", x: 0, y: -1 }, { c: "l", x: 1, y: 0 }, { c: "l", x: 1, y: 0 }];
    var actual = fauna.toCommands(1, 90, 0.1, 0.1, "LFLR+FLFLR+R+");
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe("pathString test", function () {
  it("should compose the pathString", function (done) {
    var stack = [{ c: "M", x: 0, y: 0 }, { c: "l", x: 0, y: 0 }, { c: "l", x: 0, y: 0 }, { c: "l", x: 0, y: 0 }];
    var expected = "M 0 0 l 0 0 l 0 0 l 0 0";
    var actual = pathString(stack);
    expect(actual).to.be.equal(expected);
    done();
  });
});

describe("boundingBox test", function () {
  it("should calculate the bounding box properly", function (done) {
    var stack1 = [{ c: "M", x: -4, y: 0 }, { c: "M", x: 0, y: -4 }, { c: "M", x: 4, y: 0 }, { c: "M", x: 0, y: 4 }];
    var stack2 = [{ c: "M", x: -8, y: 0 }, { c: "M", x: 0, y: -8 }, { c: "M", x: 0, y: 0 }, { c: "M", x: 0, y: 0 }];
    var stacks = [stack1, stack2];
    var expected = { minX: -8, minY: -8, maxX: 4, maxY: 4 };
    var actual = boundingBox(stacks);
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe("animationElement test", function () {
  it("should produce an animate xml element properly", function (done) {
    var fromPath = "1 2 1";
    var toPath = "3 4 3";
    var duration = 20;
    var expected = [{
      _attr: {
        attributeName: "d",
        begin: "0s",
        dur: "20s",
        values: "1 2 1;3 4 3;1 2 1;",
        repeatCount: "indefinite"
      }
    }];
    var actual = animateElement(fromPath, toPath, duration);
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe("pathElement test", function () {
  it("should produce an path xml element properly", function (done) {
    var path = "1 2 1";
    var name = "pathname";
    var minX = minY = -10;
    var animateEls = [{
      animate: {
        _attr: {
          attributeName: "d",
          begin: "0s",
          dur: 20,
          values: "1 2 1;3 4 3;1 2 1;",
          repeatCount: "indefinite"
        }
      }
    }];
    var expected = [{
      _attr: {
        d: "1 2 1",
        id: "pathname",
        transform: "translate(10,10)",
        class: "pathname"
      }
    }, {
      animate: {
        animate: {
          _attr: {
            attributeName: "d",
            begin: "0s",
            dur: 20,
            values: "1 2 1;3 4 3;1 2 1;",
            repeatCount: "indefinite"
          }
        }
      }
    }];
    var actual = pathElement(path, name, minX, minY, animateEls);
    //console.log(util.inspect(actual, false, null));
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe("pathLength test", function () {
  it("should calculate the length of a path", function (done) {
    var stack = [{ c: "M", x: 0, y: 0 }, { c: "l", x: 3, y: 3 }];
    var expected = Math.sqrt(18);
    var actual = pathLength(stack);
    expect(actual).to.be.equal(expected);
    done();
  });
});

describe("renderPath test", function () {
  it("should render path correctly", function (done) {
    var pathName = "test1";
    var stack1 = [{ c: "M", x: 0, y: 0 }, { c: "l", x: 3, y: 3 }];
    var stacks = [stack1];
    var expected = {
      path: [{
        _attr: {
          d: "M 0 0 l 3 3",
          id: "test1",
          transform: "translate(0,0)",
          class: "test1"
        }
      }],
      box: { minX: 0, minY: 0, maxX: 3, maxY: 3 },
      length: 4.242640687119285
    };
    var actual = renderPath(stacks, pathName);
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe("styleElement test", function () {
  it("should produce style element correctly", function (done) {
    var props = {
      stroke: "#FFF",
      "stroke-linecap": "butt",
      "stroke-linejoin": "miter",
      "stroke-width": "1px",
      "stroke-opacity": "1.0",
      "stroke-dasharray": "20 20",
      "stroke-dashoffset": "10.0"
    };
    var pathName = "test1";
    var expected = ".test1 {\n    stroke: #FFF;\n    stroke-linecap: butt;\n    stroke-linejoin: miter;\n    stroke-width: 1px;\n    stroke-opacity: 1.0;\n    stroke-dasharray: 20 20;\n    stroke-dashoffset: 10.0;\n  }";
    var actual = styleElement(props, pathName);
    expect(actual).to.be.deep.equal(expected);
    done();
  });
});

describe("toSvg test", function () {
  it("should produce an SVG", function (done) {
    var pathName = "path1";
    var props = JSON.parse(fs.readFileSync("./src/testdata/props.json", "utf8"));
    var stacks = JSON.parse(fs.readFileSync("./src/testdata/stacks.json", "utf8"));
    var expected = fs.readFileSync("./src/testdata/expected.svg", "utf8");
    var actual = fauna.toSvg(stacks, pathName, props);
    expect(actual).to.be.equal(expected);
    done();
  });
});

describe("runConfig test", function () {
  it("should produce an SVG", function (done) {
    var config = JSON.parse(fs.readFileSync("./configs/hilbert.json", "utf8"));
    var expected = fs.readFileSync("./src/testdata/hilbert-expected.svg", "utf8");
    var actual = fauna.runConfig(config);
    expect(actual).to.be.equal(expected);
    done();
  });
});