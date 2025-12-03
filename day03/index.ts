import {getLines} from "../utils/get-line";

function readInput(filePath: string): number[][] {
  const lines = getLines(filePath);
  return lines.map(line => line.split('').map(Number));
}

function star1(filePath: string) {
  const banks = readInput(filePath);
  let sum = 0;

  for (const bank of banks) {
    let maxVolatage = 0;
    for (let i = 0; i < bank.length - 1; i++) {
      for (let j = i + 1; j < bank.length; j++) {
        const currentVoltage = bank[i] * 10 + bank[j];
        if (currentVoltage > maxVolatage) {
          maxVolatage = currentVoltage;
        }
      }
    }
    sum += maxVolatage;
  }

  return sum;
}

function star2(filePath: string): number {
  const banks = readInput(filePath);
  let sum = 0;

  for (const bank of banks) {
    let bankMaxVoltage = 0;
    let leftBatteries = [...bank];
    for (let leftBatteriesCount = 11; leftBatteriesCount >= 0; leftBatteriesCount--) {
      const range = leftBatteries.length - leftBatteriesCount;
      const maxVoltageInRange = Math.max(...leftBatteries.slice(0, range))
      bankMaxVoltage = bankMaxVoltage * 10 + maxVoltageInRange;
      const maxVoltageInRangeIndex = leftBatteries.findIndex(v => v === maxVoltageInRange);
      leftBatteries = leftBatteries.slice(maxVoltageInRangeIndex + 1);
    }
    sum += bankMaxVoltage;
  }

  return sum;
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
