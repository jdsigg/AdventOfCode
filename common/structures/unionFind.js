/**
 * A class for efficiently merging disjoint sets together.
 */
class UnionFind {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.size = Array(size).fill(1);
        this.count = size;
    }

    find(i) {
        while (i != this.parent[i]) {
            this.parent[i] = this.parent[this.parent[i]];
            i = this.parent[i];
        }
        return i;
    }

    merge(i, j) {
        const r1 = this.find(i);
        const r2 = this.find(j);

        if (r1 === r2) {
            // The nodes already share the same set.
            return;
        }

        if (this.size[r1] > this.size[r2]) {
            this.parent[r2] = this.parent[r1];
            this.size[r1] += this.size[r2];
        } else {
            this.parent[r1] = this.parent[r2];
            this.size[r2] += this.size[r1];
        }
        this.count--;
    }

}

module.exports = { UnionFind } 