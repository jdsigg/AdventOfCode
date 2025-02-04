const fs = require('node:fs');
const games = fs.readFileSync('./input.txt', 'utf-8').split("\n");

function part1(games) {
    const MY_CHOICE_TO_SCORE = Object.freeze({
        X: 1,
        Y: 2,
        Z: 3,
    });

    const OPPONENT_CHOICE_TO_OUTCOMES = Object.freeze({
        A: {
            X: 3,
            Y: 6,
            Z: 0,
        },
        B: {
            X: 0,
            Y: 3,
            Z: 6,
        },
        C: {
            X: 6,
            Y: 0,
            Z: 3,
        },
    });

    return games.reduce((acc, game) => {
        const [them, me] = game.split(' ');
        return acc + (OPPONENT_CHOICE_TO_OUTCOMES[them][me] + MY_CHOICE_TO_SCORE[me]);
    }, 0);
}

function part2(games) {
    const OUTCOMES = Object.freeze({
        X: 0,
        Y: 3,
        Z: 6,
    });

    const OPPONENT_CHOICE_TO_OUTCOMES = Object.freeze({
        A: {
            X: 3,
            Y: 1,
            Z: 2,
        },
        B: {
            X: 1,
            Y: 2,
            Z: 3,
        },
        C: {
            X: 2,
            Y: 3,
            Z: 1,
        },
    });

    return games.reduce((acc, game) => {
        const [them, me] = game.split(' ');
        return acc + (OPPONENT_CHOICE_TO_OUTCOMES[them][me] + OUTCOMES[me]);
    }, 0);
}

console.log("Part 1:", part1(games));
console.log("Part 2:", part2(games));
