const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8');

const DIRECTIONS = Object.freeze({
    '<': [0, -1],
    '^': [-1, 0],
    '>': [0, 1],
    'v': [1, 0],
});

function translate(x, y, direction) {
    const [moveX, moveY] = DIRECTIONS[direction];
    return [x + moveX, y + moveY];
}

function parseInput(input, doubleSize) {
    const [map, moves] = input.split("\n\n");

    return [
        // The warehouse.
        map.split("\n").map(line => line.split('').flatMap(c => {
            if (!doubleSize) {
                return c;
            }

            switch (c) {
                case '#':
                    return ['#', '#'];
                case 'O':
                    return ['[', ']'];
                case '.':
                    return ['.', '.'];
                case '@':
                    return ['@', '.'];
            }
        })),
        // The list of moves.
        moves.split("\n").flatMap(line => line.split(''))
    ];
}

function part1(warehouse, moves) {
    let curr = warehouse.flatMap((row, i) => row.map((_, j) => [i, j])).filter(([i, j]) => warehouse[i][j] === '@')[0];
    while (moves.length > 0) {
        const [cX, cY] = curr;
        const move = moves.shift();
        // Find the next position.
        let [eX, eY] = translate(cX, cY, move);

        if (warehouse[eX][eY] === '#') {
            // Wall case - do nothing.
            continue;
        }

        if (warehouse[eX][eY] === '.') {
            // Move to the empty space.
            warehouse[eX][eY] = '@';
            // Replace where we were.
            warehouse[cX][cY] = '.';
            curr = [eX, eY];
            continue;
        }

        // We're moving a box. We can shift every box that we come across.
        const [fX, fY] = [eX, eY];
        while (warehouse[eX][eY] === 'O') {
            [eX, eY] = translate(eX, eY, move);
        }

        // If we are at a wall, we can't move the boxes we came across.
        if (warehouse[eX][eY] === '#') {
            continue;
        }

        // We have to have landed at an empty space. Replace it with a box.
        warehouse[eX][eY] = 'O';
        // Every spot we came across to get here was a box. Replace the first box with the robot.
        warehouse[fX][fY] = '@';
        // Replace the robot with an empty space.
        warehouse[cX][cY] = '.';
        curr = [fX, fY];
    }
    console.log("Part 1:",
        warehouse.flatMap((row, i) => row.map((col, j) => [i, j]))
            .filter(([i, j]) => warehouse[i][j] === 'O')
            .map(([i, j]) => 100 * i + j)
            .reduce((a, b) => a + b));
}

function boxStr([lX, lY], [rX, rY]) {
    return `[${lX},${lY}]|[${rX},${rY}]`;
}

function findMovableBoxes(boxX, boxY, direction, warehouse) {
    const seenBoxes = new Set();
    const boxes = []
    const isLeftBracket = warehouse[boxX][boxY] === '[';
    let queue = [[[boxX, isLeftBracket ? boxY : boxY - 1], [boxX, isLeftBracket ? boxY + 1 : boxY]]];
    while (queue.length > 0) {
        const [left, right] = queue.shift();
        if (seenBoxes.has(boxStr(left, right))) {
            continue;
        }
        seenBoxes.add(boxStr(left, right));
        boxes.push([left, right]);

        const [lX, lY] = left;
        const [rX, rY] = right;
        const xShift = direction === '^' ? -1 : 1;
        /**
         * Looking at the two points above or below the current box is enough to find us all cases.
         * 
         * .[]...   ...[].   .[][].   ..[]..   ......   ..#...   ...#..   ..##..   .[]#..   ..#[].
         * ..[]..   ..[]..   ..[]..   ..[]..   ..[]..   ..[]..   ..[]..   ..[]..   ..[]..   ..[]..
         * ......   ......   ......   ......   ......   ......   ......   ......   ......   ......
         *  (0)      (1)      (2)      (3)      (4)      (5)      (6)      (7)      (8)      (9)
         * 
         *  - 5, 6, 7, 8, 9 mean we can't move. These do not continue BFS.
         *  - 4 means we can move every box we've come across. This does not continue BFS.
         *  - 0, 1, 2, 3 mean we need to keep BFS'ing.
         */
        if (warehouse[lX + xShift][lY] === '#' || warehouse[rX + xShift][rY] === '#') {
            // Cases 5-9: Stop immediately - one bad box prevents them all from moving.
            return [];
        }

        if (warehouse[lX + xShift][lY] === '.' && warehouse[rX + xShift][rY] === '.') {
            // Case 4: We can move this box! Stop searching for boxes from here.
            continue;
        }

        if (warehouse[lX + xShift][lY] === ']') {
            // Case 0 and half of case 2: There is a box above / below us, left-shifted.
            queue.push(
                [
                    [lX + xShift, lY - 1],
                    [rX + xShift, rY - 1]
                ]
            );
        }

        if (warehouse[rX + xShift][rY] === '[') {
            // Case 1 and the other half of case 2: There is a box above / below us, right-shifted.
            queue.push(
                [
                    [lX + xShift, lY + 1],
                    [rX + xShift, rY + 1]
                ]
            );
        }

        if (warehouse[lX + xShift][lY] === '[' && warehouse[rX + xShift][rY] === ']') {
            // Case 3: There is a box directly above / below us.
            queue.push(
                [
                    [lX + xShift, lY],
                    [rX + xShift, rY]
                ]
            );
        }
    }

    // We can move every box we've seen!
    return boxes;
}

function part2(warehouse, moves) {
    /**
     * The algorithm for part 2 is effectively the same. The only difference is when we move up and down.
     * When we move up, a box can neighbor another box in one of three ways:
     * 
     *  Up / Left    Above      Up / Right
     *   .[]...      ..[]..      ...[].
     *   ..[]..      ..[]..      ..[]..
     *   ......      ......      ......
     * 
     * This holds true for moving down, but in the opposite fashion.
     * 
     * Whenever we have an up / down command, BFS to find all boxes.
     */

    let curr = warehouse.flatMap((row, i) => row.map((_, j) => [i, j])).filter(([i, j]) => warehouse[i][j] === '@')[0];
    while (moves.length > 0) {
        const [cX, cY] = curr;
        const move = moves.shift();
        // Find the next position.
        let [eX, eY] = translate(cX, cY, move);

        if (warehouse[eX][eY] === '#') {
            // Wall case - do nothing.
            continue;
        }

        if (warehouse[eX][eY] === '.') {
            // Move to the empty space.
            warehouse[eX][eY] = '@';
            // Replace where we were.
            warehouse[cX][cY] = '.';
            curr = [eX, eY];
            continue;
        }

        const [fX, fY] = [eX, eY];
        // We're moving a box.
        if (move === '<' || move === '>') {
            // Left / Right aren't very special. Do what we did before, but slightly modified.
            while (warehouse[eX][eY] === '[' || warehouse[eX][eY] === ']') {
                [eX, eY] = translate(eX, eY, move);
            }

            // If we are at a wall, we can't move the boxes we came across.
            if (warehouse[eX][eY] === '#') {
                continue;
            }

            // Shift every box down until we get back to where we were.
            if (move === '<') {
                for (let i = eY; i < cY; i++) {
                    warehouse[cX][i] = warehouse[cX][i + 1];
                }
            } else {
                for (let i = eY; i > cY; i--) {
                    warehouse[cX][i] = warehouse[cX][i - 1];
                }
            }
            // Lastly, clear the space we left.
            warehouse[cX][cY] = '.';
            curr = [fX, fY];
            continue;
        }

        // We have to move up or down. First, BFS up or down to find touching boxes.
        const boxesToMove = findMovableBoxes(eX, eY, move, warehouse);
        if (boxesToMove.length > 0) {
            // We want to shift every box up or down 1. We want to start from the farthest box
            // from us, then work our way in.
            boxesToMove.sort((a, b) => {
                const [left1, _] = a;
                const [left2, __] = b;
                // If we are moving down, we want to start with larger rows.
                return move === 'v' ? left2[0] - left1[0] : left1[0] - left2[0]
            });
            // Iterate over every box, shifting them in the appropriate direction. It is not
            // guaranteed for a box to be replaced by a box, so always clear the shifted space.
            const xShift = move === 'v' ? 1 : -1;
            for (const [left, right] of boxesToMove) {
                const [lX, lY] = left;
                const [rX, rY] = right;
                warehouse[lX + xShift][lY] = warehouse[lX][lY];
                warehouse[lX][lY] = '.';
                warehouse[rX + xShift][rY] = warehouse[rX][rY];
                warehouse[rX][rY] = '.';
            }
            // Lastly, clear the space we left.
            warehouse[fX][fY] = '@';
            warehouse[cX][cY] = '.';
            curr = [fX, fY];
            continue;
        }
    }

    console.log("Part 2:", warehouse.flatMap((row, i) => row.map((col, j) => [i, j]))
        .filter(([i, j]) => warehouse[i][j] === '[')
        .map(([i, j]) => 100 * i + j)
        .reduce((a, b) => a + b));
}

const [warehouse, moves] = parseInput(input, /* doubleSize= */ false);
part1(warehouse, moves);

const [warehouseV2, movesV2] = parseInput(input, /* doubleSize= */ true);
part2(warehouseV2, movesV2);