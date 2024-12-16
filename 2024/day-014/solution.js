const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function parsePair(pair) {
    return pair.substring(2).split(",").map(Number);
}

function parseLine(line) {
    return line.trim().split(" ").map(parsePair);
}

function translate([Ix, Iy], [Vx, Vy], time) {
    return [Ix + Vx * time, Iy + Vy * time];
}

function normalize([x, y], length, width) {
    const modX = x % length;
    const modY = y % width;
    return [
        modX < 0 ? modX + length : modX,
        modY < 0 ? modY + width : modY
    ];
}

function getQuadrant([x, y], length, width) {
    const midLength = Math.floor(length / 2);
    const midWidth = Math.floor(width / 2);

    if (x < midLength && y < midWidth) {
        return 0;
    }

    if (x > midLength && y < midWidth) {
        return 1;
    }

    if (x < midLength && y > midWidth) {
        return 2;
    }

    if (x > midLength && y > midWidth) {
        return 3;
    }

    // We're on the dividing line of the quadrant.
    return -1;
}

function part1(input) {
    const quadrants = [0, 0, 0, 0];
    for(const line of input) {
        const [start, velocity] = parseLine(line);
        const end = normalize(translate(start, velocity, 100), 101, 103);
        const quadrant = getQuadrant(end, 101, 103);
        if (quadrant !== -1) {
            quadrants[quadrant]++;
        }
    }

    console.log("Part 1:", quadrants.reduce((a, b) => a * b));
}

function part2(input) {
    // I have no idea what Christmas tree I'm looking for. Hopefully something meaningful
    // comes up in the first 103 * 101 iterations.
    const outputs = [];
    for(let i = 0; i < 103 * 101; i++) {
        const output = Array.from({ length: 101 }).map(row => new Array(103).fill('.'));
        for(const line of input) {
            const [start, velocity] = parseLine(line);
            const [x, y] = normalize(translate(start, velocity, i), 101, 103);
            output[x][y] = '*';
        }
        const outStr = "Time = " + i + "\n" + output.map(line => line.join('')).join('\n');
        outputs.push(outStr);
    }
    fs.writeFileSync('./part2-output.txt', outputs.join("\n\n"));

    // I can't push the whole file to GitHub - too big.
    // See the meaningful iteration output in part2-output.txt
}

part1(input);
part2(input);