const fs = require('node:fs');
const invetories = fs.readFileSync('./input.txt', 'utf-8').split("\n\n");

function getCalories(invetories) {
    return invetories.map(inventory => inventory.split('\n').map(Number).reduce((a, b) => a + b));
}

function part1(invetories) {
    return Math.max(...invetories);
}

function part2(invetories) {
    const copy = JSON.parse(JSON.stringify(invetories));
    copy.sort((a, b) => a - b);
    return copy.pop() + copy.pop() + copy.pop();
}
const invetoriesAsCalories = getCalories(invetories);
console.log("Part 1:", part1(invetoriesAsCalories));
console.log("Part 2:", part2(invetoriesAsCalories));