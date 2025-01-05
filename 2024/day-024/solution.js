const fs = require('node:fs');
const [initialState, network] = fs.readFileSync('./input.txt', 'utf-8').split("\n\n");

const LOGICAL_OPS = Object.freeze({
    AND: (x, y) => x & y,
    OR: (x, y) => x | y,
    XOR: (x, y) => x ^ y
});

/**
 * In my input, we have a deeply nested graph of dependencies. z00 is the least nested,
 * z45 is the most (see output.svg).
 * 
 * DFS with a cache to capture calculations at each point in the graph.
 * 
 * At the end, we'll be able to stitch together our 46-bit number as z45 down to z00.
 */

function dfs(node, graph, state) {
    if (node in state) {
        return state[node];
    }

    const left = dfs(graph[node].left, graph, state);
    const right = dfs(graph[node].right, graph, state);
    const value = LOGICAL_OPS[graph[node].op](left, right);

    state[node] = value;
    return value;
}

function part1(initialState, network) {
    const state = {};
    const graph = {};
    const zNodes = [];

    // First, populate state with what we know.
    for(const [node, value] of initialState.split("\n").map(s => s.split(': '))) {
        state[node] = Number(value);
    }

    // Next, create the graph of connections. Connect downward (i.e. right to left)
    for(const [l, r] of network.split("\n").map(line => line.split(' -> '))) {
        const [s1, op, s2] = l.split(' ');
        graph[r] = {
            left: s1,
            right: s2,
            op
        };
        if (r[0] === 'z') {
            zNodes.push(r);
        }
    }
    // Since 'z00' is less nested than 'z01' is less nested than 'z02' ... 'z45'.
    zNodes.sort();

    for(const zNode of zNodes) {
        dfs(zNode, graph, state);
    }
    return parseInt(zNodes.map(node => state[node]).reverse().join(''), 2);
}

console.log("Part 1:", part1(initialState, network));