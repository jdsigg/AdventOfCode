/**
 * A Min-Heap implementation.
 * 
 * Objects in this heap are compard by their "weight" property.
 */
class MinHeap {
    constructor() {
        this.arr = [];
    }

    size() {
        return this.arr.length;
    }

    /** Adds an element to the heap. */
    add(k) {
        const arr = this.arr;
        arr.push(k);

        // Fix the min heap property if it is violated
        let i = arr.length - 1;
        while (i > 0 && arr[this._parent(i)].weight > arr[i].weight) {
            const p = this._parent(i);
            [arr[i], arr[p]] = [arr[p], arr[i]];
            i = p;
        }
    }

    /** Removes the minimum value from the heap. */
    pop() {
        const arr = this.arr;
        if (arr.length == 1) {
            return arr.pop();
        }

        let res = arr[0];
        arr[0] = arr[arr.length - 1];
        arr.pop();
        this._heapify(0);
        return res;
    }

    /** Recursively heapify subtrees in the heap. */
    _heapify(i) {
        const arr = this.arr;
        const n = arr.length;
        if (n === 1) {
            return;
        }
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let smallest = i;
        if (l < n && arr[l].weight < arr[i].weight) {
            smallest = l;
        }
        if (r < n && arr[r].weight < arr[smallest].weight) {
            smallest = r;
        }
        if (smallest !== i) {
            [arr[i], arr[smallest]] = [arr[smallest], arr[i]]
            this._heapify(smallest);
        }
    }

    _parent(i) {
        return Math.floor((i - 1) / 2);
    }
}

module.exports = { MinHeap };
