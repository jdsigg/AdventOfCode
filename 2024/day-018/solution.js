const minheap = require('../../common/structures/minheap');
const point = require('../../common/structures/point');
const fs = require('node:fs');

const MinHeap = minheap.MinHeap;
const Point = point.Point;
const Grid = point.Grid;

function solve(badBytes) {
    const start = new Point(0, 0);
    const end = new Point(70, 70);
    const distances = {};
    for (let i = 0; i <= 70; i++) {
        for (let j = 0; j <= 70; j++) {
            const p = new Point(i, j);
            if (!badBytes.has(p.encode())) {
                distances[p.encode()] = Number.MAX_SAFE_INTEGER;
            }
        }
    }

    distances[start.encode()] = 0;

    const minHeap = new MinHeap();
    minHeap.add({ id: start, weight: 0 });
    while (distances[end.encode()] === Number.MAX_SAFE_INTEGER && minHeap.size() !== 0) {
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

    return distances[end.encode()] === Number.MAX_SAFE_INTEGER ? null : distances[end.encode()];
}

function part2(bytes) {
    // From part 1, we know that the first 1024 bytes will allow for success.
    // Dijkstra's is fast enough - we can abuse it brute force and still have this finish in <5s.
    for (let i = 1025; i < bytes.length; i++) {
        const res = solve(new Set(bytes.slice(0, i).map(([x, y]) => new Point(x, y).encode())));
        if (res === null) {
            // We failed on array slice [0, i), which means i-1 caused the failure.
            const [x, y] = bytes[i - 1];
            console.log(`Part 2: ${x},${y}`);
            return;
        }
    }
}

const bytes = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split(','));
console.log("Part 1:", solve(new Set(bytes.slice(0, 1024).map(([x, y]) => new Point(x, y).encode()))));
part2(bytes);