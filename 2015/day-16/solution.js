const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

function parseInput(input) {
    const aunts = {};
    for (const line of input) {
        const sueCutoff = line.indexOf(':');
        const sue = line.substring(0, sueCutoff).split(' ')[1];
        const sueMemory = line.substring(sueCutoff + 1).trim();
        aunts[sue] = JSON.parse('{' + sueMemory.replaceAll(/[a-zA-Z]+/g, x => `"${x}"`) + '}');
    }

    return aunts;
}

const TICKER_TAPE = Object.freeze({
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1
});

function p1([_, v]) {
    return Object.entries(v).every(([ak, av]) => TICKER_TAPE[ak] === av);
}

function p2([_, v]) {
    for (const [tk, tv] of Object.entries(TICKER_TAPE)) {
        if (!(tk in v)) {
            continue;
        }
        switch (tk) {
            case "cats":
            case "trees":
                // Cats and trees are greater than
                if (v[tk] <= tv) {
                    return false;
                }
                break;
            case "pomeranians":
            case "goldfish":
                // Pomeranians and goldfish are less than
                if (v[tk] >= tv) {
                    return false;
                }
                break;
            default:
                // Same check as last time
                if (v[tk] !== tv) {
                    return false;
                }
        }
    }
    return true;
}

function solve(aunts, filterFn) {
    return Object.entries(aunts)
        .filter(filterFn)
        .map(([k, _]) => k)[0];
}

const aunts = parseInput(input);
console.log("Part 1:", solve(aunts, p1));
console.log("Part 2:", solve(aunts, p2));
