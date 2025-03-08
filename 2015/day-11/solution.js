const fs = require('node:fs');
const input = "cqjxjnds".split('');

function generateNextPassword(numericPassword) {
    // Add 1 to the end.
    numericPassword[numericPassword.length - 1]++;

    // Resolve carries, not considering 0th index.
    // What if santa runs out of passwords? :D
    for (let i = numericPassword.length - 1; i > 0; i--) {
        if (numericPassword[i] === 26) {
            numericPassword[i] = 0;
            numericPassword[i - 1]++;
        } else {
            break;
        }
    }
}

function isPasswordValid(numericPassword) {
    // Must have three increasing letters ([a, b, c] or [b, c, d], or ..., [x, y, z])
    const passesAnyThreeIncreasing = numericPassword
        .map((_, i) => i)
        .filter(i => i < numericPassword.length - 2)
        .map(i => [i, i + 1, i + 2])
        .map(([i, j, k]) =>
            numericPassword[i] + 1 === numericPassword[j] &&
            numericPassword[j] + 1 === numericPassword[k])
        .some(i => i);

    // Can't contain the letters i, o, or l.
    const passesNoIorOorl = numericPassword
        .filter(n => n === 8 || n === 14 || n === 11)
        .length === 0;

    // Needs at least two sets of doubles that don't overlap (aa.bb, aa..bbb, not aaa)
    const doublesIndices = numericPassword
        .map((_, i) => i)
        .filter(i => i < numericPassword.length - 1)
        .filter(i => numericPassword[i] === numericPassword[i + 1]);

    let passesNonOverlappingIndices = false;
    for (let i = 0; i < doublesIndices.length; i++) {
        for (let j = i + 1; j < doublesIndices.length; j++) {
            if (doublesIndices[i] + 1 !== doublesIndices[j]) {
                passesNonOverlappingIndices = true;
            }
        }
    }

    return passesAnyThreeIncreasing && passesNoIorOorl && passesNonOverlappingIndices;
}

function solve(input) {
    // Step 1 - convert password into effective base 26 number.
    // (a -> 0, b -> 1, ..., z -> 25)
    let asNums = input.map(l => l.charCodeAt(0) - 97);
    do {
        // Step 2 - add 1 until valid.
        generateNextPassword(asNums);
    } while (!isPasswordValid(asNums));
    // Step 3 - convert back.
    return asNums.map(l => String.fromCharCode(l + 97));
}

const newPass1 = solve(input);
const newPass2 = solve(newPass1);
console.log("Part 1:", newPass1.join(''));
console.log("Part 2:", newPass2.join(''));
