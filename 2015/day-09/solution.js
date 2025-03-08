const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

function buildGraph(input) {
    const graph = {};
    const locations = new Set();
    for (const line of input) {
        const [source, to, dest, eq, distance] = line.trim().split(' ');
        if (!(source in graph)) {
            graph[source] = {};
        }
        if (!(dest in graph)) {
            graph[dest] = {};
        }
        graph[source][dest] = parseInt(distance);
        graph[dest][source] = parseInt(distance);
        locations.add(source);
        locations.add(dest);
    }
    return [graph, locations];
}

// The salesman travels... we need to try to visit every location from every point.
function solve(graph, locations, reducer, initialVal) {
    let result = initialVal;
    function getAllPaths(curr, seen, distance, currPath) {
        // If we are at a location, mark it so we never come back.
        if (seen.has(curr)) {
            return;
        }

        seen.add(curr);
        currPath.push(curr);

        // If we've seen everything...
        if (seen.size === locations.size) {
            result = reducer(result, distance);
        } else {
            for (const [neighbor, d] of Object.entries(graph[curr])) {
                getAllPaths(neighbor, seen, distance + d, currPath);
            }
        }
        currPath.pop();
        seen.delete(curr);
    }
    for (const location of locations) {
        getAllPaths(location, new Set(), 0, []);
    }
    return result;
}

const [graph, locations] = buildGraph(input);
console.log("Part 1:", solve(graph, locations, Math.min, Number.MAX_SAFE_INTEGER));
console.log("Part 2:", solve(graph, locations, Math.max, Number.MIN_SAFE_INTEGER));
