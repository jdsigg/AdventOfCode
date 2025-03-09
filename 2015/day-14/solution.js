const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n');

function parseInput(input) {
    const reindeers = {};
    for (const line of input) {
        const parts = line.split(' ');
        const reindeer = parts[0];
        const speed = parseInt(parts[3]);
        const travelTime = parseInt(parts[6]);
        const restTime = parseInt(parts[parts.length - 2]);
        reindeers[reindeer] = {
            speed,
            travelTime,
            restTime
        };
    }

    return reindeers;
}

function getDistance(reindeer, time) {
    const { speed, travelTime, restTime } = reindeer;
    const rangeSize = travelTime + restTime;
    const completeRanges = Math.floor(time / rangeSize);
    const remainingTime = time - (completeRanges * rangeSize);
    let maxTravel = travelTime;
    if (remainingTime <= maxTravel) {
        maxTravel = remainingTime;
    }

    return (completeRanges * speed * travelTime) + (speed * maxTravel);
}

const END_TIME = 2503;

function part1(reindeers) {
    let maxTravel = 0;
    for (const reindeer of Object.values(reindeers)) {
        maxTravel = Math.max(maxTravel, getDistance(reindeer, END_TIME));
    }

    return maxTravel;
}

function part2(reindeers) {
    const pointsByReindeer = {};
    for (const key of Object.keys(reindeers)) {
        pointsByReindeer[key] = 0;
    }

    for (let i = 1; i <= END_TIME; i++) {
        let maxDistance = 0;
        let maxReindeers = [];
        for (const [name, reindeer] of Object.entries(reindeers)) {
            const distance = getDistance(reindeer, i);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxReindeers = [name]
            } else if (distance === maxDistance) {
                maxReindeers.push(name);
            }
        }
        for (const name of maxReindeers) {
            pointsByReindeer[name]++;
        }
    }

    return Math.max(...Object.values(pointsByReindeer));
}

const reindeers = parseInput(input);
console.log("Part 1:", part1(reindeers));
console.log("Part 2:", part2(reindeers));