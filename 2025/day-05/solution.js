const Range = require('../../common/structures/range').Range;
const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8');

function parseInput(input) {
    let [ranges, ingredients] = input.split('\n\n');
    return [
        ranges.split('\n')
            .map(line => line.split('-'))
            .map(([l, r]) => new Range(l, r, /* isBigInt= */ true)),
        ingredients.split('\n')
            .map(line => BigInt(line))
    ]
}

function part1(ranges, ingredients) {
    // Fine to brute force - 192 ranges, 1,000 ingredients.
    return ingredients.filter(i => ranges.some(r => r.contains(i))).length;
}

function part2(ranges) {
    // Organize the ranges in ascending order by their starting value.
    ranges.sort((a, b) => {
        if (a.start < b.start) {
            return -1;
        } if (a.start > b.start) {
            return 1;
        }
        return 0;
    });
    // Continuously try to merge ranges, storing them off when we fail.
    const savedRanges = [];
    let lastRange = ranges[0];
    for (let i = 1; i < ranges.length; i++) {
        const nextRange = ranges[i];
        const mergeResult = Range.merge(lastRange, nextRange);
        if (mergeResult.length === 2) {
            // Merge failed.
            savedRanges.push(lastRange);
            lastRange = nextRange;
            continue;
        }
        // Merge succeeded - keep trying to merge into lastRange.
        lastRange = mergeResult[0];
    }
    savedRanges.push(lastRange);
    // Range from 10-->20 holds 11 values, hence ++.
    return savedRanges.map(r => ++r.end - r.start).reduce((a, b) => a + b);
}

const [ranges, ingredients] = parseInput(input);
console.log("Part 1:", part1(ranges, ingredients));
console.log("Part 2:", part2(ranges));
