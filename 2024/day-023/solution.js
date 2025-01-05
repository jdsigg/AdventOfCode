const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function link(c1, c2, graph) {
    if (!(c1 in graph)) {
        graph[c1] = new Set();
    }
    graph[c1].add(c2);
}

function part1(graph) {
    let total = 0;
    const nodes = Object.keys(graph);
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            for (let k = j + 1; k < nodes.length; k++) {
                const node1 = nodes[i];
                const node2 = nodes[j];
                const node3 = nodes[k];

                if (
                    graph[node1].has(node2) && graph[node1].has(node3) &&
                    graph[node2].has(node1) && graph[node2].has(node3) &&
                    graph[node3].has(node2) && graph[node3].has(node1) &&
                    (node1.startsWith('t') || node2.startsWith('t') || node3.startsWith('t'))) {
                    total++;
                }
            }
        }
    }

    return total;
}

function part2(graph) {
    // https://en.wikipedia.org/wiki/Clique_problem
    let largestClique = [];
    const nodes = Object.keys(graph);
    for(let i = 0; i < nodes.length; i++) {
        let clique = [ nodes[i] ];
        for(let j = 0; j < nodes.length; j++) {
            let valid = true;
            if (j === i) {
                continue;
            }
            for(const node of clique) {
                if (!graph[node].has(nodes[j])) {
                    valid = false;
                    break;
                }
            }
            if (valid) {
                clique.push(nodes[j]);
            }
        }
        if (clique.length > largestClique.length) {
            largestClique = clique;
        }
    }
    largestClique.sort();
    return largestClique.join(',');
}


const graph = {};
for (const connection of input) {
    const [c1, c2] = connection.split('-');
    link(c1, c2, graph);
    link(c2, c1, graph);
}
console.log("Part 1:", part1(graph));
console.log("Part 2:", part2(graph));