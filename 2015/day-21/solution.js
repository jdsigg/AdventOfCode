const fs = require('node:fs');
// My boss input.
const BOSS_STATS = {
    hp: 109,
    damage: 8,
    armor: 2
};

function parseShop() {
    const shop = fs.readFileSync('./shop.txt', 'utf-8').split('\n\n');
    const items = {};
    // Weapons, Armor, Rings
    for (const category of shop) {
        const [header, ...categoryItems] = category.split('\n');
        const shopCategory = header.substring(0, header.indexOf(':'));
        const shopCategoryItems = {};
        for (const item of categoryItems) {
            const [name, ...rest] = item.trim().replace(/ +/g, ' ').split(' ');
            const [cost, damage, armor] = rest.map(Number);
            shopCategoryItems[name] = { cost, damage, armor };
        }
        items[shopCategory] = shopCategoryItems;
    }
    return items;
}

function part1(items) {
    const empty
    // You must choose a weapon.
    const weapons = Object.keys('Weapon');
    // You can optionally choose an armor.
    // You can optionally choose 0, 1, or 2 rings.

}

function part2(input) {

}

const items = parseShop();

console.log("Part 1:", part1(items));