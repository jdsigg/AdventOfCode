const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8');

function part1(input) {
    // Cheat and find only positive / negative numbers in the input.
    // This could technically find numbers that are strings, i.e. "2" or "-12",
    // but the input doesn't seem to have any.
    const numberRegex = /(-)*\d+/g;
    return input.match(numberRegex).map(Number).reduce((a, b) => a + b);
}

function part2(input) {
    // There are only arrays, objects, strings, and numbers.
    function sumWithoutRed(item) {
        let totalAtThisLevel = 0;
        if (Array.isArray(item)) {
            for (const e of item) {
                totalAtThisLevel += sumWithoutRed(e);
            }
        } else if (typeof item === "object") {
            // If any values in this object are "red", ignore entirely.
            // Assumes that no keys are "red", as this is the case with my input.
            if (Object.values(item).some(i => i === "red")) {
                return 0;
            }
            for (const entry of Object.entries(item)) {
                totalAtThisLevel += sumWithoutRed(entry);
            }
        } else {
            // What's left is either a string or a number.
            const maybeNumber = parseInt(item);
            totalAtThisLevel += (Number.isNaN(maybeNumber)) ? 0 : maybeNumber;
        }

        return totalAtThisLevel;
    }
    return sumWithoutRed(JSON.parse(input));
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
