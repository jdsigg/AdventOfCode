const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(line => line.split(""));

const DIRECTIONS = Object.freeze({
    LEFT: [0, -1],
    DOWN: [1, 0],
    RIGHT: [0, 1],
    UP: [-1, 0],
});

function translate(x, y, direction) {
    const [moveX, moveY] = DIRECTIONS[direction];
    return [x + moveX, y + moveY];
}

function isPointValid(x, y, grid) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[x].length;
}

function pointStr(x, y) {
    return `${x}|${y}`;
}

function pointFromStr(str) {
    return str.split(',').map(Number);
}

function buildRegion(x, y, input) {
    const plotLabel = input[x][y];
    const curr = [[x, y]];
    const seen = new Set();
    const plot = [];
    while (curr.length > 0) {
        const [pX, pY] = curr.shift();
        if (!isPointValid(pX, pY, input) || input[pX][pY] !== plotLabel || seen.has(pointStr(pX, pY))) {
            continue;
        }
        seen.add(pointStr(pX, pY));
        plot.push([pX, pY]);

        curr.push([pX + 1, pY]);
        curr.push([pX - 1, pY]);
        curr.push([pX, pY + 1]);
        curr.push([pX, pY - 1]);
    }

    return plot;
}

function getRegionPointsToNumberOfNeighbors(region) {
    // Assume each region's plant has no neighbors.
    const plantToNeighbors = {};
    for (const plant of region) {
        plantToNeighbors[plant] = 4;
    }

    // Go back over every plant and calculate its possible neighbors.
    // For each neighbor that exists, reduce the neighbor's fence count.
    for (const [pX, pY] of region) {
        const l = [pX - 1, pY];
        const r = [pX + 1, pY];
        const u = [pX, pY - 1];
        const d = [pX, pY + 1];

        if (l in plantToNeighbors) {
            plantToNeighbors[l]--;
        }

        if (r in plantToNeighbors) {
            plantToNeighbors[r]--;
        }

        if (u in plantToNeighbors) {
            plantToNeighbors[u]--;
        }

        if (d in plantToNeighbors) {
            plantToNeighbors[d]--;
        }
    }

    return plantToNeighbors;
}

function fenceCost(region) {
    const numNeighborsByPlants = getRegionPointsToNumberOfNeighbors(region);
    return region.length * Object.keys(numNeighborsByPlants).map(k => numNeighborsByPlants[k]).reduce((a, b) => a + b);
}

function getSubRegion(x, y, input, regionType, minX, maxX, minY, maxY) {
    const seen = new Set();
    const curr = [[x, y]];
    const subRegion = [];
    while (curr.length > 0) {
        const [pX, pY] = curr.pop();

        // If we hit the bounds of the parent region, stop.
        if (input[pX][pY] === regionType) {
            continue;
        }

        // If we are at the bounds of the parent region, this BFS cannot represent a sub-region.
        if (pX === maxX || pX === minX || pY === maxY || pY === minY) {
            return [false, subRegion];
        }

        // Stop if we are retracing our steps.
        if (seen.has(pointStr(pX, pY))) {
            continue;
        }

        // Otherwise, expand the sub-region.
        seen.add(pointStr(pX, pY));
        subRegion.push([pX, pY]);

        curr.push([pX + 1, pY]);
        curr.push([pX - 1, pY]);
        curr.push([pX, pY + 1]);
        curr.push([pX, pY - 1]);
    }
    return [true, subRegion];
}

function leftHandRule(region, ignoredTurns) {
    const neighborsByPlants = getRegionPointsToNumberOfNeighbors(region);
    const perimeter = JSON.parse(JSON.stringify(neighborsByPlants));
    // A valid place to start the left-hand rule is from a perimeter point that does not
    // touch a sub-region.

    for (const key of Object.keys(neighborsByPlants)) {
        // We will only ever want to operate on perimeter keys, so remove non-perimeters.
        if (perimeter[key] === 0) {
            delete perimeter[key];
        }
    }

    // Find the first perimeter point that neighbors no sub-regions.
    let curr = undefined;
    for (const key of Object.keys(perimeter)) {
        const [pX, pY] = pointFromStr(key);
        const neighbors = [
            [pX + 1, pY],
            [pX - 1, pY],
            [pX, pY + 1],
            [pX, pY - 1],

        ].map(([x, y]) => pointStr(x, y));
        if (neighbors.every(n => !ignoredTurns.has(n))) {
            curr = [pX, pY];
            break;
        }
    }

    const [cX, cY] = curr;
    // The direction we go in to start matters. After that, it is systematic.
    let currDirection = undefined;
    if (!neighborsByPlants[[cX - 1, cY]]) {
        curr = [cX - 1, cY];
        currDirection = "LEFT";
    } else if (!neighborsByPlants[[cX + 1, cY]]) {
        curr = [cX + 1, cY];
        currDirection = "RIGHT";
    } else if (!neighborsByPlants[[cX, cY - 1]]) {
        curr = [cX, cY - 1];
        currDirection = "DOWN";
    } else {
        curr = [cX, cY + 1];
        currDirection = "UP";
    }

    // curr is on the outside of the perimeter.
    // Left hand (direction-specific) is on the perimeter.

    // Going LEFT, perimeter is DOWN
    // Going DOWN, perimeter is RIGHT
    // Going RIGHT, perimeter is UP
    // Going UP, perimeter is LEFT
    const leftHandMap = {
        LEFT: "DOWN",
        DOWN: "RIGHT",
        RIGHT: "UP",
        UP: "LEFT",
    };

    // Walk the perimeter, incrementing fence count when we turn.
    let fenceCount = 0;
    const dirs = Object.keys(DIRECTIONS);
    const start = pointStr(curr[0], curr[1]);
    let startSeen = false;
    while (true) {
        const [cX, cY] = curr;
        if (pointStr(cX, cY) === start) {
            if (startSeen) {
                break;
            }
            startSeen = true;
        }

        const leftHand = translate(cX, cY, leftHandMap[currDirection]);
        // If we are next to the perimeter, try to walk forward.
        if (perimeter[leftHand]) {
            const next = translate(cX, cY, currDirection);
            // If where we walk is the perimeter, we need to turn right instead.
            if (perimeter[next]) {
                const currInd = dirs.indexOf(currDirection) - 1;
                if (currInd === -1) {
                    currDirection = dirs[dirs.length - 1];
                } else {
                    currDirection = dirs[currInd];
                }

                fenceCount++;
                continue;
            }
            // Walk forward.
            curr = next;
            continue;
        }

        // We have to turn and step forward.
        currDirection = dirs[(dirs.indexOf(currDirection) + 1) % dirs.length];
        curr = translate(cX, cY, currDirection);
        // Turning means a new fence.
        fenceCount++;
    }

    return fenceCount;
}


/**
 * Regions are amorphous blobs of squares in a grid. There are two types of blobs:
 * - One overarching blob of type X plants
 * - Multiple smaller blobs plants that aren't of type X
 * 
 * An example with one blob of X:
 *   . . . .
 *   . X X .
 *   . X X .
 *   . . . .
 * 
 * An example with two non-X blobs:
 *  . . . . . . .
 *  . X X X X X .
 *  . X a X b X .
 *  . X X X X X .
 *  . . . . . . .
 * 
 * For any blob, we can trace a fence around its outside with the "left-hand rule," i.e.,
 * imagine holding your left hand out and walking the perimeter of the blob, keeping track
 * of where you turn.
 * 
 * For example, starting in the top right corner and moving right (left hand === '^'):
 * . . ^ .   . ^ . .   . . . .   . . . .   . . . .   . . . .   . . . .   . . . . 
 * . X X .   . X X .   ^ X X .   . X X .   . X X .   . X X .   . X X .   . X X ^
 * . X X .   . X X .   . X X .   ^ X X .   . X X .   . X X .   . X X ^   . X X .
 * . . . .   . . . .   . . . .   . . . .   . ^ . .   . . ^ .   . . . .   . . . .
 * 
 * Each time you turn, you start a new fence. Do this repeadtedly until you walk the entire
 * perimeter. Here, we've found 4 fences.
 * 
 * The same process can be done for the non-type X plants. For example, (with the left-most
 * plant from example 2):
 *  . . . . .   . . . . .   . . . . .   . . . . .
 *  . X ^ X .   . X X X .   . X X X .   . X X X .
 *  . X a X .   . ^ a X .   . X a X .   . X a ^ .
 *  . X X X .   . X X X .   . X ^ X .   . X X X .
 *  . . . . .   . . . . .   . . . . .   . . . . .
 * 
 * Here, we've found 4 fences.
 * 
 * Since inner regions share fences with their neighboring parent regions, we can calculate the
 * fencing needed for the inner region and add that to the outer region's total.
 * 
 * This function only know the squares of plant type X. So, the algorithm:
 * 
 * Given the plants in the X-type blob...
 * 1. Find all sub-blobs (consider all sub-blobs to be the same plant type)
 * 2. Use the left-hand rule to count fences on blob X
 * 3. For each sub-blob, use the left-hand rule
 * 4. Return the sum.
 */
function fenceCostV2(region, input) {
    // Step 1: Find sub-blobs.
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = -1;
    let maxY = -1;

    for (const [pX, pY] of region) {
        minX = Math.min(minX, pX);
        minY = Math.min(minY, pY);
        maxX = Math.max(maxX, pX);
        maxY = Math.max(maxY, pY);
    }

    const [fX, fY] = [region[0][0], region[0][1]];
    const regionType = input[fX][fY];
    const subRegions = [];
    const seenSubRegionPoints = new Set();
    for (let i = minX + 1; i < maxX; i++) {
        for (let j = minY + 1; j < maxY; j++) {
            if (input[i][j] === regionType || seenSubRegionPoints.has(pointStr(i, j))) {
                continue;
            }
            const [isSubRegion, seenPoints] = getSubRegion(i, j, input, regionType, minX, maxX, minY, maxY);
            if (isSubRegion) {
                subRegions.push(seenPoints);
            }
            seenPoints.forEach(([x, y]) => seenSubRegionPoints.add(pointStr(x, y)));
        }
    }

    // Step 2 / 3: Left hand rule for the main regions.
    const ignoredTurns = new Set();
    subRegions.flatMap(subRegion => subRegion.map(([x, y]) => pointStr(x, y))).forEach(s => ignoredTurns.add(s));
    let fenceLength = leftHandRule(region, ignoredTurns);
    for (const subRegion of subRegions) {
        const subFenceCount = leftHandRule(subRegion, new Set());
        fenceLength += subFenceCount;
    }

    // Step 4.
    return region.length * fenceLength;
}

function solution(input) {
    const seenPoints = new Set();
    const regions = [];
    for (let i = 0; i < input.length; i++) {
        for (let j = 0; j < input[i].length; j++) {
            if (!seenPoints.has(pointStr(i, j))) {
                const region = buildRegion(i, j, input);
                regions.push(region);
                // To avoid rebuilding the same region twice.
                for (const [pX, pY] of region) {
                    seenPoints.add(pointStr(pX, pY));
                }
            }
        }
    }

    console.log("Part 1:", regions.map(fenceCost).reduce((a, b) => a + b));
    console.log("Part 2:", regions.map(region => fenceCostV2(region, input)).reduce((a, b) => a + b));
}

solution(input);