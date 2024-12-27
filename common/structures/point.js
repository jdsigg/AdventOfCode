/**
 * A class to represent a 2 dimensional coordinate (x, y).
 */

class Point {
    constructor(x, y) {
        this.x = Number(x);
        this.y = Number(y);
    }

    encode() {
        return `${this.x},${this.y}`;
    }

    static decode(p) {
        return p.split(',').map(Number);
    }

    add(p) {
        return new Point(p.x + this.x, p.y + this.y);
    }
}

class Grid {
    static DIRECTIONS = Object.freeze({
        NORTH: [-1, 0],
        EAST: [0, 1],
        SOUTH: [1, 0],
        WEST: [0, -1],
    });

    static neighbors(point) {
        return [
            Grid.translate(point, "NORTH"),
            Grid.translate(point, "EAST"),
            Grid.translate(point, "SOUTH"),
            Grid.translate(point, "WEST")
        ]
    }

    static translate(point, direction) {
        const [dX, dY] = Grid.DIRECTIONS[direction];
        return point.add(new Point(dX, dY));         
    }
}

module.exports = { Point, Grid };