import {getLines} from "../utils/get-line";

class Vector3 {
  constructor(public x: number, public y: number, public z: number) {}
  
  getDistanceWithVector(secondVector: Vector3) {
    return Math.sqrt((this.x - secondVector.x) ** 2 + (this.y - secondVector.y) ** 2 + (this.z - secondVector.z) ** 2);
  }
}

type LinkDistance = {
  distance: number;
  firstBoxIndex: number;
  secondBoxIndex: number;
}

function getInput(filePath: string) {
  const lines = getLines(filePath);
  return lines.map(line => {
    const [x, y, z] = line.split(',');
    return new Vector3(Number(x), Number(y), Number(z));
  });
}

function getCircuitsAndDistances(filePath: string): { boxes: Vector3[], allDistances: LinkDistance[], circuits: number[][] } {
  const boxes = getInput(filePath);
  const allDistances: LinkDistance[] = boxes
    .flatMap((box, index) => boxes.slice(index + 1)
      .map((otherBox, otherIndex) => ({
        distance: box.getDistanceWithVector(otherBox),
        firstBoxIndex: index,
        secondBoxIndex: otherIndex + index + 1,
      }))
    ).sort((a, b) => a.distance - b.distance);
  const circuits = boxes.map((_, index) => [index]);
  
  return { boxes, allDistances, circuits };
}

function star1(filePath: string, maxConnection: number): number {
  const { allDistances, circuits } = getCircuitsAndDistances(filePath);
  
  for (let connection = 0; connection < maxConnection; connection++) {
    const closestLinks = allDistances.shift();
    if (closestLinks === undefined) {
      break;
    }
    const { firstBoxIndex, secondBoxIndex } = closestLinks;
    const firstBoxCircuitIndex = circuits.findIndex(circuit => circuit.includes(firstBoxIndex));
    const secondBoxCircuitIndex = circuits.findIndex(circuit => circuit.includes(secondBoxIndex));
    if (firstBoxCircuitIndex !== secondBoxCircuitIndex) {
      const lowestCircuitIndex = Math.min(firstBoxCircuitIndex, secondBoxCircuitIndex);
      const highestCircuitIndex = Math.max(firstBoxCircuitIndex, secondBoxCircuitIndex);
      circuits[lowestCircuitIndex].push(...circuits[highestCircuitIndex]);
      circuits.splice(highestCircuitIndex, 1);
    }
  }

  return circuits
    .map(circuit => circuit.length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((acc, length) => acc * length, 1);
}

function star2(filePath: string) {
  const { boxes, allDistances, circuits } = getCircuitsAndDistances(filePath);
  let lastConnection = allDistances[0];

  while (circuits.length > 1) {
    const closestLinks = allDistances.shift();
    if (closestLinks === undefined) {
      break;
    }
    const { firstBoxIndex, secondBoxIndex } = closestLinks;
    const firstBoxCircuitIndex = circuits.findIndex(circuit => circuit.includes(firstBoxIndex));
    const secondBoxCircuitIndex = circuits.findIndex(circuit => circuit.includes(secondBoxIndex));
    if (firstBoxCircuitIndex !== secondBoxCircuitIndex) {
      const lowestCircuitIndex = Math.min(firstBoxCircuitIndex, secondBoxCircuitIndex);
      const highestCircuitIndex = Math.max(firstBoxCircuitIndex, secondBoxCircuitIndex);
      circuits[lowestCircuitIndex].push(...circuits[highestCircuitIndex]);
      circuits.splice(highestCircuitIndex, 1);
    }
    lastConnection = closestLinks;
  }
  return boxes[lastConnection.firstBoxIndex].x * boxes[lastConnection.secondBoxIndex].x;
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`, 10)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`, 1000)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
