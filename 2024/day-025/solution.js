const fs = require('node:fs');
const input =  fs.readFileSync('./input.txt', 'utf-8').split("\n\n");

function lockCount(schematic) {
    const counts = [];
    for(let col = 0; col < schematic[0].length; col++) {
        let count = -1;
        let row = 0;
        while(schematic[row++][col] === '#') {
            count++;
        }
        counts.push(count);
    }
    return counts;
}

function keyCount(schematic) {
    const counts = [];
    for(let col = 0; col < schematic[0].length; col++) {
        let count = -1;
        let row = schematic.length - 1;
        while(schematic[row--][col] === '#') {
            count++;
        }
        counts.push(count);
    }
    return counts;

}

function getLocksAndKeys(input) {
    const locks = [];
    const keys = [];
    const ALL_POUND = '#####';
    const ALL_PERIOD = '.....';
    for (const pattern of input) {
        const schematic = pattern.split('\n').map(line => line.split(''));
        // Locks have their top row entirely filled and their bottom row empty.
        // Keys are the opposite.
        // Ignore everything else.
        const top = schematic[0].join('');
        const bottom = schematic[schematic.length - 1].join('');
        if (top === ALL_POUND && bottom === ALL_PERIOD) {
            locks.push(lockCount(schematic));
        } else if (top === ALL_PERIOD && bottom === ALL_POUND) {
            keys.push(keyCount(schematic));
        } else {
            console.log("Invalid:", schematic);
        }
    }

    return [locks, keys];
}

function part1(locks, keys) {
    let fit = 0;
    for(const lock of locks) {
        for(const key of keys) {
            if (lock.every((l, i) => l + key[i] < 6)) {
                fit++;
            }
        }
    }
    return fit;
}


const [locks, keys] = getLocksAndKeys(input);
console.log("Part 1:", part1(locks, keys));
