/**
 * A class to represent a 2 dimensional coordinate (x, y).
 */

class Point {
    constructor(x, y) {
        this.x = Number(x);
        this.y = Number(y);
        // this.id = ''
    }

    // static withId(x, y, id) {
    // const p = new Point(x, y);
    // p.id = id;
    // return p;
    // }

    encode() {
        return `${this.x},${this.y}`;
    }

    static decode(p) {
        const [n1, n2] = p.split(',').map(Number);
        return new Point(n1, n2);
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

    static allNeighbors(point) {
        const [n, e, s, w] = Grid.neighbors(point);
        return [
            n,
            Grid.translate(n, "EAST"),
            e,
            Grid.translate(e, "SOUTH"),
            s,
            Grid.translate(s, "WEST"),
            w,
            Grid.translate(w, "NORTH")
        ];
    }

    static manhattanDistance(p1, p2) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    /** Create an array of points that are a fixed Manhattan distance from another point.
     * 
     * Include all distances from [1 - distance].
     */
    static getManhattanNeighbors(point, distance) {
        const neighbors = new Set();
        for (let i = 1; i <= distance; i++) {
            const north = point.add(new Point(-i, 0));
            const south = point.add(new Point(i, 0));
            const east = point.add(new Point(0, i));
            const west = point.add(new Point(0, -i));

            for (let j = 1; j <= i; j++) {
                // Walk the positive slope from south / west to east / north.
                neighbors.add(south.add(new Point(-j, j)).encode());
                neighbors.add(west.add(new Point(-j, j)).encode());
                // Walk the negative slope from north / west to east / south.
                neighbors.add(north.add(new Point(j, j)).encode());
                neighbors.add(west.add(new Point(j, j)).encode());
            }
            neighbors.add(north.encode());
            neighbors.add(south.encode());
            neighbors.add(east.encode());
            neighbors.add(west.encode());
        }

        return [...neighbors].map(Point.decode);
    }

    static translate(point, direction) {
        const [dX, dY] = Grid.DIRECTIONS[direction];
        return point.add(new Point(dX, dY));
    }

    // debt
    static isValid(point, grid) {
        return point.x > 0 && point.x < grid.length && point.y > 0 && point.y < grid[point.x].length
    }

    static isValidV2(point, grid) {
        return point.x >= 0 && point.x < grid.length && point.y >= 0 && point.y < grid[point.x].length
    }

    /**
     * Transpose an MxN array.
     * 
     * Transposition is swapping the each (i, j) coordinate to (j, i).
     * 
     * Examples:
     * [[1, 2, 3]]
     * becomes
     * [
     *  [1],
     *  [2],
     *  [3]
     * ]
     * 
     * [
     *  [1, 2],
     *  [3, 4]
     * ]
     * becomes
     * [
     *  [1, 3],
     *  [2, 4]
     * ]
     * 
     * Assumes that every row in the grid has the same number of elements.
     */
    static transposeMatrix(matrix) {
        if (!matrix || matrix.length === 0 || matrix[0].length === 0) {
            return [];
        }

        const numRows = matrix.length;
        const numCols = matrix[0].length;

        const transposedMatrix = Array(numCols).fill(null).map(() => Array(numRows).fill(null));

        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                transposedMatrix[j][i] = matrix[i][j];
            }
        }

        return transposedMatrix;
    }
}

module.exports = { Point, Grid };