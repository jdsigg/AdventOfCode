const fs = require("node:fs");
const input = fs.readFileSync("./input.txt", "utf-8").split("\n").map(Number);

// Array combs: https://feixie1980.medium.com/array-combination-iteration-with-javascript-generator-function-f4718aec1ca0

function* combinationN(array, n) {
  if (n === 1) {
    for (const a of array) {
      yield [a];
    }
    return;
  }

  for (let i = 0; i <= array.length - n; i++) {
    for (const c of combinationN(array.slice(i + 1), n - 1)) {
      yield [array[i], ...c];
    }
  }
}

function* combinationOrdered(array) {
  for (let i = 1; i <= array.length; i++) {
    yield* combinationN(array, i);
  }
}

function solve(input, goal) {
  let total = 0;
  let minSize = Number.MAX_SAFE_INTEGER;
  let minCombs = 0;
  for (const combination of combinationOrdered(input)) {
    const sum = combination.reduce((a, b) => a + b);
    if (sum == goal) {
      total++;
      if (minSize > combination.length) {
        minSize = combination.length;
        minCombs = 1;
      } else if (minSize === combination.length) {
        minCombs++;
      }
    }
  }

  return [total, minCombs];
}

console.log("Part [1, 2]:", solve(input, 150));
