"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.div = exports.mult = exports.sub = exports.sum = void 0;
var sum = function (a, b) {
  return a + b;
};
exports.sum = sum;
var sub = function (a, b) {
  return a - b;
};
exports.sub = sub;
var mult = function (a, b) {
  return a * b;
};
exports.mult = mult;
var div = function (a, b) {
  return a / b;
};
exports.div = div;
console.log("SUM numeber:", sum(1, 2));
console.log("SUB numeber:", sub(1, 2));
console.log("MULT numeber:", mult(1, 2));
console.log("DIV numeber:", div(1, 2));
