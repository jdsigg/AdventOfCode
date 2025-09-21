const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8');

function part1(input) {
    return input.trim().split('\n').map(Number).reduce((acc, curr) => acc + curr, 0);
}

function part2(input) {
    const seen = new Set([0]);
    const frequencies = input.trim().split('\n').map(Number);
    let sum = 0;
    let i = 0;
    while (true) {
        sum += frequencies[i];
        if (seen.has(sum)) {
            return sum;
        }
        seen.add(sum);
        i = (i + 1) % frequencies.length;
    }
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
