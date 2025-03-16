const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8');

function parseInput(input) {
    const [rules, str] = input.split('\n\n');
    const ruleMap = {};
    for (const rule of rules.split('\n')) {
        let [from, to] = rule.split(' => ');
        if (!(from in ruleMap)) {
            ruleMap[from] = new Set();
        }
        ruleMap[from].add(to);
    }
    return [ruleMap, str];
}

function part1(ruleMap, str) {
    const uniqueStrs = new Set();
    for (const [rule, transformations] of Object.entries(ruleMap)) {
        const matches = str.matchAll(rule);
        for (const match of matches) {
            const start = match.index;
            const end = start + rule.length;
            for (const transformation of transformations) {
                uniqueStrs.add(str.substring(0, start) + transformation + str.substring(end));
            }
        }
    }

    return uniqueStrs.size;
}

const [ruleMap, str] = parseInput(input);
console.log("Part 1:", part1(ruleMap, str));