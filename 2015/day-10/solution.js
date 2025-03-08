const fs = require('node:fs');
const input = "3113322113";

function getNextIteration(step) {
    let nextIteration = '';
    let curr = step[0];
    let count = 1;
    for (let i = 1; i < step.length; i++) {
        const currValue = step[i];
        if (currValue === curr) {
            count++;
        } else {
            nextIteration += (count + curr);
            curr = currValue;
            count = 1;
        }
    }
    nextIteration += (count + curr);
    return nextIteration;
}

// There's probably a better way... still runs in under 1s.
const cache = {};
function solve(input, count) {
    let curr = input;
    for (let i = 0; i < count; i++) {
        curr = i in cache ? cache[i] : getNextIteration(curr);
        cache[i] = curr;
    }
    return curr.length;
}

console.log("Part 1:", solve(input, 40));
console.log("Part 2:", solve(input, 50));