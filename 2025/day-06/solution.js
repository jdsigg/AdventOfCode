const Grid = require('../../common/structures/point').Grid;
const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

/**
 * Converts the input into structured format.
 * 
 * Every problem format is similar:
 *   - 2D array of numbers
 *   - op code
 * For example,
 * ' 3'
 * ' 4'
 * ' 5'
 * '56'
 * '* '
 * 
 * Is:
 * numbers: [
 *   [' ', '3'],
 *   [' ', '4'],
 *   [' ', '5'],
 *   ['5', '6']
 * ]
 * op: '*'
 * 
 * 
 * While not strictly mentioned in the problem, some invariants surface:
 *   - The op code is located at the left-most index of the largest number
 *   - Problem sets either increase (like the above example) or decrease (example reversed)
 * 
 * Leveraging these invariants, extract the 2D array and op code for each problem.
 */
function extractProblems(input) {
    const numbersLines = input.slice(0, input.length - 1);
    const opCodesLine = input.slice(-1)[0];
    const problems = [];

    let currentOpCodeIndex = 0;
    let nextOpcodeIndex = currentOpCodeIndex + 1;
    while (nextOpcodeIndex < opCodesLine.length) {
        // Walk forward until we find the next opCodeIndex
        while (opCodesLine[nextOpcodeIndex] === ' ') {
            nextOpcodeIndex++;
        }
        const numbers = [];
        // The end of the input has no space. All other problems separate numbers by a space
        const sliceIndex = nextOpcodeIndex === opCodesLine.length ? nextOpcodeIndex : nextOpcodeIndex - 1;
        for (const line of numbersLines) {
            numbers.push(line.slice(currentOpCodeIndex, sliceIndex).split(''));
        }
        problems.push({
            numbers,
            opCode: opCodesLine[currentOpCodeIndex]
        });
        currentOpCodeIndex = nextOpcodeIndex;
        nextOpcodeIndex = currentOpCodeIndex + 1;
    }
    return problems;
}

/**
 * Does cephalapod math.
 * 
 * For part 1, we take the input as is:
 *   ' 3'
 *   '45'
 *   '* '
 * Means 3 * 45
 * 
 * For part 2, we want the transposition of each problem.
 * The example above means 35 * 4.
 * 
 * Evaluate each problem, optionally transposing at the caller's request.
 */
function solve(problems, transpose) {
    let sum = 0n;
    for (const { numbers, opCode } of problems) {
        const parsedNumbers = (transpose ? Grid.transposeMatrix(numbers) : numbers).map(n => `BigInt(${n.join('')})`);
        const formula = parsedNumbers.join(opCode);
        sum += eval(formula);
    }
    return sum.toString();
}

const problems = extractProblems(input);
console.log("Part 1:", solve(problems, /* transpose= */ false));
console.log("Part 2:", solve(problems, /* transpose= */ true));