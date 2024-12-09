const fs = require('node:fs');
const [rules, pages] = fs.readFileSync('./input.txt', 'utf-8').split("\n\n").map(l => l.split("\n"));

function getPages(rules, pages, validity) {
    // Assume that every page can be followed by itself and every other page.
    const validMoves = {};
    const splitRules = rules.map(rule => rule.split("|"));
    for (const [n1, n2] of splitRules) {
        validMoves[n1] = new Set();
        validMoves[n2] = new Set();
    }
    for (const key of Object.keys(validMoves)) {
        const s = validMoves[key];
        Object.keys(validMoves).forEach(n => s.add(n));
    }

    // A rule n1|n2 means n1 must come before n2. Therefore, the following are also true:
    // 1. n2 must come after n1
    // 2. n2 cannot come before n1

    // Act on 2. and remove them from the valid move map.
    for (const [n1, n2] of splitRules) {
        validMoves[n2].delete(n1);
    }

    // Go over every page, checking each page number against its followers for desired validity.
    const result = [];
    for (const page of pages) {
        const pageNums = page.split(",");
        let isValid = true;
        for (let i = 0; i < pageNums.length; i++) {
            const curr = pageNums[i];
            const remaining = pageNums.slice(i + 1);
            if (!remaining.every(n => validMoves[curr].has(n))) {
                isValid = false;
            }
        }

        if (isValid == validity) {
            result.push(pageNums);
        }
    }

    return result;
}

function part1(rules, pages) {
    console.log("Part 1:",
        getPages(rules, pages, true)
            .map(page => Number(page[Math.floor(page.length / 2)]))
            .reduce((a, b) => a + b)
    );
}

function part2(rules, pages) {
    // I will assume that a page can have one valid ordering.
    // For a given page of length N, it must be true that:
    // 1. page[0] has N-1 explicitly defined rules ahead of it
    // 2. page[1] has N-2 explicitly defined rules ahead of it
    // ...

    // Use this to our advantage.
    // 1. Fetch all rules, but scope them to the current page.
    // 2. Map the page to itself and the number of rules it has.
    // 3. Sort by rule length and we have our correctly ordered page.
    const pageNumberToRules = {};
    const splitRules = rules.map(rule => rule.split("|"));
    for (const [n1, n2] of splitRules) {
        if (!pageNumberToRules[n1]) {
            pageNumberToRules[n1] = [];
        }
        pageNumberToRules[n1].push(n2)
    }

    console.log("Part 2:",
        getPages(rules, pages, false).map(page => {
            // We only want rules scoped to the current page.
            const pageNums = new Set();
            page.forEach(p => pageNums.add(p));

            return page
                .map(pageNum => [pageNum, (pageNumberToRules[pageNum] || []).filter(rule => pageNums.has(rule)).length])
                .sort((a, b) => a[1] - b[1])
                .map(pair => Number(pair[0]))[Math.floor(page.length / 2)];
        }).reduce((a, b) => a + b)
    );


}

part1(rules, pages);
part2(rules, pages);