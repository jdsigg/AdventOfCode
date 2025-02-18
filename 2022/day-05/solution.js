const fs = require('node:fs');
const [boxLines, moveLines] = fs.readFileSync('./input.txt', 'utf-8').split("\n\n");

function parseBoxes(boxLines) {
    const numBoxes = boxLines.pop().trim().split('   ').length;
    const boxes = Array.from({ length: numBoxes }, () => []);
    for (const line of boxLines.reverse()) {
        for (let i = 0; i < line.length; i+=4) {
            if (line[i] === '[') {
                boxes[i/4].push(line[i+1]);
            }
        }
    }
    return boxes;
}

function parseMoves(moveLines) {
    return moveLines.map(line => {
        const [move, count, from, source, to, destination] = line.trim().split(' ');
        return [Number(count), source - 1, destination - 1];
    });
}

function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function solve(boxes, moves, reverse) {
    for(let [count, source, destination] of moves) {
        const slice = boxes[source].splice(boxes[source].length - count);
        boxes[destination].push(...(reverse ? slice.reverse() : slice));
    }
    return boxes.map(box => box[box.length - 1]).join('');
}

const boxes = parseBoxes(boxLines.split('\n'));
const moves = parseMoves(moveLines.split('\n'));
console.log("Part 1: ", solve(copy(boxes), copy(moves), /* reverse= */ true));
console.log("Part 2: ", solve(copy(boxes), copy(moves), /* reverse= */ false));