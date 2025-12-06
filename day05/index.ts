import {getLines} from "../utils/get-line";

type Range = {
  start: number;
  end: number;
}

function getInputStar1(filePath: string) {
  const lines = getLines(filePath);
  const blankLinesSepartorIndex = lines.findIndex(line => line.length === 0);
  const ranges = lines.slice(0, blankLinesSepartorIndex).map(line => {
    const [start, end] = line.split('-').map(Number);
    return { start, end } as Range;
  });
  const ingredients = lines.slice(blankLinesSepartorIndex + 1).map(Number);

  return {
    ranges,
    ingredients
  };
}

function getInputStar2(filePath: string) {
  const lines = getLines(filePath);
  return lines.map(line => {
    const [start, end] = line.split('-').map(Number);
    return { start, end } as Range;
  });
}

function star1(filePath: string) {
  const { ranges, ingredients } = getInputStar1(filePath);

  const freshIngredients = ingredients
    .filter(ingredient => ranges.find(range => range.start <= ingredient && range.end >= ingredient));
  return freshIngredients.length
}

function star2(filePath: string) {
  const ranges = getInputStar2(filePath);
  const dedupeRanges = ranges
    .sort((a, b) => a.start - b.start)
    .reduce((acc: Range[], range) => {
      const indexForLowerStart = acc.findIndex((toCheck) => toCheck.end >= range.start && toCheck.start <= range.end);
      const indexForHigherEnd = acc.findIndex((toCheck) => toCheck.start >= range.end && toCheck.end <= range.start);
      if (indexForHigherEnd < 0 && indexForLowerStart < 0) {
        return [...acc, range];
      }
      if (indexForLowerStart === indexForHigherEnd) {
        acc[indexForLowerStart].end = Math.max(acc[indexForLowerStart].end, range.end);
        acc[indexForLowerStart].start = Math.min(acc[indexForLowerStart].start, range.start);
        return acc;
      }
      if (indexForHigherEnd >= 0 && indexForLowerStart >= 0) {
        const newRange = { start: Math.min(acc[indexForLowerStart].start, range.start), end: Math.max(acc[indexForHigherEnd].end, range.end) };
        const newArray = acc.filter((_, i) => i !== indexForLowerStart && i !== indexForHigherEnd);
        return [...newArray, newRange];
      }
      if (indexForHigherEnd >= 0) {
        acc[indexForHigherEnd].start = Math.min(acc[indexForLowerStart].start, range.start);
        acc[indexForHigherEnd].end = Math.max(acc[indexForHigherEnd].end, range.end);
        return acc;
      }
      if (indexForLowerStart >= 0) {
        acc[indexForLowerStart].start = Math.min(acc[indexForLowerStart].start, range.start);
        acc[indexForLowerStart].end = Math.max(acc[indexForLowerStart].end, range.end);
        return acc;
      }
      return acc;
    }, []);

  return dedupeRanges.reduce((acc, range) => acc + (range.end - range.start + 1), 0);
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`)
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
