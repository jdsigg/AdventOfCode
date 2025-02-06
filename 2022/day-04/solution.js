const fs = require('node:fs');
const range = require('../../common/structures/range');

const Range = range.Range;

function parseRange(range) {
    const [start, end] = range.split("-");
    return new Range(parseInt(start), parseInt(end));
}

function parse(assignments) {
    return assignments.map(assignment => assignment.split(",").map(parseRange));
}

function part1(assignments) {
    return assignments.filter(([a, b]) => a.consumes(b) || b.consumes(a)).length;
}

function part2(assignments) {
    return assignments.filter(([a, b]) => a.overlaps(b)).length;
}

const pairs = parse(fs.readFileSync('./input.txt', 'utf-8').split("\n"));
console.log("Part 1:", part1(pairs));
console.log("Part 2:", part2(pairs));