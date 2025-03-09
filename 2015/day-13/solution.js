const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

function permute(permutation) {
    let length = permutation.length;
    let result = [permutation.slice()];
    let c = new Array(length).fill(0);
    let i = 1;
    let k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

function parseRelationships(input, addMe) {
    const relationships = {};
    for (const line of input) {
        const parts = line.split(' ');
        const from = parts[0];
        const lose = parts[2] === "lose";
        const amount = parts[3];
        const to = parts[parts.length - 1].slice(0, -1);

        if (!(from in relationships)) {
            relationships[from] = {};
        }

        if (!(to in relationships)) {
            relationships[to] = {};
        }

        relationships[from][to] = parseInt(amount);
        if (lose) {
            relationships[from][to] *= -1;
        }
    }

    if (addMe) {
        const keys = Object.keys(relationships);
        relationships['Me'] = {};
        for (const key of keys) {
            relationships['Me'][key] = 0;
            relationships[key]['Me'] = 0;
        }
    }

    return relationships;
}

function solve(input, addMe) {
    const relationships = parseRelationships(input, addMe);
    const seatingArrangements = permute(Object.keys(relationships));
    let optimalArragement = 0;
    for (const arrangement of seatingArrangements) {
        const wrapped = [arrangement[arrangement.length - 1], ...arrangement, arrangement[0]];
        let total = 0;
        for (let i = 1; i < wrapped.length - 1; i++) {
            const seat = wrapped[i];
            const left = wrapped[i - 1];
            const right = wrapped[i + 1];
            total += relationships[seat][left];
            total += relationships[seat][right];
        }
        optimalArragement = Math.max(optimalArragement, total);
    }

    return optimalArragement;
}

console.log("Part 1:", solve(input, /* addMe= */ false));
console.log("Part 2:", solve(input, /* addMe= */ true));
