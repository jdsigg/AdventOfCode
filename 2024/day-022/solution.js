const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(BigInt);

function part1(input) {
    let total = 0n;
    for (const n of input) {
        let curr = n;
        for (let i = 0; i < 2000; i++) {
            curr = (curr ^ (curr * 64n)) % 16777216n;
            curr = (curr ^ (curr / 32n)) % 16777216n;
            curr = (curr ^ (curr * 2048n)) % 16777216n;
        }
        total += curr;
    }
    return total
}

function part2(input) {
    const sequenceToPrice = {};
    for (const n of input) {
        let curr = n;
        let lastPrice = curr % 10n;
        const differences = [];
        const seen = new Set();
        for (let i = 0; i < 2000; i++) {
            curr = (curr ^ (curr * 64n)) % 16777216n;
            curr = (curr ^ (curr / 32n)) % 16777216n;
            curr = (curr ^ (curr * 2048n)) % 16777216n;
            const currPrice = curr % 10n
            differences.push(currPrice - lastPrice);
            lastPrice = currPrice;
            if (i >= 3) {
                const sequence = differences.slice(i - 3, i + 1).join(',');
                if (seen.has(sequence)) {
                    continue;
                }
                seen.add(sequence);

                if (!(sequence in sequenceToPrice)) {
                    sequenceToPrice[sequence] = []
                }
                sequenceToPrice[sequence].push(currPrice);
            }
        }
    }

    return Math.max(...Object.values(sequenceToPrice).map(prices => Number(prices.reduce((a, b) => a + b))));
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));