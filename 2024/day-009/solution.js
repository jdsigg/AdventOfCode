const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('').map(Number);

function createDiskMap(input) {
    const arr = [];
    let isFile = true;
    for(let i = 0; i < input.length; i++) {
        for(let j = 0; j < input[i]; j++) {
            arr.push(isFile ? i / 2 : '.');
        }
        isFile = !isFile;
    }
    return arr;
}

function defrag(diskMap) {
    let start = 0;
    let end = diskMap.length - 1;
    while (start < end) {
        // Find the next free space to put a number.
        if (diskMap[start] !== '.') {
            start++;
            continue;
        }

        // Find the next block to move.
        if(diskMap[end] === '.') {
            end--;
            continue;
        }

        // We can move a block.
        diskMap[start++] = diskMap[end];
        diskMap[end--] = '.';
    }
}

// The best way to do this is likely with a custom representation of the disk map.
// Instead, I'll just use the bloated array from part 1.
function defrag2(diskMap) {
    let currId;
    for(let i = diskMap.length - 1; i >= 0; i--) {
        if (diskMap[i] !== '.') {
            currId = diskMap[i];
            break;
        }
    }

    let currBlockSize = -1;
    let currIdIndex = -1;
    let end = diskMap.length - 1;
    // Try to move every block, starting with the largest and ending with 0.
    while (currId >= 0) {
        // Find the start of the block matching this ID.
        if(diskMap[end] !== currId) {
            end--;
            continue;
        }

        // Find the size of the current block.
        if(currBlockSize === -1) {
            currIdIndex = end;
            currBlockSize = 0;
            while (diskMap[currIdIndex - currBlockSize] === currId) {
                currBlockSize++;
            }
            continue;
        }

        // Find the first available free space to put this before where currId is.
        let freeSize = 0;
        for(let i = 0; i <= currIdIndex - currBlockSize; i++) {
            if(diskMap[i] === '.') {
                freeSize++;
                if (freeSize === currBlockSize) {
                    // Move the block.
                    for(let j = i; j > i - freeSize; j--) {
                        diskMap[j] = currId;
                    }
                    // Clear the block from where it was.
                    for (let j = currIdIndex; j > currIdIndex - currBlockSize; j--) {
                        diskMap[j] = '.';
                    }
                    break;
                }
            } else {
                freeSize = 0;
            }
        }

        // Reset for the next move.
        currId--;
        end -= currBlockSize;
        currBlockSize = -1;
    }
}

function checksum(diskMap) {
    return diskMap
        .map((n, i) => [n, i])
        .filter(([n, _]) => n !== '.')
        .map(([n, i]) => BigInt(n) * BigInt(i))
        .reduce((a, b) => a + b);

}

function part1(input) {
    const diskMap = createDiskMap(input);
    defrag(diskMap);
    console.log("Part 1:", checksum(diskMap));
}

function part2(input) {
    const diskMap = createDiskMap(input);
    defrag2(diskMap);
    console.log("Part 2:", checksum(diskMap));
}

part1(input);
part2(input);