const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').trim().split('\n');

const DATE_START_INDEX = 1;
const DATE_END_INDEX = 17;
function getDate(line) {
    const time = line.slice(DATE_START_INDEX, DATE_END_INDEX);
    const timeStr = time.split(' ').join('T') + ':00Z';
    // console.log(timeStr)
    return new Date(timeStr);
}

const EVENT_START_INDEX = 19;
function getEvent(line) {
    return line.slice(EVENT_START_INDEX);
}

function sortByDateAsc(lines) {
    return [...lines].sort((a, b) => getDate(a) - getDate(b));
}

function splitByShift(lines) {
    const sortedLines = sortByDateAsc(lines);
    const shifts = [];
    let currentShift = null;
    for (const line of sortedLines) {
        const event = getEvent(line);
        if (event.startsWith('Guard')) {
            // Start a new shift by ending the last one.
            if (currentShift != null) {
                shifts.push(currentShift);
            }
            currentShift = [line];
        } else {
            currentShift.push(line);
        }
    }
    // End the last shift.
    shifts.push(currentShift);
    return shifts;
}

function part1(shifts) {
    const guardByShiftSleepTime = {};
    for (const shift of shifts) {
        // [1518-07-05 23:57] Guard #2917 begins shift => 2917
        const guardId = parseInt(getEvent(shift[0]).split(' ')[1].slice(1));
        let totalTimeAsleep = 0;
        let startTimes = [];
        let sleepTime = null;
        for (let i = 1; i < shift.length; i++) {
            const event = getEvent(shift[i]);
            if (event === 'falls asleep') {
                sleepTime = getDate(shift[i]);
                continue;
            }
            // Must be wake up
            const difference = (getDate(shift[i]) - sleepTime) / 60000
            totalTimeAsleep += difference;
            const tempStart = new Date(sleepTime);
            // console.log(sleepTime);
            for (let i = 0; i < difference; i++) {
                // getUTCMinutes tells us the minutes literally on the date
                // console.log(difference, tempStart, tempStart.getUTCMinutes())
                startTimes.push(tempStart.getUTCMinutes());
                // Don't shift the date when moving it
                tempStart.setMinutes(tempStart.getMinutes() + 1);
            }
        }
        if (!(guardId in guardByShiftSleepTime)) {
            guardByShiftSleepTime[guardId] = {
                sleepTimes: [],
                timesAsleep: []
            };
        }
        guardByShiftSleepTime[guardId]['sleepTimes'].push(startTimes);
        guardByShiftSleepTime[guardId]['timesAsleep'].push(totalTimeAsleep);
    }

    // console.log(guardByShiftSleepTime);

    const maxSleeperId = Object.entries(guardByShiftSleepTime)
        .map(([key, value]) => [key, value['timesAsleep'].reduce((a, b) => a + b)])
        .sort((a, b) => b[1] - a[1])[0][0];

    // console.log(maxSleeperId, guardByShiftSleepTime[maxSleeperId]['sleepTimes']);

    const maxSleepMinutes = {};
    for (const minute of guardByShiftSleepTime[maxSleeperId]['sleepTimes'].flat()) {
        maxSleepMinutes[minute] = (maxSleepMinutes[minute] || 0) + 1
    }

    // console.log(maxSleepMinutes);
    // console.log(Object.entries(maxSleepMinutes).sort((a, b) => b[1] - a[1])[0][0]);

    return maxSleeperId * Object.entries(maxSleepMinutes).sort((a, b) => b[1] - a[1])[0][0];
}

function part2(shifts) {
    const guardByShiftSleepTime = {};
    for (const shift of shifts) {
        // [1518-07-05 23:57] Guard #2917 begins shift => 2917
        const guardId = parseInt(getEvent(shift[0]).split(' ')[1].slice(1));
        let totalTimeAsleep = 0;
        let startTimes = [];
        let sleepTime = null;
        for (let i = 1; i < shift.length; i++) {
            const event = getEvent(shift[i]);
            if (event === 'falls asleep') {
                sleepTime = getDate(shift[i]);
                continue;
            }
            // Must be wake up
            const difference = (getDate(shift[i]) - sleepTime) / 60000
            totalTimeAsleep += difference;
            const tempStart = new Date(sleepTime);
            // console.log(sleepTime);
            for (let i = 0; i < difference; i++) {
                // getUTCMinutes tells us the minutes literally on the date
                // console.log(difference, tempStart, tempStart.getUTCMinutes())
                startTimes.push(tempStart.getUTCMinutes());
                // Don't shift the date when moving it
                tempStart.setMinutes(tempStart.getMinutes() + 1);
            }
        }
        if (!(guardId in guardByShiftSleepTime)) {
            guardByShiftSleepTime[guardId] = {
                sleepTimes: [],
                timesAsleep: []
            };
        }
        guardByShiftSleepTime[guardId]['sleepTimes'].push(startTimes);
        guardByShiftSleepTime[guardId]['timesAsleep'].push(totalTimeAsleep);
    }

    let maxId = -1;
    let maxMinuteCount = -1;
    let maxMinute = -1;
    for(const [key, value] of Object.entries(guardByShiftSleepTime)) {
        // console.log(key, value)
        const minuteCountMap = {};
        const sleepTimes = value['sleepTimes'].flat();
        for(const minute of sleepTimes) {
            const next = (minuteCountMap[minute] || 0) + 1;
            if (next > maxMinuteCount) {
                maxMinuteCount = next;
                maxId = key;
                maxMinute = minute;
            }
            minuteCountMap[minute] = next;
        }
    }

    // console.log(maxId, maxMinuteCount);

    return maxId * maxMinute;
}

// Every guard always ends their shifts by waking up.
const shifts = splitByShift(input);
// for (const shift of shifts) {
    // console.log(shift);
// }
console.log("Part 1:", part1(shifts));
console.log("Part 2:", part2(shifts));
