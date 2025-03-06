const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('');

function part1(input) {
    return input.reduce((a, b) => a += b === '(' ? 1 : -1, 0);
}

function part2(input) {
    let floor = 0;
    for(let i = 0; i < input.length; i++) {
        const paren = input[i];
        if (paren === '(') {
            floor++;
        } else if (paren === ')') {
            floor--;
        }
        
        if (floor === -1) {
            return i + 1;
        }
    }
    return -1;
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));