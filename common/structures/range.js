class Range {
    constructor(start, end, isBigInt) {
        this.isBigInt = isBigInt;
        this.start = isBigInt ? BigInt(start) : Number(start);
        this.end = isBigInt ? BigInt(end) : Number(end);
        // Enforce that start is before end.
        if (this.start > this.end) {
            throw new Error(`Range start can't be larger than range end: [${start}, ${end}]`)
        }
    }

    consumes(range) {
        if (this.isBigInt !== range.isBigInt) {
            throw new Error(`[consume] - Failed on ranges that aren't matching integer types: ${this}, ${range}`);
        }
        return this.start <= range.start && this.end >= range.end;
    }

    overlaps(range) {
        if (this.isBigInt !== range.isBigInt) {
            throw new Error(`[overlaps] - Failed on ranges that aren't matching integer types: ${this}, ${range}`);
        }
        return !(this.start > range.end || this.end < range.start);
    }

    /**
     * Merge two ranges together.
     * 
     * The result of a merge can take multiple forms - consider ranges [a, b] and [c, d].
     * 
     * Case 1 (complete consume): A range falls entirely within another.
     * [a=3,    b=10]
     *   [c=5, d=7]
     * 
     * Merge here returns [a, b]. This would still return [a, b] if c=3, and b=10.
     * This always returns 1 range.
     * 
     * Case 2 (no overlap): The ranges don't touch at all.
     * [a=3, b=10]
     *            [c=11, d=15]
     * or
     *            [a=11, b=15]
     * [c=3, b=10]
     * 
     * Merge "fails" here - just return the ranges back to the caller.
     * This implies that a return length of 2 represents a failed merge.
     * Callers can use that signal accordingly.
     * 
     * Case 3 (partial overlap): The two ranges partially overlap.
     * [a=3,     b=10]
     *      [c=7,     d=11]
     * or
     *      [a=10,    b=12]
     * [c=7,    d=11]
     * 
     * Merge will coalesce these two ranges together, resulting in a single range
     * ([a=3, d=11] or [c=7, b=12]).
     */
    static merge(r1, r2) {
        if (r1.isBigInt !== r2.isBigInt) {
            throw new Error(`[static merge] - Failed on ranges that aren't matching integer types: ${r1}, ${r2}`);
        }
        // Case 1
        if (r1.consumes(r2)) {
            return [r1];
        }
        if (r2.consumes(r1)) {
            return [r2];
        }
        // Case 2 - if r1 overlaps r2, we can assume that r2 overlaps r1. The inverse is true.
        if (!r1.overlaps(r2)) {
            return [r1, r2];
        }
        // Case 3 - We know that the ranges don't consume, but do overlap.
        // This means that the overlap between r2 and r1 is enough to determine the final range.
        if (r1.contains(r2.start)) {
            return [new Range(r1.start, r2.end, r1.isBigInt)];
        }
        return [new Range(r2.start, r1.end, r1.isBigInt)];
    }

    contains(v) {
        return this.start <= v && this.end >= v;
    }
}

module.exports = { Range };