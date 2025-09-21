const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').trim();
const { Point, Grid } = require('../../common/structures/point');

function getPoints(input) {
    return input.split('\n')
        .map(line => {
            const [x, y] = line.trim().split(', ').map(Number);
            return new Point(x, y);
        });
}

function part1(points) {
    const minX = Math.min(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxX = Math.max(...points.map(p => p.x));
    const maxY = Math.max(...points.map(p => p.y));


}

function part2(points) {

}

const points = getPoints(input);
console.log(points)
console.log("Part 1:", part1(points));
console.log("Part 2:", part2(points));
