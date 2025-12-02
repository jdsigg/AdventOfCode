const fs = require('node:fs');
const input = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(',')
  .map(range => range.split('-').map(BigInt));

// Our sample size is relatively small. The sum of the size of each of my ranges is 2245793n.
// For P1, I have to iterate over each number in each range once.
// For P2, I have to iterate over each chunk array of each number once.
// Both are brute forceable given my input sizes.

/**
 * Divide a string into smaller strings, each of the specified size.
 * 
 * If the size is larger than the provided string, the expected return value is an array containing the original string.
 */
function chunk(str, size) {
  const chunks = [];
  let curr = "";
  for (let i = 0; i < str.length; i++) {
    if (curr.length === size) {
      chunks.push(curr);
      curr = str[i];
      continue;
    }
    curr += str[i];
  }
  if (curr !== "") {
    chunks.push(curr);
  }
  return chunks;
}

function part1(input) {
  // Set allows me to ignore potentially overlapping ranges.
  let invalid = new Set();
  for (const [n1, n2] of input) {
    for (let i = n1; i <= n2; i++) {
      const str = i.toString();
      // Length 1 IDs are special and can't be invalid.
      if (str.length === 1) {
        continue;
      }
      const set = new Set(chunk(str, Math.ceil(str.length / 2)));
      if (set.size === 1) {
        invalid.add(i);
      }
    }
  }
  return [...invalid].reduce((a, b) => a + b);
}

function isInvalid(bigInt) {
  // We need to chunk the string bigInt.length / 2 times.
  // For a chunk size i, the chunk operaiton breaks the bigInt into ceil(bigInt.length / i) chunks. Each chunk is at most of size i.
  // If the distinct set of chunks has size 1, the ID is invalid.
  const str = bigInt.toString();
  for (let i = 1; i <= str.length / 2; i++) {
    const set = new Set(chunk(str, i));
    if (set.size === 1) {
      return true;
    }
  }
  return false;
}

function part2(input) {
  // Set allows me to ignore potentially overlapping ranges.
  let invalid = new Set();
  for (const [n1, n2] of input) {
    for (let i = n1; i <= n2; i++) {
      if (isInvalid(i)) {
        invalid.add(i);
      }
    }
  }
  return [...invalid].reduce((a, b) => a + b);
}

console.log("Part 1:", part1(input));
console.log("Part 2:", part2(input));