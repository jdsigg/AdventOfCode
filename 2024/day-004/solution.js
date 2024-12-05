const fs = require('node:fs');
const grid = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split(""));

const DIRECTIONS = Object.freeze({
    UP: [-1, 0],
    UP_RIGHT: [-1, 1],
    RIGHT: [0, 1],
    DOWN_RIGHT: [1, 1],
    DOWN: [1, 0],
    DOWN_LEFT: [1, -1],
    LEFT: [0, -1],
    UP_LEFT: [-1, -1],
});

function translate(x, y, direction) {
    const [moveX, moveY] = DIRECTIONS[direction];
    return [x + moveX, y + moveY];
}

function isPointValid(x, y, grid) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
}

function part1(grid) {
    const XMAS = "XMAS";
    function search(grid, direction, x, y, times) {
        if (!times) {
            return true;
        }

        if (!isPointValid(x, y, grid)) {
            return false;
        }

        if (grid[x][y] != XMAS[4 - times]) {
            return false;
        }

        const [newX, newY] = translate(x, y, direction);
        return search(grid, direction, newX, newY, times - 1);
    }

    let sum = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            for (const direction of Object.keys(DIRECTIONS)) {
                if (search(grid, direction, i, j, 4)) {
                    sum++;
                }
            }
        }
    }

    console.log("Part 1:", sum);
}

function part2(grid) {
    let sum = 0;

    function isMas(wordArray) {
        return wordArray.map(([i, j]) => grid[i][j]).sort().join('') === "AMS";
    }

    function areAllPointsValid(pointArray) {
        return pointArray.every(([i, j]) => isPointValid(i, j, grid));
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] != 'A') {
                continue;
            }
            const word1 = [translate(i, j, "UP_LEFT"), [i, j], translate(i, j, "DOWN_RIGHT")];
            const word2 = [translate(i, j, "UP_RIGHT"), [i, j], translate(i, j, "DOWN_LEFT")];

            if(!areAllPointsValid(word1) || !areAllPointsValid(word2)) {
                continue;
            }

            if(isMas(word1) && isMas(word2)) {
                sum++;
            }
        }
    }

    console.log("Part 2:", sum);
}


part1(grid);
part2(grid);