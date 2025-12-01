const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map(line => [line[0], Number(line.slice(1))]);

function part1(input) {
    let start = 50;
    let result = 0;
    for (const [direction, value] of input) {
        if (direction === 'L') {
            start -= value;
        } else if (direction === 'R') {
            start += value;
        }
        // Recalibrate start to be back in the range of [0, 99]
        while (start < 0) {
            start += 100;
        }
        while (start > 99) {
            start -= 100;
        }
        if (start === 0) {
            result++;
        }
    }
    return result;
}

function part2(input) {
    let start = 50;
    let result = 0;
    for (const [direction, value] of input) {
        if (direction === 'L') {
            // We want to turn the dial 'value' to the left.
            // If we can move without handling the 0 case, just do that.
            if (start - value > 0) {
                start -= value;
                continue;
            }
            const distanceRemaining = value - start;
            // We are currently pointing at zero.
            // Turn the dial as many times as possible, hitting zero each time.
            const numTouches = Math.floor(distanceRemaining / 100);
            result += numTouches;
            // If we start at 0, the first touch must not count towards the total.
            if (start !== 0) {
                result++;
            }
            // Put the dial back to it's resting place. If we landed on zero, just leave it there.
            if ((distanceRemaining - numTouches * 100) !== 0) {
                start = 100 - (distanceRemaining - numTouches * 100);
                continue;
            }
            start = 0;
        } else if (direction === 'R') {
            // We want to turn the dial 'value' to the right.
            // If we can move without handling the 0 case, just do that.
            if (start + value < 100) {
                start += value;
                continue;
            }
            const distanceRemaining = value - (100 - start);
            // We are currently pointing at 0.
            // Turn the dial as many times as possible, hitting zero each time.
            const numTouches = Math.floor(distanceRemaining / 100);
            result += 1 + numTouches;
            // Put the dial back to it's resting place. This is simpler than the 0 case above because coming from the right
            // always implies crossing over the dial's bounds to touch 0.
            start = distanceRemaining - numTouches * 100;
        }
    }
    return result;
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));