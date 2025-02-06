class Range {
    constructor(start, end) {
        // Enforce all ranges to be [min, max].
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        this.start = min;
        this.end = max;
    }

    consumes(range) {
        return this.start <= range.start && this.end >= range.end;
    }

    overlaps(range) {
        return !(this.start > range.end || this.end < range.start);
    }
}

module.exports = { Range };