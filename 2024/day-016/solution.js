const minheap = require('../../common/structures/minheap');
const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split(''));

const DIRECTIONS = Object.freeze({
    NORTH: [-1, 0],
    EAST: [0, 1],
    SOUTH: [1, 0],
    WEST: [0, -1],
});

function translate(x, y, direction) {
    const [moveX, moveY] = DIRECTIONS[direction];
    return [x + moveX, y + moveY];
}

function turn(direction, num90DegreeTurns) {
    const keys = Object.keys(DIRECTIONS);
    const keyInd = keys.indexOf(direction);
    return keys[(keyInd + num90DegreeTurns) % keys.length];
}

function pointStr([x, y]) {
    return `${x}|${y}`;
}

function keyToPoint(k) {
    return k.split(',').map(Number)
}

function dijkstras(input, start, end) {
    /**
     * The input is a graph. Every non-wall is connected by a length of 1.
     * 
     * To find the shortest path from start to finish, we can use Dijkstra's algorithm.
     * 
     * The only catch: There is a travel direction (starts going east). When we move between nodes,
     * each 90 degree turn incurs a weight of 1,000 between two nodes.
     */

    const distances = {};
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            // We'll always skip walls. 
            if (input[i][j] !== '#') {
                // For part 2, we are interested in all possible shortest paths from start --> end.
                // While doing Dijkstra's, keep track of shortest path to each <node, direction> pair.
                // For part 1, the answer will be the only non-MAX_SAFE_INTEGER at distances[end].
                distances[[i, j]] = {
                    NORTH: { distance: Number.MAX_SAFE_INTEGER, from: [] },
                    EAST: { distance: Number.MAX_SAFE_INTEGER, from: [] },
                    SOUTH: { distance: Number.MAX_SAFE_INTEGER, from: [] },
                    WEST: { distance: Number.MAX_SAFE_INTEGER, from: [] },
                };
            }
        }
    }
    distances[start]["EAST"] = { distance: 0, direction: "EAST" };

    const minHeap = new minheap.MinHeap();
    minHeap.add({ id: { p: start.map(x => '' + x).join(','), direction: 'EAST' }, weight: 0 });
    // Stop Dijkstra's the first time we reach the last point in any direction.
    while (Object.keys(DIRECTIONS).map(d => distances[end][d].distance).every(p => p === Number.MAX_SAFE_INTEGER)) {
        const curr = minHeap.pop().id;
        const [cX, cY] = keyToPoint(curr.p);
        const currDirection = curr.direction;
        // Turning 180 degrees will never produce a shortest path.
        const inline = { p: translate(cX, cY, currDirection), d: currDirection, w: 1 };
        const right = { p: translate(cX, cY, turn(currDirection, 1)), d: turn(currDirection, 1), w: 1001 };
        const left = { p: translate(cX, cY, turn(currDirection, 3)), d: turn(currDirection, 3), w: 1001 };
        for (const neighbor of [inline, right, left]) {
            const [nX, nY] = neighbor.p;
            if (input[nX][nY] === '#') {
                continue;
            }
            const neighborDistance = distances[neighbor.p][neighbor.d];
            const d = distances[curr.p][curr.direction].distance + neighbor.w;

            if (neighborDistance.distance > d) {
                neighborDistance.distance = d;
                neighborDistance.from = [curr.p];
                // Instead of editing existing entries in the heap, just add them back in. This prevents us
                // from having to find an element before re-heapfying, at the cost of growing the heap a bit
                // more. 
                minHeap.add({
                    id: {
                        p: '' + neighbor.p,
                        direction: neighbor.d
                    },
                    weight: neighborDistance.distance
                });
            } else if (neighborDistance.distance === d) {
                // Strictly for part 2 - don't continue from this node but remember we reached it from multiple.
                neighborDistance.from.push(curr.p);
            }
        }
    }
    return distances;
}
// For the input, start and end are always fixed.
const start = [input.length - 2, 1];
const end = [1, input[1].length - 2];
const distanceMap = dijkstras(input, start, end);
console.log("Part 1:", Math.min(...Object.keys(DIRECTIONS).map(x => distanceMap[end][x].distance)));

function part2(distanceMap, start, end) {
    const allSeenPoints = new Set();
    function dfs(point, direction, seen) {
        const pStr = pointStr(point);
        if (pStr === pointStr(end)) {
            for (const p of seen) {
                allSeenPoints.add(p);
            }
            return;
        }

        if (seen.has(pStr)) {
            return;
        }
        seen.add(pStr);

        // Get the points that we came from.
        const from = distanceMap[point][direction].from;
        // The number of points we came from dictates the number of forks we have to take.
        // Joined shortest paths will always be represented by arrays of duplicate numbers.
        // Temporarily visit the point.
        const temp = from[0];
        const entries = distanceMap[temp];
        // Find the N shortest paths at temp and DFS those. The rest can be ignored.
        const shortestDirections = Object.keys(DIRECTIONS)
            .map(x => ({ direction: x, distance: entries[x].distance }))
            .sort((a, b) => a.distance - b.distance).slice(0, from.length);

        for (const o of shortestDirections) {
            dfs(temp.split(',').map(Number), o.direction, seen);
        }
        seen.delete(pStr);
    }
    // The direction we start at must be the smallest of all directions at "start" (where Dijkstra's ended).
    const minDirection =
        Object.keys(DIRECTIONS)
            .map(x => ({ direction: x, distance: distanceMap[start][x].distance }))
            .sort((a, b) => a.distance - b.distance)[0].direction;
    dfs(start, minDirection, new Set());
    // Always visit the destination.
    allSeenPoints.add(pointStr(end));
    return allSeenPoints.size;
}

console.log("Part 2:", part2(distanceMap, end, start));
