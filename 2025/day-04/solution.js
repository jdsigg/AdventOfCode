const point = require('../../common/structures/point');
const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map(line => line.split(''));

const Point = point.Point;
const Grid = point.Grid;

function part1(grid) {
    let reachable = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // We're only looking for rolls of paper.
            if (grid[i][j] !== '@') {
                continue;
            }
            const p = new Point(i, j);
            // Grid class fetches all cardinal and intercardinal directions, but we
            // only need those in the bounds of our grid.
            const neighbors = Grid.allNeighbors(p).filter(n => Grid.isValidV2(n, grid));
            if (neighbors.filter(n => grid[n.x][n.y] === '@').length < 4) {
                reachable++;
            }
        }
    }

    return reachable;
}

function part2(grid) {
    //  Approach...
    //  1. Map each roll of paper to the number of neighbors it has
    //  2. While there are reachable pieces of rolls...
    //    - Remove the reachable ones
    //    - On removal, decrement the counts for each of its neighbors

    //  The expensive part is finding removable paper rolls.
    //  -  My input has 12,503 rolls
    //  -  My input is 138 x 138 = 19,044 possible spaces

    //  It is impossible to orient rolls such that 12,503 exist and they each all only touch one other roll.
    //  Additionally, p1 tells me 1,356 can be removed at the start.
    //  I could use something like a minheap to track what's removable and what isn't.
    //  However, I am fairly confident the input isn't optimized to discourage a brute force.
    let indexToNeighborCounts = {};
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // We're only looking for rolls of paper.
            if (grid[i][j] !== '@') {
                continue;
            }
            const p = new Point(i, j);
            // Grid class fetches all cardinal and intercardinal directions, but we
            // only need those in the bounds of our grid.
            const neighbors = Grid.allNeighbors(p).filter(n => Grid.isValidV2(n, grid));
            indexToNeighborCounts[p.encode()] = neighbors.filter(n => grid[n.x][n.y] === '@').length;
        }
    }

    const totalPaperRolls = Object.keys(indexToNeighborCounts).length;
    while (true) {
        const removals = Object.keys(indexToNeighborCounts).filter(k => indexToNeighborCounts[k] < 4);
        if (removals.length === 0) {
            break;
        }

        for (const key of removals) {
            const p = Point.decode(key);
            const neighbors = Grid.allNeighbors(p);
            for (const neighbor of neighbors) {
                const neighborKey = neighbor.encode();
                if (neighborKey in indexToNeighborCounts) {
                    indexToNeighborCounts[neighborKey]--;
                }
            }
            delete indexToNeighborCounts[key];
        }
    }

    // How many we started with minus how many are left.
    return totalPaperRolls - Object.keys(indexToNeighborCounts).length;
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));