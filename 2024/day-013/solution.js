const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n\n").map(game => game.split("\n"));

function solveEquation(x1, y1, x2, y2, xRes, yRes) {
    // We have two results that we are looking for (xRes, yRes).
    // These results both depend on the number of times we press the A and B buttons.
    // Two equations can be made from this:
    //  1. x1 * A + x2 * B = xRes
    //  2. y1 * A + y2 * B = yRes

    // We know everything but A and B; 2 linear equations, 2 unknowns.
    // Step 1: solve the first equation for A.
    //  A = (xRes - x2 * B) / x1

    // Step 2: substitute A into the second equation.
    //  y1 * (xRes - x2 * B) / x1 + y2 * B = yRes

    // A bit of simplifying.... we end up with:
    //  B = (yRes * x1 - xRes * y1) / (y2 * x1 - y1 * x2)
    const B = (yRes * x1 - xRes * y1) / (y2 * x1 - y1 * x2);

    // From Step 1... we can easily find A given B.
    const A = (xRes - x2 * B) / x1;
    return [A, B];
}

function parseLine(line, toAdd) {
    const numbers = line.trim().split(": ")[1];
    const [x, y] = numbers.split(", ");
    return [
        BigInt(x.substring(2)) + BigInt(toAdd), 
        BigInt(y.substring(2)) + BigInt(toAdd)
    ];
}

function check(a, b, v1, v2, res) {
    // Each equation only has one solution. But, we're working with BigInts... truncation could happen.
    // Double check for equation sanity.

    // Separately, it might be possible for A or B to negative. In the scope of the problem, this feels
    // invalid - it doesn't makes sense to press a button a negative number of times.
    return (
        a * v1 + b * v2 == res &&
        a > BigInt(0) &&
        b > BigInt(0)
     );
}

function solve(input, toAdd = '0') {
    let sum = BigInt(0);
    for(const [aButton, bButton, prize] of input) {
        const [x1, y1] = parseLine(aButton, '0');
        const [x2, y2] = parseLine(bButton, '0');
        const [xRes, yRes] = parseLine(prize, toAdd);
        const [aPresses, bPresses] = solveEquation(x1, y1, x2, y2, xRes, yRes);
        if (check(aPresses, bPresses, x1, x2, xRes) && (check(aPresses, bPresses, y1, y2, yRes))) {
            sum += (aPresses * BigInt(3) + bPresses);
        }
    }
    return sum;
}

console.log("Part 1:", solve(input));
console.log("Part 2:", solve(input, '10000000000000'));