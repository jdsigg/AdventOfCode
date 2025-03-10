const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

// All ways to divide 100 calories into 4 buckets.
function permutations() {
    const result = [];
    for (let i = 0; i <= 100; i++) {
        for (let j = 0; j <= 100; j++) {
            for (let k = 0; k <= 100; k++) {
                for (let l = 0; l <= 100; l++) {
                    if (i + j + k + l === 100) {
                        result.push([i, j, k, l])
                    }
                }
            }
        }
    }

    return result;
}

function parseIngredient(ing) {
    return parseInt(ing.split(' ')[1]);
}

function readIngredients(input) {
    const ingredients = {};
    for (const line of input) {
        const [ingredient, ...rest] = line.replace(':', ',').split(', ');
        const [capacity, durability, flavor, texture, calories] = rest.map(parseIngredient);
        ingredients[ingredient] = {
            capacity,
            durability,
            flavor,
            texture,
            calories
        };
    }

    return ingredients;
}

function update(obj, value) {
    for (const key of Object.keys(obj)) {
        obj[key] = Math.round(value * obj[key]);
    }
}

function getSum(key, obj) {
    let total = 0;
    for (const value of Object.values(obj)) {
        total += value[key];
    }

    return total <= 0 ? 0 : total;
}

function solve(ingredients, perms, limitCalsTo500) {
    let maxScore = 0;
    for (const [sprinkles, pb, frosting, sugar] of perms) {
        const ingrCopy = JSON.parse(JSON.stringify(ingredients));
        update(ingrCopy["Sprinkles"], sprinkles);
        update(ingrCopy["PeanutButter"], pb);
        update(ingrCopy["Frosting"], frosting);
        update(ingrCopy["Sugar"], sugar);
        let total = 1;
        total *= getSum("capacity", ingrCopy);
        total *= getSum("durability", ingrCopy);
        total *= getSum("flavor", ingrCopy);
        total *= getSum("texture", ingrCopy);
        if (total <= 0 || (limitCalsTo500 && getSum("calories", ingrCopy) !== 500)) {
            total = 0;
        }
        maxScore = Math.max(maxScore, total);
    }

    return maxScore;
}

const ingredients = readIngredients(input);
const perms = permutations();
console.log("Part 1:", solve(ingredients, perms, /* limitCalsTo500 */ false));
console.log("Part 2:", solve(ingredients, perms, /* limitCalsTo500 */ true));