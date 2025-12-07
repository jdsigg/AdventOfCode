const { Grid, Point } = require('../../common/structures/point');
const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map(line => line.split(''));

function part1(input) {
    const sY = input[0].indexOf('S');
    // Start directly below S.
    const queue = [new Point(1, sY)];
    const seen = new Set();
    let numSplit = 0;
    while (queue.length > 0) {
        const p = queue.shift();
        // Don't touch pathways reached by splitting other tachyons.
        if (seen.has(p.encode())) {
            continue;
        }
        seen.add(p.encode());
        const next = Grid.translate(p, Grid.SOUTH);
        if (!Grid.isValidV2(next, input)) {
            // We're off the bottom of the grid.
            continue;
        }
        if (input[next.x][next.y] !== '^') {
            queue.push(next);
            continue;
        }
        // Split the tachyon in two.
        numSplit++;
        const nextLeft = Grid.translate(next, Grid.WEST);
        const nextRight = Grid.translate(next, Grid.EAST);
        const validNeighbors = [nextLeft, nextRight].filter(p => Grid.isValidV2(p, input));
        queue.push(...validNeighbors);
    }

    return numSplit;
}

/**
 * Returns the position of the next splitter directly below a beam of light.
 * 
 * Returns undefined when no splitter is found.
 */
function findSplitterBelowBeam(input, point) {
    let p = point;
    let foundSplitter = false;
    while (Grid.isValidV2(p, input)) {
        if (input[p.x][p.y] === '^') {
            foundSplitter = true;
            break;
        }
        p = Grid.translate(p, Grid.SOUTH);
    }

    return foundSplitter ? p : undefined;
}

function sumPathsFromSplitter(input, splitterPosition, dp) {
    // If we've already been to this splitter, just return the paths reachable from it.
    if (splitterPosition.encode() in dp) {
        return dp[splitterPosition.encode()];
    }
    // Otherwise, branch the splitter in two and sum their paths.
    // Path === 1n means we hit the bottom of the input.
    const left = Grid.translate(splitterPosition, Grid.WEST);
    const right = Grid.translate(splitterPosition, Grid.EAST);

    const nextSplitterToTheLeft = findSplitterBelowBeam(input, left);
    const leftSum = nextSplitterToTheLeft ? sumPathsFromSplitter(input, nextSplitterToTheLeft, dp) : 1n;
    const nextSplitterToTheRight = findSplitterBelowBeam(input, right);
    const rightSum = nextSplitterToTheRight ? sumPathsFromSplitter(input, nextSplitterToTheRight, dp) : 1n;

    dp[splitterPosition.encode()] = leftSum + rightSum;
    return dp[splitterPosition.encode()];
}

function part2(input) {
    return sumPathsFromSplitter(
        input,
        findSplitterBelowBeam(input, new Point(0, input[0].indexOf('S'))),
        {}).toString();
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));