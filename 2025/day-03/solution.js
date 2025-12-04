const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map(line => line.split('').map(Number));

function solve(input, joltageLength) {
    // Assume we have a bank like "12345"
    // If we have to find the best joltage subsequence by picking 5 numbers from the bank, we have no choice - it's "12345"
    // Consider adding a 6th number to the start of the bank - "[6]12345"
    // Now, to pick the best rating, we have to ask ourselves what's better, 6 or 1?
    // More generally, if at worst I'm stuck with the last M digits, what do I pick from it's leading prefix to best satisfy that condition?
    // The "best" === the earliest instance of the largest number
    //   - Why earlier... e.g. picking the second 9 before the first 9 in prefix "91239" prevents us from picking both 9's.
    // In this case, M = 4, and I have 6 and 1 to choose from. 6 is better.
    // Repeat the question, if I'm at worst stuck with the last 3 digits, what's better, 1 or 2? We start at 1 because we last chose 6. 2 is better.
    // Repeat the question, if I'm at worst stuck with the last 2 digits, what's better, 3? We only have one choice.
    // Continuing this process, we finish with 4 and 5, resulting in our largest joltage of 62345.

    // This greedy alg performs the worst when a bank descends (9876...) b/c and index can be searched multiple times across prefix searches.
    // Banks are 100 characters long, so repeated iteration over prefixes is manageable.

    let totalJoltage = 0n;
    for (const bank of input) {
        const joltage = [];
        let suffixLength = joltageLength - 1;
        let lastIndex = 0;
        while (joltage.length < joltageLength) {
            const prefix = bank.slice(lastIndex, bank.length - suffixLength);
            let max = -1;
            let maxIndex = -1;
            for (let i = 0; i < prefix.length; i++) {
                const curr = prefix[i];
                if (curr > max) {
                    max = curr;
                    maxIndex = i + lastIndex;
                }
            }
            joltage.push(max);
            suffixLength--;
            // Shift the prefix selection forward - we are constantly appending the leftmost digit.
            lastIndex = maxIndex + 1;
        }
        totalJoltage += BigInt(joltage.join(''));
    }

    return totalJoltage.toString();
}

console.log("Part 1:", solve(input, 2));
console.log("Part 2:", solve(input, 12));