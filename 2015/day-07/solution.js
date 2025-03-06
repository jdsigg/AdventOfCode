const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n");

const OP_MAP = Object.freeze({
    AND: (a, b) => a & b,
    OR: (a, b) => a | b,
    LSHIFT: (a, b) => a << b,
    RSHIFT: (a, b) => a >> b,
    NOT: (_, b) => ~b,
    PASS: (_, b) => b
});

function tryToParseStringAsNumber(str) {
    const num = parseInt(str);
    return Number.isNaN(num) ? str : num;
}

function buildGraph(input) {
    const graph = {};
    for (const line of input) {
        const [left, right] = line.split(' -> ');
        const leftParts = left.split(' ');
        if (leftParts[0] === "NOT") {
            leftParts.unshift(null);
        } else if (leftParts.length == 1) {
            leftParts.unshift(null, "PASS");
        }
        const [lArg, op, rArg] = leftParts.map(tryToParseStringAsNumber);
        graph[right] = {lArg, op, rArg};
    }
    return graph;
}

function solve(graph) {
    const cache = {};
    function process(node) {
        if (node in cache) {
            return cache[node];
        }
        const { lArg, op, rArg } = graph[node];
        let left = lArg;        
        if (lArg !== null && !Number.isInteger(lArg)) {
            left = process(lArg)
        }

        let right = rArg;
        if (rArg !== null && !Number.isInteger(rArg)) {
            right = process(rArg);
        }

        // We're bounded to [0, 65535]
        const result = OP_MAP[op](left, right) % 65536;
        cache[node] = result;
        return result;
    }
    return process('a');
}

const graph = buildGraph(input);

const part1 = solve(graph);
graph['b'] = { lArg: null, op: "PASS", rArg: part1 };
const part2 = solve(graph);

console.log("Part 1:", part1);
console.log("Part 2:", part2);
