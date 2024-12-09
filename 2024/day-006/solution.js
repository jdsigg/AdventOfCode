const fs = require('node:fs');
const grid = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split(""));

const DIRECTIONS = Object.freeze({
    UP: [-1, 0],
    RIGHT: [0, 1],
    DOWN: [1, 0],
    LEFT: [0, -1],
});

function translate(x, y, direction) {
    const [moveX, moveY] = DIRECTIONS[direction];
    return [x + moveX, y + moveY];
}

// A grid of 4 bit numbers representing visits on a traversal.
function isRepeatVisit(x, y, direction, seen) {
    const index = Object.keys(DIRECTIONS).indexOf(direction);
    const mask = 1 << index;
    if ((seen[x][y] & mask) === mask) {
        return true;
    }
    seen[x][y] |= mask;
    return false;
}

function walkGrid(grid) {
    let currentDirection = "UP";
    let [cX, cY, _] = grid.flatMap((line, x) => line.map((c, y) => [x, y, c])).filter(([ , , c]) => c === '^')[0];

    // This is strictly used for part 2.
    // Originally, I used a set of [x, y, direction] - this would OOM.
    // I changed it to a map of [x, y] : direction - still OOM.
    // Now, an array of 4-bit numbers is used.
    const seen = Array.from({ length: grid.length }, () => new Array(grid[0].length).fill(0));

    while(grid[cX] && grid[cY]) {
        if (isRepeatVisit(cX, cY, currentDirection, seen)) {
            return false;
        }

        let [newX, newY] = translate(cX, cY, currentDirection);

        if (grid[newX] && grid[newX][newY] && grid[newX][newY] === '#') {
            // Turn 90 degrees.
            const dirs = Object.keys(DIRECTIONS);
            currentDirection = dirs[(dirs.indexOf(currentDirection) + 1) % dirs.length];
        } else {
            // Move forward.
            grid[cX][cY] = 'X';
            cX = newX;
            cY = newY;
        }
    }

    return true;
}

function part1(grid) {
    const gridCopy = JSON.parse(JSON.stringify(grid));
    const _ = walkGrid(gridCopy);
    console.log("Part 1:", gridCopy.flat().filter(c => c == 'X').length);
}

function part2(grid) {
    let sum = 0;
    // This is slow, but works. Takes under a minute.
    for(let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            // The starting position can't be a blockage.
            if (grid[i][j] !== '^') {
                const gridCopy = JSON.parse(JSON.stringify(grid));
                gridCopy[i][j] = '#';
                if (!walkGrid(gridCopy)) {
                    sum++;
                };
            }
        }
    }

    console.log("Part 2:", sum);
}

part1(grid);
part2(grid);