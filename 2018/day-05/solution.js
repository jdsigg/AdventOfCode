const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').trim();

function reducedPolymerLength(polymer, ignoredUnits) {
    const reduction = [];
    for (const c of polymer) {
        if (ignoredUnits.has(c)) {
            continue;
        }

        if (reduction.length === 0) {
            reduction.push(c);
            continue;
        }

        const end = reduction.slice(-1)[0];
        if (end.toLowerCase() === c.toLowerCase() && end !== c) {
            reduction.pop();
        } else {
            reduction.push(c);
        }
    }


    return reduction.length;
}

function part1(input) {
    return reducedPolymerLength(input, new Set());
}

function part2(input) {
    const uniqueLowercaseUnits = new Set(
        input.split('').map(x => x.toLowerCase())
    );

    return Math.min(
        ...[...uniqueLowercaseUnits]
            .map(x => reducedPolymerLength(input, new Set([x, x.toUpperCase()])))
    );
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
