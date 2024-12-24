const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function parseLine(line) {
    if (!line) {
        return '';
    }
    return line.split(": ")[1];
}

function copy(o) {
    return JSON.parse(JSON.stringify(o));
}

function getCombo(value, state) {
    switch (value) {
        case 0n:
        case 1n:
        case 2n:
        case 3n:
            return value;
        case 4n:
            return state.regA;
        case 5n:
            return state.regB;
        case 6n:
            return state.regC;
    }
}

function part1(state) {
    const program = state.program;
    const output = [];
    for (let i = 0; i < program.length; i += 2) {
        const instr = program[i];
        const next = BigInt(program[i + 1]);
        switch (instr) {
            case 0n:
                state.regA = state.regA / (2n ** getCombo(next, state));
                break;
            case 1n:
                state.regB ^= next;
                break;
            case 2n:
                state.regB = getCombo(next, state) % 8n;
                break;
            case 3n:
                if (state.regA === 0n) {
                    continue;
                }
                i = Number(next) - 2;
                break;
            case 4n:
                state.regB ^= state.regC;
                break;
            case 5n:
                output.push((getCombo(next, state) % 8n).toString());
                break;
            case 6n:
                state.regB = state.regA / (2n ** getCombo(next, state));
                break;
            case 7n:
                state.regC = state.regA / (2n ** getCombo(next, state));
        }
    }
    return output.join(',');
}


const [a, , , , program] = input.map(parseLine);
const state = {
    regA: BigInt(a),
    regB: 0n,
    regC: 0n,
    program: program.split(',').map(BigInt)
};
console.log("Part 1:", part1(state));

// Observation 1: The size of a program dictates the range where our solution must be in.
// Specifically, for a program size i where i equals {1, 2, 3, ..., N}, the solution is somewhere in [ 2^(3*(i-1)), 2^3i )
// Our program is 16 numbers long. Therefore our solution is between
// [2^45, 2^48 - 1].

// Observation 2: Chains of 6's appear before iterations as we multiply an iteration by 8.
/**
 * Starting at 1:
 *  Octal: 1 Decimal: 1n Output: 7
 *  Octal: 10 Decimal: 8n Output: 7,7
 *  Octal: 100 Decimal: 64n Output: 6,7,7
 *  Octal: 1000 Decimal: 512n Output: 6,6,7,7
 *  Octal: 10000 Decimal: 4096n Output: 6,6,6,7,7
 *  Octal: 100000 Decimal: 32768n Output: 6,6,6,6,7,7
 *  Octal: 1000000 Decimal: 262144n Output: 6,6,6,6,6,7,7
 *  Octal: 10000000 Decimal: 2097152n Output: 6,6,6,6,6,6,7,7
 *  Octal: 100000000 Decimal: 16777216n Output: 6,6,6,6,6,6,6,7,7
 *  Octal: 1000000000 Decimal: 134217728n Output: 6,6,6,6,6,6,6,6,7,7
 *  Octal: 10000000000 Decimal: 1073741824n Output: 6,6,6,6,6,6,6,6,6,7,7
 *  Octal: 100000000000 Decimal: 8589934592n Output: 6,6,6,6,6,6,6,6,6,6,7,7
 *  Octal: 1000000000000 Decimal: 68719476736n Output: 6,6,6,6,6,6,6,6,6,6,6,7,7
 *  Octal: 10000000000000 Decimal: 549755813888n Output: 6,6,6,6,6,6,6,6,6,6,6,6,7,7
 *  Octal: 100000000000000 Decimal: 4398046511104n Output: 6,6,6,6,6,6,6,6,6,6,6,6,6,7,7
 *  Octal: 1000000000000000 Decimal: 35184372088832n Output: 6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7
 * 
 * Starting at 2:
 * 
 *  Octal: 2 Decimal: 2n Output: 5
 *  Octal: 20 Decimal: 16n Output: 4,5
 *  Octal: 200 Decimal: 128n Output: 6,4,5
 *  Octal: 2000 Decimal: 1024n Output: 6,6,4,5
 *  Octal: 20000 Decimal: 8192n Output: 6,6,6,4,5
 *  Octal: 200000 Decimal: 65536n Output: 6,6,6,6,4,5
 *  Octal: 2000000 Decimal: 524288n Output: 6,6,6,6,6,4,5
 *  Octal: 20000000 Decimal: 4194304n Output: 6,6,6,6,6,6,4,5
 *  Octal: 200000000 Decimal: 33554432n Output: 6,6,6,6,6,6,6,4,5
 *  Octal: 2000000000 Decimal: 268435456n Output: 6,6,6,6,6,6,6,6,4,5
 *  Octal: 20000000000 Decimal: 2147483648n Output: 6,6,6,6,6,6,6,6,6,4,5
 *  Octal: 200000000000 Decimal: 17179869184n Output: 6,6,6,6,6,6,6,6,6,6,4,5
 *  Octal: 2000000000000 Decimal: 137438953472n Output: 6,6,6,6,6,6,6,6,6,6,6,4,5
 *  Octal: 20000000000000 Decimal: 1099511627776n Output: 6,6,6,6,6,6,6,6,6,6,6,6,4,5
 *  Octal: 200000000000000 Decimal: 8796093022208n Output: 6,6,6,6,6,6,6,6,6,6,6,6,6,4,5
 */

// Observation 3: Running programs produces a sequence of repeating numbers.
// Sequence: 7562301751623014356230051162300275623133516231303562312111623126756222575162225435622245116222427562237351622370356223611162236675631417516314143563140511631402756315335163153035631521116315267563065751630654356306451163064275630773516307703563076111630766756070175160701435607005116070027560713351607130356071211160712675606257516062543560624511606242756063735160637035606361116063667561541751615414356154051161540275615533516155303561552111615526756146575161465435614645116146427561477351614770356147611161476675663017516630143566300511663002756631335166313035663121116631267566225751662254356622451166224275662373516623703566236111662366756714175167141435671405116714027567153351671530356715211167152675670657516706543567064511670642756707735167077035670761116707667564701751647014356470051164700275647133516471303564712111647126756462575164625435646245116462427564637351646370356463611164636675655417516554143565540511655402756555335165553035655521116555267565465751654654356546451165464275654773516547703565476111654766
// Additionally, as we go through iterations of the program, the size of the output grows. This growing happens at each 2^(3*i)
//
// So, the first 7 numbers:
// i | sequence
// 1 |    7
// 2 |    5
// 3 |    6
// 4 |    2
// 5 |    3
// 6 |    0
// 7 |    1
//
// Then, we hit a boundary of 2^3 - the output grows. Then a new sequence starts from the beginning, but only moving 1/8 the speed
// 
// i | sequence 0 | sequence 1
// 8       7            7
// 9       5            7
// 10      1            7
// 11      6            7
// 12      2            7
// 13      3            7
// 14      0            7
// 15      1            7
//
// This means...
//   - Sequence 1: Starts at i = 1, repeating the current position of the sequence 1 time(s), repeating itself after 1024 iterations
//   - Sequence 2: Starts at i = 8, repeating the current position of the sequence 8 time(s), repeating itself after 8 * 1024 iterations
//   - Sequence 3: Starts at i = 64, repeating the current position of the sequence 64 time(s), repeating itself after 64 * 1024 iterations
//   - Sequence 4: Starts at i = 512, repeating the current position of the sequence 512 time(s), repeating itself after 512 * 1024 iterations
//   - Sequence 5: Starts at i = 4096, repeating the current position of the sequence 4096 time(s), repeating itself after 4096 * 1024 iterations
// ... and so on

// Approach:
// We know what number we have to match at each step of the process.
// We also know how to see if a number "could" exist at a given index.
// For example:
// - The last number in our program is 0.
// - In a sequence, 0 appears a few times (numbersToSequencePosition[0])
// - 0 is the 16th number, so its sequence started at 2**45
// For our [2^45, 2^48 - 1] invariant to hold, only the first 0 in the sequence can be present
// Start: 211106232532992n (program output: 6,6,6,6,6,6,6,6,6,6,6,6,6,6,0,0), End: 246290604621823n (program: 6,6,6,6,6,6,6,6,6,6,6,6,6,2,2,0)
// Repeat this process, generating ranges of possible values. Ranges will naturally drop (in total and in size).
// The last iteration lands at sequence 0, which has a range size of 1. Find the sequence 0 range with the lowest start, and we have our answer.

const numbersToSequencePosition = {};
// This is not generic - it is specific to my input program (2,4,1,3,7,5,0,3,4,3,1,5,5,5,3,0).
// To calculate this yourself, run your program, tracking the first character of program outputs, until the subsequence repeats itself.
const sequence = "7562301751623014356230051162300275623133516231303562312111623126756222575162225435622245116222427562237351622370356223611162236675631417516314143563140511631402756315335163153035631521116315267563065751630654356306451163064275630773516307703563076111630766756070175160701435607005116070027560713351607130356071211160712675606257516062543560624511606242756063735160637035606361116063667561541751615414356154051161540275615533516155303561552111615526756146575161465435614645116146427561477351614770356147611161476675663017516630143566300511663002756631335166313035663121116631267566225751662254356622451166224275662373516623703566236111662366756714175167141435671405116714027567153351671530356715211167152675670657516706543567064511670642756707735167077035670761116707667564701751647014356470051164700275647133516471303564712111647126756462575164625435646245116462427564637351646370356463611164636675655417516554143565540511655402756555335165553035655521116555267565465751654654356546451165464275654773516547703565476111654766";
for (let i = 0; i < sequence.length; i++) {
    const n = sequence[i];
    if (!(n in numbersToSequencePosition)) {
        numbersToSequencePosition[n] = new Set();
    }
    numbersToSequencePosition[n].add(i);
}

const programNumbers = program.split(',');
const queue = [{rangeStart: 2n**45n, rangeEnd: 2n**48n - 1n, programIndex: 15}];
let minVal = 2n**64n; // We know our value must be between [2n**45n and 2n**48n - 1)
while(queue.length > 0) {
    const {rangeStart, rangeEnd, programIndex} = queue.shift();
    if (programIndex === -1) {
        if (rangeStart < minVal) {
            minVal = rangeStart
        }
        continue;
    }

    const repetitionSize = 2n**(3n * BigInt(programIndex));
    const sequenceStart = repetitionSize;
    const newProgramIndex = programIndex - 1;
    const blockSize = BigInt(sequence.length) * repetitionSize;
    for(const position of numbersToSequencePosition[programNumbers[programIndex]]) {
        // We need to find the closest possible sequence to rangeStart. No need to floor - BigInt uses integer division.
        let currentSequenceStart = sequenceStart + blockSize * ((rangeStart - sequenceStart) / blockSize);
        while(currentSequenceStart <= rangeEnd) {
            const possibleRangeStart = currentSequenceStart + BigInt(position) * repetitionSize;
            const possibleRangeEnd = possibleRangeStart + repetitionSize - 1n;
            // We are trying to overlap two ranges (A and B). We can have:
            // - A entirely enclose B
            // - A partially enclose B from the left
            // - A partially enclose B from the right
            // - A not overlap with B
            // In all cases but the last, we continue BFS. To note, we should never see B entirely enclose A.
            
            if (possibleRangeStart >= rangeStart && possibleRangeEnd <= rangeEnd) {
                // Case 1.
                queue.push({
                    rangeStart: possibleRangeStart,
                    rangeEnd: possibleRangeEnd,
                    programIndex: newProgramIndex
                });
            } else if (possibleRangeStart < rangeStart && possibleRangeEnd >= rangeStart) {
                // Case 2.
                queue.push({
                    rangeStart,
                    rangeEnd: possibleRangeEnd,
                    programIndex: newProgramIndex,
                });
            } else if(possibleRangeStart <= rangeEnd && rangeEnd < possibleRangeEnd) {
                // Case 3.
                queue.push({
                    rangeStart: possibleRangeStart,
                    rangeEnd,
                    programIndex: newProgramIndex
                });
            }
            currentSequenceStart += blockSize;
        }
    }
}
console.log("Part 2:", minVal);