import {getLines} from "../utils/get-line";

type Range = {
  start: number,
  end: number
}

function readInput(filePath: string): Range[] {
  const lines = getLines(filePath);
  return lines[0]
    .split(',')
    .map(range => range.split('-').map(Number))
    .map(([start, end]) => ({start, end}));
}

function star1(filePath: string) {
  const ranges = readInput(filePath);
  let sum = 0;

  for (const range of ranges) {
    const {start, end} = range;
    for (let number = start; number <= end; number++) {
      const stringifyNumber = number.toString();
      const isEvenLength = stringifyNumber.length % 2 === 0;
      const leftPart = stringifyNumber.slice(0, stringifyNumber.length / 2);
      const rightPart = stringifyNumber.slice(stringifyNumber.length / 2);
      if (isEvenLength && leftPart === rightPart) {
        sum += number;
      }
    }
  }

  return sum;
}

function hasRepeatedPattern(input: string) {
  for (let i = 0; i < input.length / 2; i++) {
    const patternToFind = input.slice(0, i + 1);
    const patternLength = patternToFind.length;
    if (input.length % patternLength === 0) {
      const regex = new RegExp(`.{1,${patternLength}}`, 'g');
      const parts = input.match(regex)
      const hasRepeatedPatternAllAlong = parts.every(part => part === patternToFind);
      if (hasRepeatedPatternAllAlong && parts.length > 1) {
        return true;
      }
    }
  }
  return false;
}

function star2(filePath: string) {
  const ranges = readInput(filePath);
  let sum = 0;

  for (const range of ranges) {
    for (let number = range.start; number <= range.end; number++) {
      const stringifyNumber = number.toString();
      if (hasRepeatedPattern(stringifyNumber)) {
        sum += number;
      }
    }
  }

  return sum;
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
