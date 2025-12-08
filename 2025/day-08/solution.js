const { Grid, Point } = require('../../common/structures/point');
const fs = require('node:fs');
const { UnionFind } = require('../../common/structures/unionFind');
const input = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map(line => line.split(',').map(Number))
    .map(([x, y, z]) => new Point(x, y, z));

/**
 * Returns pairs of junctions.
 * 
 * Pairs are returned in descending order by the distance between two junctions.
 */
function getJunctionPairs(input) {
    const pairs = [];
    for (let i = 0; i < input.length; i++) {
        for (let j = i + 1; j < input.length; j++) {
            const p1 = input[i];
            const p2 = input[j];
            const distance = Grid.straightLineDistance(p1, p2);
            pairs.push({ id1: i, id2: j, p1, p2, distance });
        }
    }
    return pairs.sort((a, b) => a.distance - b.distance);
}

/**
 * Merges the first 1,000 edges of our input.
 * 
 * Returns the product of the sizes of the three largest subgraphs.
 */
function part1(pairs, numNodes) {
    const unionFind = new UnionFind(numNodes);
    for (let i = 0; i < 1000; i++) {
        const { id1, id2 } = pairs[i];
        unionFind.merge(id1, id2);
    }
    const sizes = unionFind.size.sort((a, b) => b - a);
    return sizes[0] * sizes[1] * sizes[2];
}

/**
 * Continuously merges edges defined by our input pairs.
 * 
 * Stops when a single graph remains.
 * 
 * Returns the product of the x-coordinates of the edge that merged
 * the final two subgraphs together.
 */
function part2(pairs, numNodes) {
    const unionFind = new UnionFind(numNodes);
    for (const { id1, id2, p1, p2 } of pairs) {
        unionFind.merge(id1, id2);
        if (unionFind.count === 1) {
            return p1.x * p2.x;
        }
    }
    return -1;
}

const pairs = getJunctionPairs(input);
console.log("Part 1:", part1(pairs, input.length));
console.log("Part 2:", part2(pairs, input.length));