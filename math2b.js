const sum = (a, b) => a + b;

const sub = (a, b) => a - b;

const mult = (a, b) => a * b;

const div = (a, b) => a / b;

console.log("SUM string:", sum("1", "2"));
console.log("SUM numeber:", sum(1, "2"));

console.log("SUB string:", sub("1", "2"));
console.log("SUB numeber:", sub(1, 2));

console.log("MULT string:", mult("1", "2"));
console.log("MULT numeber:", mult(1, 2));

console.log("DIV string:", div("1", "2"));
console.log("DIV numeber:", div(1, 2));

// Console:
// SUM string: 12
// SUM numeber: 3
// SUB string: -1
// SUB numeber: -1
// MULT string: 2
// MULT numeber: 2
// DIV string: 0.5
// DIV numeber: 0.5
