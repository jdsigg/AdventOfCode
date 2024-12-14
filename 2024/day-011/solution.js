const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split(" ");

function trimZeros(arr) {
    while (arr.length > 1 && arr[0] === '0') {
        arr.shift();
    }
}

function getNext(n) {
    if (n === "0") {
        return ["1"];
    } else if (n.length % 2 === 0) {
        let left = n.slice(0, n.length / 2).split('');
        let right = n.slice(n.length / 2).split('');

        trimZeros(left);
        trimZeros(right);

        return [left.join(''), right.join('')];

    }
    return [(BigInt(2024) * BigInt(n)).toString()];
}

/**
 * Generic solution for both parts.
 * 
 * While the problem dictates that stones order is preserved, all that matters
 * is that all stones get transformed at each step.
 * 
 * The approach:
 * - Start by mapping each stone to 1 (count)
 * - For each iteration
 *   - For each stone
 *     - Transform the stone into its new stone(s)
 *     - Add each new stone to the next iteration, but add the current stone's count of them
 * 
 * This results in a map of stone => occurrences at the end of N iterations. We want
 * the sum of the occurrences.
 */
function solve(input, iterations) {
    let curr = {};
    for(const i of input) {
        curr[i] = 1;
    }
    for(let i = 0; i < iterations; i++) {
        const next = {};
        for(const [k, v] of Object.entries(curr)) {
            const nextVals = getNext(k);
            for (const val of nextVals) {
                if (!next[val]) {
                    next[val] = Number(v);
                } else {
                    next[val] += Number(v);
                }
            }
        }
        curr = next;
    }
    return Object.keys(curr).map(key => curr[key]).reduce((a, b) => a + b);
}

console.log("Part 1:", solve(input, 25));
console.log("Part 2:", solve(input, 75));