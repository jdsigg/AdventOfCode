const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8');

function part1(input) {
    const regex = /mul\(\d+,\d+\)/g;
    const matches = [...input.matchAll(regex)].map(m => m[0]);
    // Matches look like "mul(num1,num2)"
    console.log("Part 1:", 
        matches
        // mul(num1,num2) => [num1, num2]
        .map(str => str.substring(4).slice(0, -1).split(","))
        // [num1, num2] => num1 * num2 (strings coalesced to numbers)
        .map(([x, y]) => x * y)
        // Array sum.
        .reduce((a, b) => a + b)
    );
}

function part2(input) {
    const regex = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;
    const matches = [...input.matchAll(regex)].map(m => m[0]);
    let enabled = true;
    let sum = 0;
    for (const match of matches) {
        if (match === "do()") {
            enabled = true;
        } else if (match === "don't()") {
            enabled = false;
        } else if (enabled) {
            const [x, y] = match.substring(4).slice(0, -1).split(",");
            sum += (x * y);
        }
    }

    console.log("Part 2:", sum);
}

part1(input);
part2(input);