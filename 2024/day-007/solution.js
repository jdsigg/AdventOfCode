const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function parseLine(line) {
    const [answer, rest] = line.split(":");
    return [
        BigInt(answer),
        rest.trim().split(" ").map(Number)
    ];
}

function canBeParsed(answer, inputs, recurseFn) {
    return dfs(answer, inputs, BigInt(0), 0, recurseFn);
}

function dfs(answer, inputs, curr, index, recurseFn) {
    // If the current result is larger then answer, we'll never get there.
    if (curr > answer) {
        return false;
    }

    if (index == inputs.length) {
        return curr == answer;
    }

    return recurseFn(answer, inputs, curr, index);
}

function solution(input, recurseFn) {
    return input
        .map(parseLine)
        .filter(([answer, inputs]) => canBeParsed(answer, inputs, recurseFn))
        .map(([answer, _]) => answer)
        .reduce((a, b) => a + b);
}

function part1(answer, inputs, curr, index) {
    return (
        dfs(answer, inputs, curr + BigInt(inputs[index]), index + 1, part1) ||
        dfs(answer, inputs, curr * BigInt(inputs[index]), index + 1, part1)
    );
}

function part2(answer, inputs, curr, index) {
    return (
        dfs(answer, inputs, curr + BigInt(inputs[index]), index + 1, part2) ||
        dfs(answer, inputs, curr * BigInt(inputs[index]), index + 1, part2) ||
        dfs(answer, inputs, BigInt(curr.toString() + inputs[index]), index + 1, part2)
    );
}

console.log("Part 1:", solution(input, part1));
console.log("Part 2:", solution(input, part2));