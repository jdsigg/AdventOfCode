const fs = require('node:fs');
const lines = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function isReportSafe(report) {
    // We check increasing / decreasing based on first two indices - bail if we can't do this.
    if (report[0] === report[1]) {
        return false;
    }

    const isIncreasing = report[0] < report[1];
    for (let i = 0; i < report.length - 1; i++) {
        const n1 = report[i];
        const n2 = report[i + 1];
        const difference = isIncreasing ? n2 - n1 : n1 - n2;

        if (difference < 1 || difference > 3) {
            return false;
        }
    }
    return true;
}

function solve(lines) {
    let numSafeP1 = 0;
    let numSafeP2 = 0;
    for (const line of lines) {
        const report = line.split(' ').map(Number);
        if (isReportSafe(report)) {
            numSafeP1++;
        }

        // Try to remove every index and see if the report becomes safe that way.
        const indices = report.map((_, i) => i);
        if(indices.some(index => isReportSafe(report.toSpliced(index, 1)))) {
            numSafeP2++;
        }
    }
    console.log("Part 1:", numSafeP1);
    console.log("Part 2:", numSafeP2);
}

solve(lines);