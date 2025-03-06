const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

function part1(dimensions) {
    return dimensions
        .reduce((a, [x, y, z]) => a + 2*x*y + 2*x*z + 2*y*z + x * y, 0);
}

function part2(dimensions) {
    return dimensions
        .reduce((a, [x, y, z]) => a + x*y*z + 2*x + 2*y, 0);
}

const dimensions = input
    // ascending toSorted helps with part 1.
    .map(l => l.split('x').map(Number).toSorted((a, b) => a - b));

console.log("Part 1:", part1(dimensions));
console.log("Part 2:", part2(dimensions));