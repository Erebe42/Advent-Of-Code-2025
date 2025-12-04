import {getLines} from "../utils/get-line";

const PAPER_CELL = '@';
const MOVED_CELL = 'x';

function getMapFromInput(filePath: string): string[][] {
  return getLines(filePath).map(line => line.split(''));
}

function countAdjacentPaperCells(map: string[][], x: number, y: number): number {
  let count = 0;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i === x && j === y) {
        continue;
      }
      if (map[j]?.[i] === PAPER_CELL) {
        count += 1;
      }
    }
  }
  return count;
}

function star1(filePath: string): number {
  const map = getMapFromInput(filePath);
  const [, count] = movePapers(map);

  return count;
}

function movePapers(map: string[][]): [string[][], number] {
  let count = 0;
  const newMap = map.map((line, y) => line.map((cell, x) => {
    if (cell === PAPER_CELL && countAdjacentPaperCells(map, x, y) < 4) {
      count += 1;
      return MOVED_CELL;
    }
    return cell;
  }));
  return [newMap, count];
}

function star2(filePath: string) {
  let map = getMapFromInput(filePath);
  let count = 0;
  let oldCount = 0;

  do {
    const [newMap, newCount] = movePapers(map);
    map = newMap;
    oldCount = newCount;
    count += newCount;
  } while (oldCount > 0)

  return count;
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`)
