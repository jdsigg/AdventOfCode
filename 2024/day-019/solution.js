const fs = require('node:fs');

const [i1, i2] = fs.readFileSync('./input.txt', 'utf-8').split("\n\n");
const patterns = i1.split(', ');
const designs = i2.split('\n');

// A prefix trie to keep track of each pattern.
const patternTrie = {};
for (const pattern of patterns) {
    let curr = patternTrie;
    for (const l of pattern) {
        if (!(l in curr)) {
            curr[l] = {};
        }
        curr = curr[l];
    }
    // '*' means the end of a pattern.
    curr['*'] = {};
}

/**
 * Walk a design and determine if it can be made.
 * 
 * This can be expensive, keep track of failed attempts in a cache
 * to avoid potential reprocessing. We only care about the first
 * successful design we make.
 */
function matches(design, index, patternTrie, cache) {
    // We've reached the end of a design successfully.
    if (index === design.length) {
        return true;
    }

    if (cache.has(index)) {
        return false;
    }

    let curr = patternTrie;
    let i = index;
    // While we can continue to walk the trie.
    while (design[i] in curr) {
        if ('*' in curr[design[i]]) {
            // This is a possible pattern. Keep recursing.
            if (matches(design, i + 1, patternTrie, cache)) {
                // If we reached the end, the design is makeable.
                return true;
            }
        }
        // Keep going down the trie.
        curr = curr[design[i++]];
    }

    // We didn't make the correct pattern.
    cache.add(index);
    return false;
}

/**
 * Similar to part 1, but keep track of the number of designs that
 * can be made from each index.
 * 
 * Return prematurely if we've already made a design from dp[index].
 */
function matchesv2(design, index, patternTrie, dp) {
    // We've reached the end of a design successfully.
    if (index === design.length) {
        return 1;
    }

    if (index in dp) {
        return dp[index];
    }

    let curr = patternTrie;
    let i = index;
    let numValidAtIndex = 0;
    // While we can continue to walk the trie.
    while(design[i] in curr) {
        if ('*' in curr[design[i]]) {
            // This is a possible pattern. Keep recursing.
            const res = matchesv2(design, i + 1, patternTrie, dp);
            // Now, we don't care if it is valid or not at index. Just keep track of
            // how many designs we can make from here.
            numValidAtIndex += res;
        }
        // Keep going down the trie.
        curr = curr[design[i++]];
    }
    dp[index] = numValidAtIndex;
    return numValidAtIndex;
}

function part1(designs, patternTrie) {
    return designs.filter(design => matches(design, 0, patternTrie, new Set())).length;
}

function part2(designs, patternTrie) {
    return designs.map(design => matchesv2(design, 0, patternTrie, {})).reduce((a, b) => a + b);
}

console.log("Part 1:", part1(designs, patternTrie));
console.log("Part 2:", part2(designs, patternTrie));