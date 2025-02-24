// Credit: https://www.reddit.com/r/adventofcode/comments/1hjx0x4/2024_day_21_quick_tutorial_to_solve_part_2_in/

const fs = require('node:fs');
const codes = fs.readFileSync('./input.txt', 'utf-8').split("\n");
const point = require('../../common/structures/point');

const Grid = point.Grid;
const Point = point.Point;

const NUMBER_PAD = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', 'A'],
];

const DIRECTIONAL_PAD = [
    ['.', '^', 'A'],
    ['<', 'v', '>']
];

function getPathsForNumber(i, j, pad) {
    const paths = {};
    const queue = [{ path: [], point: new Point(i, j) }];
    const directionMap = ['^', '>', 'v', '<'];

    while (queue.length > 0) {
        const { path, point } = queue.pop();
        if (!Grid.isValidV2(point, pad)) {
            continue;
        }
        const padKey = pad[point.x][point.y];
        // Always terminate paths through the invalid key.
        if (padKey === '.') {
            continue;
        }
        const minPathLengthAtPoint = padKey in paths ?
            Math.min(...paths[padKey].map(x => x.length))
            :
            Number.MAX_SAFE_INTEGER;
        if (path.length > minPathLengthAtPoint) {
            continue;
        }

        if (!(padKey in paths) || minPathLengthAtPoint > path.length) {
            paths[padKey] = [];
        }
        paths[padKey].push(path.join(''));
        queue.push(...Grid.neighbors(point).map((p, i) => ({ path: [...path, directionMap[i]], point: p })));
    }

    // Prune edges that will never produce a shortest path (when compared to their peers), i.e. '>^>' and '>>^'.
    const result = {};
    for (const key of Object.keys(paths)) {
        const keyPaths = paths[key];
        const temp = [];
        let anyRepeating = false;
        for (const keyPath of keyPaths) {
            let curr = keyPath[0];
            let hasRepeats = false;
            for (let i = 1; i < keyPath.length; i++) {
                const next = keyPath[i];
                if (curr === next) {
                    hasRepeats = true;
                    anyRepeating = true;
                }
                curr = next;
            }
            temp.push({ path: keyPath, hasRepeats })
        }
        result[key] = anyRepeating ? temp.filter(t => t.hasRepeats).map(t => t.path) : temp.map(t => t.path);
    }
    return result;
}

function getShortestPathMap(pad) {
    const pathMap = {};
    for (let i = 0; i < pad.length; i++) {
        for (let j = 0; j < pad[i].length; j++) {
            const number = pad[i][j];
            if (number === '.') {
                continue;
            }
            const paths = getPathsForNumber(i, j, pad);
            pathMap[number] = paths;
        }
    }
    return pathMap;
}

function buildSequence(keys, index, prevKey, currPath, result, graph) {
    if (index === keys.length) {
        result.push(currPath);
        return;
    }
    const currKey = keys[index];
    for (const path of graph[prevKey][currKey]) {
        buildSequence(keys, index + 1, keys[index], currPath + path + 'A', result, graph)
    }
}

const numpadMap = getShortestPathMap(NUMBER_PAD);
const dirpadMap = getShortestPathMap(DIRECTIONAL_PAD);

function shortestSequence(keys, depth, cache) {
    if (depth === 0) {
        return keys.length;
    }
    const cacheKey = keys + '|' + depth;
    if (cacheKey in cache) {
        return cache[cacheKey];
    }
    let total = 0;
    // Trim the last 'A'.
    const subKeys = keys.split('A').map(x => x + 'A').slice(0, -1);
    for (const subKey of subKeys) {
        const sequences = [];
        buildSequence(subKey, 0, 'A', '', sequences, dirpadMap);
        let min = Number.MAX_SAFE_INTEGER;
        for (const sequence of sequences) {
            min = Math.min(min, shortestSequence(sequence, depth - 1, cache));
        }
        total += min;
    }
    cache[cacheKey] = total;
    return total;
}

function solve(inputList, maxDepth) {
    let total = 0;
    const cache = {};
    for (const input of inputList) {
        const sequences = [];
        buildSequence(input, 0, 'A', '', sequences, numpadMap);
        let min = Number.MAX_SAFE_INTEGER;
        for (const sequence of sequences) {
            min = Math.min(min, shortestSequence(sequence, maxDepth, cache));
        }
        total += min * parseInt(input.slice(0, -1));
    }
    return total;
}

console.log("Part 1:", solve(codes, 2));
console.log("Part 2:", solve(codes, 25));