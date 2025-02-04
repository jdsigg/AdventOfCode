const fs = require('node:fs');
const rucksacks = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function weight(c) {
    if (c === c.toUpperCase()) {
        return c.charCodeAt(0) - 65 + 27;
    }
    return c.charCodeAt(0) - 96;
}

function toSet(arr) {
    const set = new Set();
    for (const s of arr) {
        set.add(s);
    }
    return set;
}

function part1(rucksacks) {
    let count = 0;
    for (const rucksack of rucksacks) {
        const rucksackLength = rucksack.length;
        const left = new Set();
        for(const c of rucksack.slice(0, rucksackLength / 2)) {
            left.add(c);
        }
        const match = [...rucksack.slice(rucksackLength / 2)].filter(c => left.has(c))[0];
        count += weight(match);
    }

    return count;
}

function part2(rucksacks) {
    let count = 0;
    for (let i = 0; i < rucksacks.length; i += 3) {
        const s = toSet(rucksacks[i]);
        const next = new Set();
        for (const c of rucksacks[i + 1]) {
            if (s.has(c)) {
                next.add(c);
            }
        }
        const final = new Set();
        for (const c of rucksacks[i + 2]) {
            if (next.has(c)) {
                final.add(c);
            }
        }
        count += weight([...final][0]);
    }
    return count;
}

console.log("Part 1: " + part1(rucksacks));
console.log("Part 2: " + part2(rucksacks));