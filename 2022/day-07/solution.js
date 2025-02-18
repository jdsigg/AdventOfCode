const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');


function buildDirectoryTree(input) {
    const tree = { name: '/', files: [] };
    let curr = tree;
    for (const line of input) {
        if (line === "$ cd /") {
            curr = tree;
            continue;
        }

        if (line === "$ cd ..") {
            curr = curr.parent;
            continue;
        }

        if (line === "$ ls") {
            // Do nothing - assume anything ls and a following system command is separated
            // by directory info (that which is generated via "ls").
            continue;
        }

        const [p1, p2, identifier] = line.split(" ");

        if (p1 === "$" && p2 === "cd") {
            curr = curr[identifier];
            continue;
        }


        if (p1 === "dir") {
            if (!(p2 in curr)) {
                // Create a directory if it does not exist
                // curr[p2] = { parent: curr, files: [] };
                curr[p2] = { parent: curr, name: p2, files: [] };
            }
            continue;
        }

        // By now, this must be a file. Store it's metadata in the current directory.
        curr.files.push({ name: p2, size: parseInt(p1) });
    }
    // console.log(tree);
    return tree;
}

function getDirectorySizes(directoryTree) {
    const RESERVED_DIRECTORY_KEYWORDS = new Set(["parent", "files", "name"]);
    const sizes = [];
    function traverse(node) {
        let dirSize = 0;
        for (const file of node.files) {
            dirSize += file.size;
        }

        for (const key of Object.keys(node)) {
            if (!RESERVED_DIRECTORY_KEYWORDS.has(key)) {
                dirSize += traverse(node[key]);
            }
        }
        sizes.push({ name: node.name, size: dirSize });
        return dirSize;
    }
    traverse(directoryTree);
    return sizes;
}

function part1(directorySizes) {
    return directorySizes.filter(({ size }) => size <= 100000).reduce((acc, { size }) => acc + size, 0);
}

function part2(directorySizes) {
    const FREE_SPACE = 70000000;
    const NEEDED_SPACE = 30000000;
    const usedSpace = directorySizes.filter(({ name }) => name === '/')[0].size;
    const spaceNeeded = NEEDED_SPACE - (FREE_SPACE - usedSpace);
    return directorySizes.filter(({ size }) => size >= spaceNeeded).sort((a, b) => a.size - b.size)[0].size;
}

const directorySizes = getDirectorySizes(buildDirectoryTree(input));
console.log("Part 1: " + part1(directorySizes));
console.log("Part 2: " + part2(directorySizes));