const fs = require('node:fs');
const point = require('../../common/structures/point');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n");

const Point = point.Point;




function parseInstructions(input) {
    const instructions = [];
    for (const line of input) {
        const parts = line.trim().split(' ');
        if (parts[0] === "turn") {
            parts.shift();
        }
        const [instr, start, _, end] = parts;
        instructions.push({
            command: instr,
            start: Point.decode(start),
            end: Point.decode(end)
        });
    }
    return instructions;
}

function part1(instructions) {
    const grid = Array.from({ length: 1000 }).map(x => new Array(1000).fill(0));
    for (const {command, start, end} of instructions) {
        for(let i = start.x; i <= end.x; i++) {
            for (let j = start.y; j <= end.y; j++) {
                switch(command) {
                    case 'on':
                        grid[i][j] = 1;
                        break;
                    case 'off':
                        grid[i][j] = 0;
                        break;
                    case 'toggle':
                        grid[i][j] = (grid[i][j] + 1) % 2;
                        break;
                }
            }
        }
    }
    return grid.flat().filter(x => x === 1).length;
}

function part2(instructions) {
    const grid = Array.from({ length: 1000 }).map(x => new Array(1000).fill(0));
    for(const {command, start, end} of instructions) {
        for(let i = start.x; i <= end.x; i++) {
            for (let j = start.y; j <= end.y; j++) {
                switch(command) {
                    case 'on':
                        grid[i][j]++;
                        break;
                    case 'off':
                        if (grid[i][j] > 0) {
                            grid[i][j]--;
                        }
                        break;
                    case 'toggle':
                        grid[i][j] += 2;
                        break;
                }
            }
        }
    }
    return grid.flat().reduce((a, b) => a + b);
}

const instructions = parseInstructions(input);
console.log("Part 1:", part1(instructions));
console.log("Part 2:", part2(instructions));
