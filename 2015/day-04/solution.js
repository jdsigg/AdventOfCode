const md5 = require('./md5').md5;
const SECRET_KEY = "ckczppom";

function part1() {
    let i = 0;
    while (true) {
        const hash = md5(SECRET_KEY + i);
        if (hash.startsWith('00000')) {
            return i;
        }
        i++;
    }
}

function part2() {
    let i = 0;
    while (true) {
        const hash = md5(SECRET_KEY + i);
        if (hash.startsWith('000000')) {
            return i;
        }
        i++;
    }
}

console.log("Part 1:", part1());
console.log("Part 2:", part2());