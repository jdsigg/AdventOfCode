const fs = require('node:fs');
const point = require('../../common/structures/point');
const Point = point.Point;
const Grid = point.Grid;

function move(curr, direction) {
    switch (direction) {
        case '^':
            return Grid.translate(curr, "NORTH");
        case '>':
            return Grid.translate(curr, "EAST");
        case 'v':
            return Grid.translate(curr, "SOUTH");
        case '<':
            return Grid.translate(curr, "WEST");
    }
}

function part1(input) {
    const seen = new Set();
    let curr = new Point(0, 0);
    seen.add(curr.encode());
    for (const direction of input) {
        curr = move(curr, direction);
        seen.add(curr.encode());
    }
    return seen.size;
}

function part2(input) {
    const seen = new Set();
    let santa = new Point(0, 0);
    let robot = new Point(0, 0);
    seen.add(santa.encode());
    let santasTurn = true;
    for (const direction of input) {
        if (santasTurn) {
            santa = move(santa, direction);
            seen.add(santa.encode());
        } else {
            robot = move(robot, direction);
            seen.add(robot.encode());
        }
        santasTurn = !santasTurn;
    }
    return seen.size;
}

const input = fs.readFileSync('./input.txt', 'utf-8').split('');
console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));