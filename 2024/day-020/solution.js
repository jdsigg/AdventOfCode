const minheap = require('../../common/structures/minheap');
const point = require('../../common/structures/point');
const fs = require('node:fs');

const MinHeap = minheap.MinHeap;
const Point = point.Point;
const Grid = point.Grid;

const grid = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split(''));

function find(character, grid) {
    return grid
        .flatMap((row, i) => row.map((_, j) => new Point(i, j)))
        .filter(p => grid[p.x][p.y] === character);
}

function dijkstras(grid) {
    const start = find('S', grid)[0];
    const end = find('E', grid)[0];
    const distances = {};
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const p = new Point(i, j);
            if (grid[p.x][p.y] !== '#') {
                distances[p.encode()] = Number.MAX_SAFE_INTEGER;
            }
        }
    }

    distances[start.encode()] = 0;
    const minHeap = new MinHeap();
    minHeap.add({ id: start, weight: 0 });
    while (distances[end.encode()] === Number.MAX_SAFE_INTEGER) {
        const curr = minHeap.pop();
        for (const neighbor of Grid.neighbors(curr.id)) {
            if (!(neighbor.encode() in distances)) {
                continue;
            }

            const neighborDistance = distances[neighbor.encode()];
            const currentWeight = distances[curr.id.encode()] + 1;
            if (neighborDistance > currentWeight) {
                distances[neighbor.encode()] = currentWeight;
                minHeap.add({ id: neighbor, weight: currentWeight });
            }
        }
    }
    return distances;
}

function solve(distances, grid, cheatLength) {
    // From any given point, we can reach points that have a Manhattan distance
    // of cheatLength away from the point. For example, with cheatLength 3, the following
    // point (X) can reach the points around it (O):
    //   ....O....
    //   ...OOO...
    //   ..OOOOO..
    //   .OOOXOOO.
    //   ..OOOOO..
    //   ...OOO...
    //   ....O....
    // That makes 1 + 3 + 5 + 6 + 5 + 3 + 1 = 24 reachable points from X.
    let meaningfulCheats = new Set();
    const spaces = Object.keys(distances).map(Point.decode);
    for (const space of spaces) {
        // All points reachable within cheatLength manahattan distance of the space.
        const potentialCheats = Grid.getManhattanNeighbors(space, cheatLength);
        for (const cheat of potentialCheats) {
            // Cheats can't end outside the grid or on a wall.
            if (!Grid.isValid(cheat, grid) || grid[cheat.x][cheat.y] === '#') {
                continue;
            }
            const md = Math.abs(cheat.x - space.x) + Math.abs(cheat.y - space.y);
            // Shortest path from cheat end to cheat start, minus incurred cheat distance.
            const timeSave = distances[cheat.encode()] - distances[space.encode()] - md;
            if (timeSave >= 100) {
                meaningfulCheats.add(space.encode() + '|' + cheat.encode());
            }
        }
    }
    return meaningfulCheats.size;
}

const distances = dijkstras(grid);
console.log("Part 1:", solve(distances, grid, 2));
console.log("Part 2:", solve(distances, grid, 20));