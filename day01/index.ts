import { getLines } from "../utils/get-line";

const DIAL_STARTING_POSITION = 50;

function getNewDialPosition(oldDialPosition: number, direction: string, steps: number) {
  const newDialPosition = direction === 'R' ? oldDialPosition + steps : oldDialPosition - steps;
  return (newDialPosition + 100) % 100;
}

function star1(filePath: string) {
  const instructions = getLines(filePath);
  let dialPosition = DIAL_STARTING_POSITION;
  let countZeroPositions = 0;

  for (const instruction of instructions) {
    const direction = instruction.charAt(0);
    const steps = parseInt(instruction.slice(1), 10);
    dialPosition = getNewDialPosition(dialPosition, direction, steps);
    if (dialPosition === 0) {
      countZeroPositions += 1;
    }
  }

  return countZeroPositions;
}

function star2(filePath: string) {
  const instructions = getLines(filePath);
  let dialPosition = DIAL_STARTING_POSITION;
  let countZeroPositions = 0;

  for (const instruction of instructions) {
    const direction = instruction.charAt(0);
    const steps = parseInt(instruction.slice(1), 10);
    for (let i = 0; i < steps; i++) {
      dialPosition = direction === 'R' ? dialPosition + 1 : dialPosition - 1;
      dialPosition = (dialPosition + 100) % 100;
      if (dialPosition === 0) {
        countZeroPositions += 1;
      }
    }
  }

  return countZeroPositions;
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);

console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
