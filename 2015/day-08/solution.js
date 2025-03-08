const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split("\n").map(x => x.trim());

function buildTrie() {
    const escapeSeqs = ['\\\\', '\\\"'];
    const hex = '0123456789abcdef'.split('');
    for (const l1 of hex) {
        for (const l2 of hex) {
            escapeSeqs.push('\\' + 'x' + l1 + l2);
        }
    }
    const trie = {};
    for (const seq of escapeSeqs) {
        let curr = trie;
        for (const l of seq) {
            if (!(l in curr)) {
                curr[l] = {};
            }
            curr = curr[l];
        }
        curr['*'] = {};
    }
    return trie;
}

function dataLength(str, trie) {
    let strDataLen = 0;
    // Try to walk the trie - if we get to a valid escape character, add 1 to string data.
    // If we fail, add the length of the current string to string data.
    let currStr = '';
    let currTri = trie;
    for (const letter of str.substring(1, str.length - 1)) {
        currStr += letter;
        if (letter in currTri) {
            currTri = currTri[letter];
            // If this is terminal, end it and add 1.
            if ('*' in currTri) {
                strDataLen++;
                currStr = '';
                currTri = trie;
            }
            // Otherwise, keep going.
        } else {
            strDataLen += currStr.length;
            currStr = '';
            currTri = trie;
        }
    }
    // Repeat check for edge case when we end trie traversal at string's end.
    if ('*' in currTri) {
        strDataLen++;
    } else {
        strDataLen += currStr.length;
    }

    return strDataLen;
}

function expand(str) {
    let newStr = '';
    for (const letter of str) {
        if (letter === "\"" || letter === '\\') {
            newStr += '\\'
        }
        newStr += letter;
    }
    return "\"" + newStr + "\"";
}

function solve(arr, trie) {
    return arr.map(x => x.length - dataLength(x, trie)).reduce((a, b) => a + b);
}

const trie = buildTrie();
console.log("Part 1:", solve(input, trie));
console.log("Part 2:", solve(input.map(expand), trie));