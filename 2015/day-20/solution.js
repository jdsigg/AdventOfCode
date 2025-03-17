const FACTOR_CACHE = {};
function getFactors(n) {
    if (n in FACTOR_CACHE) {
        return FACTOR_CACHE[n];
    }
    const factors = new Set();
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            factors.add(i);
            factors.add(n / i);
        }
    }
    factors.add(1);
    factors.add(n);
    FACTOR_CACHE[n] = [...factors];
    return FACTOR_CACHE[n];
}

const GOAL = 34000000;
function solve(mult, filterFn) {
    let i = 1;
    while (true) {
        const numPresents = getFactors(i)
            .filter(x => filterFn(x, i))
            .map(x => x * mult)
            .reduce((a, b) => a + b);
        if (numPresents >= GOAL) {
            return i;
        }
        i++;
    }
}

console.log("Part 1:", solve(10, () => true));
console.log("Part 2:", solve(11, (x, i) => i / x <= 50));