const fs = require('node:fs');
const point = require('../../common/structures/point');
const grid = fs.readFileSync('./input.txt', 'utf-8').split('\n').map(l => l.split(""));

const Grid = point.Grid;
const Point = point.Point;

function copy(grid) {
    return JSON.parse(JSON.stringify(grid));
}

function getNextStep(curr) {
    const next = copy(curr);
    for (let j = 0; j < curr.length; j++) {
        for (let k = 0; k < curr[j].length; k++) {
            const p = new Point(j, k);
            const neighbors = Grid.allNeighbors(p).filter(p => Grid.isValidV2(p, curr));
            const onNeighbors = neighbors.filter(n => curr[n.x][n.y] === '#').length;
            if (curr[j][k] === '#') {
                if (onNeighbors === 2 || onNeighbors === 3) {
                    next[j][k] = '#';
                } else {
                    next[j][k] = '.';
                }
            } else {
                if (onNeighbors === 3) {
                    next[j][k] = '#';
                } else {
                    next[j][k] = '.';
                }
            }
        }
    }

    return next;
}

function part1(grid) {
    let curr = grid;
    for (let i = 0; i < 100; i++) {
        curr = getNextStep(curr);
    }

    return curr.flat().filter(x => x === '#').length;
}

function resetCornerLights(grid) {
    grid[0][0] = '#';
    grid[0][grid[0].length - 1] = '#';
    grid[grid.length - 1][0] = '#';
    grid[grid.length - 1][grid[grid.length - 1].length - 1] = '#';
}

function part2(grid) {
    let curr = grid;
    for (let i = 0; i < 100; i++) {
        resetCornerLights(curr);
        curr = getNextStep(curr);
    }
    resetCornerLights(curr);

    return curr.flat().filter(x => x === '#').length;
}

console.log("Part 1:", part1(grid));
console.log("Part 2:", part2(grid));
