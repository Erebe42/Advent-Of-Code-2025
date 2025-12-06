import {getLines} from "../utils/get-line";

enum Symbol {
  MULTIPLY = '*',
  ADD = '+'
}

type Operation = {
  numbers: number[];
  symbol: Symbol;
}

function getInputsStar1(filePath: string) {
  const lines = getLines(filePath);
  const numbersByLines = lines
    .slice(0, -1)
    .map(line => [...line.matchAll(/[0-9]+/g)].map(match => Number(match[0])));
  const operations: Operation[] = Array.from({length: numbersByLines[0].length}, () => ({numbers: [], symbol: Symbol.ADD}));
  for (const numbersByLine of numbersByLines) {
    for (let i = 0; i < numbersByLine.length; i++) {
      const operation = operations[i];
      operation.numbers.push(numbersByLine[i]);
    }
  }
  const symbols = [...lines.slice(-1)[0].matchAll(/[*+]/g)].map(match => match[0] as Symbol);
  for (let i = 0; i < symbols.length; i++) {
    const operation = operations[i];
    operation.symbol = symbols[i];
  }

  return operations;
}

function getInputsStar2(filePath: string) {
  const lines = getLines(filePath);
  const numbersByLines = lines.slice(0, -1);
  const symbolsLine = lines.slice(-1)[0];
  const lengthByOperation = [...symbolsLine.matchAll(/[+*]\s*/g)].map(match => match[0].length);
  const operations: Operation[] = [];
  let index = 0;
  for (const length of lengthByOperation) {
    const operation = {
      numbers: [],
      symbol: symbolsLine[index] as Symbol,
    };
    for (let j = 0; j < length; j++) {
      let number = 0;
      for (const numberLine of numbersByLines) {
        const digit = numberLine[index + j].match(/[0-9]/) ? Number(numberLine[index + j]) : undefined;
        if (digit === undefined) {
          continue;
        }
        number = number * 10 + digit;
      }
      if (number > 0) {
        operation.numbers.push(number);
      }
    }
    operations.push(operation);
    index += length;
  }
  return operations;
}

function calculateOperation(operation: Operation) {
  return operation.numbers.reduce((acc, number) => {
    switch (operation.symbol) {
      case Symbol.MULTIPLY:
        return acc * number;
      case Symbol.ADD:
        return acc + number;
    }
  }, operation.symbol === Symbol.ADD ? 0 : 1);
}

function star1(filePath: string) {
  const operations = getInputsStar1(filePath);
  const results = operations.map(calculateOperation);
  return results.reduce((acc, result) => acc + result, 0);
}

function star2(filePath: string) {
  const operations = getInputsStar2(filePath);
  const results = operations.map(calculateOperation);
  return results.reduce((acc, result) => acc + result, 0);
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
