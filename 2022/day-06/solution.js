const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').trim();

function solve(input, markerLength) {
    const map = {};
    for(let i = 0; i <= input.length - markerLength; i++) {
        if (!(input[i] in map)) {
            map[input[i]] = 0;
        }
        map[input[i]]++;

        if (i >= markerLength) {
            map[input[i - markerLength]]--;
            if (map[input[i - markerLength]] === 0) {
                delete map[input[i - markerLength]];
            }
        }

        if (Object.keys(map).length === markerLength) {
            return i + 1;
        }
    }

    return -1;
}

console.log("Part 1:", solve(input, /* markerLength= */ 4));
console.log("Part 2:", solve(input, /* markerLength= */ 14));