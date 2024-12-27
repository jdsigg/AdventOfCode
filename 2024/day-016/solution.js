const minheap = require('../../common/structures/minheap');
const fs = require('node:fs');
const input = fs.readFileSync('./input2.txt', 'utf-8').split("\n").map(line => line.split(''));

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

function keyToPoint(k) {
    return k.split(',').map(Number)
}

function dijkstras(input, start, end) {
    /**
     * The input is a graph. Every non-wall is connected by a length of 1.
     * 
     * To find the shortest path from start to finish, we can use Dijkstra's algorithm.
     * 
     * The only catch: There is a travel direction (starts going east).
     * 
     * When we move between nodes, each 90 degree turn incurs a weight of 1,000 between
     * two nodes.
     * 
     * Dijkstra's algorithm:
     * - Consider the distance to every node be infinite.
     * - The distance to the start node is 0.
     * - The current node is the starting node.
     * - Until we "visit" the end node:
     *   - For each of the current node's neighbors
     *     - Look at the neighbor's weight (direction matters here)
     *       - if (distance[curr] + weight[neighbor] < distance[neighbor])
     *         - distance[neighbor] = distance[curr] + weight[neighbor]
     *   - Mark curr as "visited"
     *   - Make curr an unvisited vertex with the lowest distance.
     */

    const distances = {};
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            // We'll always skip walls. 
            if (input[i][j] !== '#') {
                distances[[i, j]] = { distance: Number.MAX_SAFE_INTEGER, direction: undefined };
            }
        }
    }
    distances[start] = { distance: 0, direction: "EAST" };

    const minHeap = new minheap.MinHeap();
    let curr = start.map(x => '' + x).join(',')
    const endP = end.map(x => '' + x).join(',')
    const visited = new Set();
    while (!visited.has(endP)) {
        const [cX, cY] = keyToPoint(curr);
        const currDirection = distances[curr].direction;
        const inline = { p: translate(cX, cY, currDirection), d: currDirection, w: 1 };
        const right = { p: translate(cX, cY, turn(currDirection, 1)), d: turn(currDirection, 1), w: 1001 };
        const left = { p: translate(cX, cY, turn(currDirection, 3)), d: turn(currDirection, 3), w: 1001 };
        for (const neighbor of [inline, right, left]) {
            const [nX, nY] = neighbor.p;
            if (input[nX][nY] === '#') {
                continue;
            }
            const neighborDistance = distances[neighbor.p];
            const d = distances[curr].distance + neighbor.w;

            if (neighborDistance.distance > d) {
                neighborDistance.distance = d;
                neighborDistance.direction = neighbor.d;
                minHeap.add({ id: '' + neighbor.p, weight: neighborDistance.distance });
            }
        }

        // Mark this as visited and move on.
        visited.add(curr);
        curr = minHeap.pop().id;
    }
    return distances;
}

// For the input, start and end are always fixed.
const start = [input.length - 2, 1];
const end = [1, input[1].length - 2];
const distanceMap = dijkstras(input, start, end);
const minDistance = distanceMap[end].distance;
console.log("Part 1:", minDistance);

