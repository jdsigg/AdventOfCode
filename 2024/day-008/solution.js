const { group } = require('node:console');
const fs = require('node:fs');
const grid = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split(""));

function isPointValid(x, y, grid) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
}

function pointStr([x, y]) {
    return `${x}|${y}`;
}

function part1(grid) {
    const groupings = {};
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            const char = grid[i][j];
            if (char == '.') {
                continue;
            }
            if (!groupings[char]) {
                groupings[char] = [];
            }
            groupings[char].push([i, j]);
        }
    }

    const antinodes = new Set();
    for(const key of Object.keys(groupings)) {
        const points = groupings[key];
        for(let i = 0; i < points.length; i++) {
            for(let j = i + 1; j < points.length; j++) {
                // Calculate antinodes from points. Add to set if valid.
                const [x1, y1] = points[i];
                const [x2, y2] = points[j];
                const [dy, dx] = [y2 - y1, x2 - x1];

                const [nx1, ny1] = [x1 - dx, y1 - dy];
                if (isPointValid(nx1, ny1, grid)) {
                    antinodes.add(pointStr([nx1, ny1]));
                }

                const [nx2, ny2] = [x2 + dx, y2 + dy];
                if (isPointValid(nx2, ny2, grid)) {
                    antinodes.add(pointStr([nx2, ny2]));
                }
            }
        }
    }

    console.log("Part 1:", antinodes.size);
}

function part2(grid) {
    const groupings = {};
    for(let i = 0; i < grid.length; i++) {
        for(let j = 0; j < grid[i].length; j++) {
            const char = grid[i][j];
            if (char == '.') {
                continue;
            }
            if (!groupings[char]) {
                groupings[char] = [];
            }
            groupings[char].push([i, j]);
        }
    }

    const antinodes = new Set();
    for(const key of Object.keys(groupings)) {
        const points = groupings[key];
        for(let i = 0; i < points.length; i++) {
            // Difference 1: All nodes automatically become antinodes.
            antinodes.add(pointStr(points[i]));
            for(let j = i + 1; j < points.length; j++) {
                // Calculate antinodes from points. Add to set if valid.
                const [x1, y1] = points[i];
                const [x2, y2] = points[j];
                const [dy, dx] = [y2 - y1, x2 - x1];

                // Difference 2: loop indefinitely for validity.
                let [nx1, ny1] = [x1 - dx, y1 - dy];
                while (isPointValid(nx1, ny1, grid)) {
                    antinodes.add(pointStr([nx1, ny1]));
                    nx1 -= dx;
                    ny1 -= dy;
                }

                let [nx2, ny2] = [x2 + dx, y2 + dy];
                while (isPointValid(nx2, ny2, grid)) {
                    antinodes.add(pointStr([nx2, ny2]));
                    nx2 += dx;
                    ny2 += dy;
                }
            }
        }
    }

    console.log("Part 2:", antinodes.size);
}


part1(grid);
part2(grid);