import * as math from "./math";
import _ from "lodash";
console.log(math.sum(1, 2));
console.log(math.sub(123, 321));
console.log(math.div(10, 20));
console.log(math.mult(10, 2));

const test = _.chunk(["a", "b", "c", "d"], 3);

console.log(test);
