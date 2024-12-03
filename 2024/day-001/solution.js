const fs = require('node:fs');
const lines = fs.readFileSync('./input.txt', 'utf-8').split("\n");

const left = [];
const right = [];
for (const line of lines) {
    const [l, r] = line.split("   ");
    left.push(l);
    right.push(r);
}

left.sort((a, b) => a - b);
right.sort((a, b) => a - b);

function part1(left, right) {
    let sum = 0;
    for(let i = 0; i < left.length; i++) {
        sum += Math.abs(left[i] - right[i]);
    }
    console.log("Part 1:", sum);
}

function part2(left, right) {
    const map = {};
    for(const num of right) {
        const occ = map[num] || 0;
        map[num] = occ + 1;
    }

    let sum = 0;
    for(const num of left) {
        sum += (map[num] || 0) * num;
    }

    console.log("Part 2:", sum);
}


part1(left, right);
part2(left, right);