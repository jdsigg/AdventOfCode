const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(BigInt);

function prune(a) {
    return a % 16777216n;
}

function mix(a, b) {
    return a ^ b;
}

function part1(input) {
    let total = 0n;
    for(const n of input) {
        let curr = n;
        for(let i = 0; i < 2000; i++) {
            let r1 = curr * 64n
            curr = prune(mix(curr, r1));

            let r2 = curr / 32n;
            curr = prune(mix(curr, r2));

            let r3 = curr * 2048n;
            curr = prune(mix(curr, r3));
        }
        total += curr;
    }
    return total
}

console.log("Part 1:", part1(input));