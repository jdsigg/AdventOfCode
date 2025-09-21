const fs = require('node:fs');
const point = require('../../common/structures/point');
const Point = point.Point;

class Claim {
    constructor(id, xS, yS, dX, dY) {
        this.id = id;
        this.xS = xS;
        this.yS = yS;
        this.dX = dX;
        this.dY = dY;
    }
}

const input =
    fs.readFileSync('./input.txt', 'utf-8').trim().split('\n')
        .map(line => line.split(' '))
        .map(([idStr, _, pointStr, dimStr]) => {
            const id = parseInt(idStr.slice(1));
            const [xS, xY] = pointStr.slice(0, -1).split(',').map(Number);
            const [dX, dY] = dimStr.split('x').map(Number);
            return new Claim(id, xS, xY, dX, dY);
        });

function buildOccurrenceMap(input) {
    const seen = new Map();
    for (const claim of input) {
        const { id, xS, yS, dX, dY } = claim;
        for (let i = xS; i < xS + dX; i++) {
            for (let j = yS; j < yS + dY; j++) {
                const p = new Point(i, j);
                const occ = seen.get(p.encode()) || 0;
                seen.set(p.encode(), occ + 1);
            }
        }
    }

    return seen;
}

function part1(input) {
    return [...buildOccurrenceMap(input).values()].filter(x => x > 1).length;
}

function part2(input) {
    const occurrenceMap = buildOccurrenceMap(input);
    for (const claim of input) {
        for (const claim of input) {
            let isIsolated = true;
            const { id, xS, yS, dX, dY } = claim;
            for (let i = xS; i < xS + dX; i++) {
                for (let j = yS; j < yS + dY; j++) {
                    const p = new Point(i, j);
                    if (occurrenceMap.get(p.encode()) !== 1) {
                        isIsolated = false;
                    }
                }
            }
            if (isIsolated) {
                return id;
            }
        }
    }
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));
