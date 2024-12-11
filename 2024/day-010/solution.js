const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split('').map(Number));

function pointStr(x, y) {
    return `${x}|${y}`;
}

function isPointValid(x, y, grid) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
}

function countPeaksReachableFromTrailhead(i, j, input) {
    const seenPeaks = new Set();
    
    function dfs(x, y, seen) {
        const curr = input[x][y];
        if (curr === 9) {
            seenPeaks.add(pointStr(x, y));
            return;
        }

        // We've returned to a place we shouldn't.
        if (seen.has(pointStr(x, y))) {
            return;
        }

        seen.add(pointStr(x, y));
        // Not at a peak - recurse in all cardinal directions.
        if (isPointValid(x, y + 1, input) && input[x][y + 1] === curr + 1) {
            dfs(x, y + 1, seen);
        }

        if (isPointValid(x + 1, y, input) && input[x + 1][y] === curr + 1) {
            dfs(x + 1, y, seen);
        }

        if (isPointValid(x, y - 1, input) && input[x][y - 1] === curr + 1) {
            dfs(x, y - 1, seen);
        }

        if (isPointValid(x - 1, y, input) && input[x - 1][y] === curr + 1) {
            dfs(x - 1, y, seen);
        }
        seen.delete(pointStr(x, y));
    }
    dfs(i, j, new Set());
    return seenPeaks.size;
}

// This is exactly the same as part 1, except count each time we see a peak from a trail instead
// of counting the distinct peaks reachable from a trail.
function countPeaksReachableFromTrailheadV2(i, j, input) {
    let peaksSeen = 0;
    
    function dfs(x, y, seen) {
        const curr = input[x][y];
        if (curr === 9) {
            peaksSeen++;
            return;
        }

        // We've returned to a place we shouldn't.
        if (seen.has(pointStr(x, y))) {
            return;
        }

        seen.add(pointStr(x, y));
        // Not at a peak - recurse in all cardinal directions.
        if (isPointValid(x, y + 1, input) && input[x][y + 1] === curr + 1) {
            dfs(x, y + 1, seen);
        }

        if (isPointValid(x + 1, y, input) && input[x + 1][y] === curr + 1) {
            dfs(x + 1, y, seen);
        }

        if (isPointValid(x, y - 1, input) && input[x][y - 1] === curr + 1) {
            dfs(x, y - 1, seen);
        }

        if (isPointValid(x - 1, y, input) && input[x - 1][y] === curr + 1) {
            dfs(x - 1, y, seen);
        }
        seen.delete(pointStr(x, y));
    }
    dfs(i, j, new Set());
    return peaksSeen;
}

function part1(input) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if(input[i][j] === 0) {
                // Trailhead.
                sum += countPeaksReachableFromTrailhead(i, j, input);
            }
        }
    }

    console.log("Part 1:", sum);
}

function part2(input) {
    let sum = 0;
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if(input[i][j] === 0) {
                // Trailhead.
                sum += countPeaksReachableFromTrailheadV2(i, j, input);
            }
        }
    }

    console.log("Part 2:", sum);
}

part1(input);
part2(input);