import {getLines} from "../utils/get-line";

class Machine {
  constructor(
    public readonly lightsMask: number,
    public readonly buttonMasks: number[],
    public readonly joltageButtons: number[],
    public readonly joltageRequirements: number
  ) {
  }

  findMinimalButtonCountToPressToMatchLightsPattern(): number {
    const visitedLights = new Set<number>();
    const queue = this.buttonMasks
      .map((_, index) => ({
        index,
        count: 0,
        lightsMask: 0,
      }))
    let lastTest: {
      index: number,
      count: number,
      lightsMask: number,
    } = null;
    
    while (lastTest === null || lastTest.lightsMask !== this.lightsMask) {
      const test = queue.shift();
      test.lightsMask = test.lightsMask ^ this.buttonMasks[test.index];
      test.count += 1;
      if (!visitedLights.has(test.lightsMask)) {
        queue.push(...this.buttonMasks.map((_, index) => ({
          ...test,
          index,
        })).filter((_, index) => index !== test.index));
      }
      visitedLights.add(test.lightsMask);
      lastTest = test;
    }
    
    return lastTest.count;
  }

  findMinimalButtonCountToPressToMatchJoltage(): number {
    const dp = Array.from({ length: this.joltageRequirements + 1 }, () => Number.POSITIVE_INFINITY);
    dp[0] = 0;
    for (let i = 1; i < this.joltageRequirements; i++) {
      for (const button of this.joltageButtons) {
        if (button <= i && Number.isFinite(dp[i - button])) {
          const candidate = dp[i - button] + 1;
          if (candidate < dp[i]) {
            dp[i] = candidate;
          }
        }
      }
    }
    if (!Number.isFinite(dp[this.joltageRequirements])) {
      return 0;
    }
    return dp[this.joltageRequirements];
  }
}

function getInput(filePath: string): Machine[] {
  return getLines(filePath).map(line => {
    const information = line.split(' ');
    const length = information[0].split('').slice(1, -1).length;
    const lightsMask = information[0]
      .split('')
      .slice(1, -1)
      .map(v => v === '#' ? 1 : 0)
      .reduce((mask, value, index) => mask | (value << index), 0);
    const buttonMasks = information
      .slice(1, -1)
      .map(
        v => v
          .slice(1, -1)
          .split(',')
          .map(Number)
          .reduce((mask, value) => mask | (1 << value), 0)
      );
    const joltageButtons =
      information
      .slice(1, -1)
      .map(v =>
        Number(
          v.slice(1, -1)
            .split(',')
            .map(Number)
            .reduce((acc, value) => {
              acc[value] = 1
              return acc;
            }, Array(length).fill(0))
            .join('')
        )
      );
    const joltageRequirements = information
      .slice(-1)[0]
      .slice(1, -1)
      .split(',')
      .map(Number)
      .reduce((acc, current) => acc * 10 + current, 0);
    return new Machine(lightsMask, buttonMasks, joltageButtons, joltageRequirements);
  })
}

function star1(filePath: string) {
  const machines = getInput(filePath);
  const inputNeeded: number[] = machines.map((machine) => {
    return machine.findMinimalButtonCountToPressToMatchLightsPattern();
  });
  return inputNeeded.reduce((acc, current) => acc + current, 0);
}
function star2(filePath: string) {
  const machines = getInput(filePath);
  const inputNeeded: number[] = machines.map((machine, index) => {
    console.log(`Machine ${index + 1} / ${machines.length}`);
    return machine.findMinimalButtonCountToPressToMatchJoltage();
  });
  return inputNeeded.reduce((acc, current) => acc + current, 0);
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
