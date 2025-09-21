const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');

function occurrenceByChar(str) {
    const map = new Map();
    for(const c of str) {
        const count = map.get(c) || 0;
        map.set(c, count + 1);
    }

    return map;
}

function part1(input) {
    let twoLetter = 0;
    let threeLetter = 0;
    for(const line of input) {
        const occurrenceMap = occurrenceByChar(line);
        const values = new Set(occurrenceMap.values());
        if (values.has(2)) {
            twoLetter++;
        }
        if (values.has(3)) {
            threeLetter++;
        }
    }
    return twoLetter * threeLetter;
}

function part2(input) {
    for(let i = 0; i < input.length; i++) {
        const str1 = input[i];
        for(let j = i + 1; j < input.length; j++) {
            const str2 = input[j];
            // Compare each string, counting number of differences.
            const differences = [];
            for(let k = 0; k < str1.length; k++) {
                if (str1[k] !== str2[k]) {
                    differences.push(k);
                }
            }

            if (differences.length === 1) {
                return str1.slice(0, differences[0]) + str1.slice(differences[0] + 1);
            }
        }
    }

}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
