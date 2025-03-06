const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function part1(input) {
    let total = 0;
    for (const string of input) {
        const vowels = new Set('aeiou'.split(''));
        let vowelCount = 0;
        const invalidStrings = new Set(['ab', 'cd', 'pq', 'xy']);
        let hasDoubleLetter = false;
        for (let i = 0; i < string.length - 1; i++) {
            if (string[i] === string[i + 1]) {
                hasDoubleLetter = true;
            }
            if (vowels.has(string[i])) {
                vowelCount++;
            }
            invalidStrings.delete(string[i] + string[i + 1]);
        }
        if (vowels.has(string[string.length - 1])) {
            vowelCount++;
        }
        if (hasDoubleLetter && vowelCount >= 3 && invalidStrings.size === 4) {
            total++;
        }
    }

    return total;
}

function part2(input) {
    let total = 0;
    for (const string of input) {
        const doubles = {};
        for (let i = 0; i < string.length - 1; i++) {
            const substr = string.substring(i, i + 2);
            if (!(substr in doubles)) {
                doubles[substr] = [];
            }
            doubles[substr].push(i);
        }
        let hasSplitRepeat = false;
        for (let i = 0; i < string.length - 2; i++) {
            if (string[i] === string[i + 2]) {
                hasSplitRepeat = true;
            }
        }

        const doubleKeys = Object.keys(doubles).filter(key => doubles[key].length > 1);
        let hasAtLeastOneGoodPair = false;
        for (const key of doubleKeys) {
            const occurrences = doubles[key];
            for (let i = 0; i < occurrences.length; i++) {
                for (let j = i + 1; j < occurrences.length; j++) {
                    if (occurrences[i] !== occurrences[j] - 1) {
                        hasAtLeastOneGoodPair = true;
                    }
                }
            }
        }


        if (hasSplitRepeat && doubleKeys.length > 0 && hasAtLeastOneGoodPair) {
            total++;
        }
    }
    return total;
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));