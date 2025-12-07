import {getLines} from "../utils/get-line";

function getInput(filePath: string) {
  return getLines(filePath).map(line => line.split(''));
}

function star1(filePath: string) {
  const input = getInput(filePath);
  const firstLine = input[0];
  const otherLines = input.slice(1);
  let beams = [firstLine.findIndex(v => v === 'S')];
  let countDivision = 0;
  for (const line of otherLines) {
    const newBeams = [];
    for (const beam of beams) {
      if (line[beam] === '^') {
        countDivision += 1;
        if (beam - 1 >= 0 && newBeams.includes(beam - 1) === false) {
          newBeams.push(beam - 1);
          line[beam - 1] = '|';
        }
        if (beam + 1 < line.length && newBeams.includes(beam + 1) === false) {
          newBeams.push(beam + 1);
          line[beam + 1] = '|';
        }
      } else {
        line[beam] = '|';
        if (newBeams.includes(beam) === false) {
          newBeams.push(beam);
        }
      }
    }
    beams = newBeams;
  }
  
  return countDivision;
}

function star2(filePath: string) {
  const input = getInput(filePath);
  const firstLine = input[0];
  const otherLines = input.slice(1);
  let beams = new Map<number, number>();
  beams.set(firstLine.findIndex(v => v === 'S'), 1);

  for (const line of otherLines) {
    const nextBeams = new Map<number, number>();
    for (const [beam, count] of beams.entries()) {
      if (line[beam] === '^') {
        if (beam - 1 >= 0) {
          nextBeams.set(beam - 1, (nextBeams.get(beam - 1) || 0) + count);
        }
        if (beam + 1 < line.length) {
          nextBeams.set(beam + 1, (nextBeams.get(beam + 1) || 0) + count);
        }
      } else {
        nextBeams.set(beam, (nextBeams.get(beam) || 0) + count);
      }
    }
    beams = nextBeams;
  }
  
  let maxCount = 0;
  for (const [, count] of beams) {
    maxCount += count; 
  }
  return maxCount;
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
