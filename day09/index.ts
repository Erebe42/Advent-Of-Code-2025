import {getLines} from "../utils/get-line";

type Vector2 = {
  x: number;
  y: number;
}

class Line {
  isHorizontal: boolean;
  isVertical: boolean;

  constructor(public start: Vector2, public end: Vector2) {
    this.isHorizontal = start.y === end.y;
    this.isVertical = start.x === end.x;
  }

  isOnLine(point: Vector2) {
    if (
      this.isHorizontal &&
      point.x >= Math.min(this.start.x, this.end.x) &&
      point.x <= Math.max(this.start.x, this.end.x) &&
      point.y === this.start.y
    ) {
      return true;
    } else if (
      this.isVertical &&
      point.y >= Math.min(this.start.y, this.end.y) &&
      point.y <= Math.max(this.start.y, this.end.y) &&
      point.x === this.start.x
    ) {
      return true;
    }
    return false;
  }
  
  lineIsOnDirection(point: Vector2) {
    if (
      this.isHorizontal &&
      point.x >= Math.min(this.start.x, this.end.x) &&
      point.x <= Math.max(this.start.x, this.end.x)
    ) {
      return point.y < this.start.y ? 'up' : 'down';
    }
    if (
      this.isVertical &&
      point.y >= Math.min(this.start.y, this.end.y) &&
      point.y <= Math.max(this.start.y, this.end.y)
    ) {
      return point.x < this.start.x ? 'left' : 'right';
    }
    return null;
  }
}

function getInput(filePath: string): Vector2[] {
  return getLines(filePath).map(line => {
    const [x, y] = line.split(',');
    return {x: Number(x), y: Number(y)}; 
  })
}

function calcRectArea (point1: Vector2, point2: Vector2) {
  return (Math.abs(point1.x - point2.x) + 1) * (Math.abs(point1.y - point2.y) + 1);
}

function star1(filePath: string) {
  const redTiles = getInput(filePath);
  const allAreas = redTiles
    .flatMap((tile, index) => redTiles.slice(index + 1)
      .map(otherTile => calcRectArea(tile, otherTile))
    );
  return allAreas.sort((a, b) => b - a)[0];
}

function getLinesFromRedTiles(redTiles: Vector2[]): Line[] {
  return redTiles.flatMap((leftTile, index) => {
    return redTiles.slice(index + 1)
      .filter(rightTile => leftTile.x === rightTile.x || leftTile.y === rightTile.y)
      .map(rightTile => new Line(leftTile, rightTile));
  });
}

function checkTileIsGreenOrRed(lines: Line[], toCheck: Vector2) {
  const directions = {
    'up': false,
    'down': false,
    'left': false,
    'right': false,
  };
  for (const line of lines) {
    if (line.isOnLine(toCheck)) {
      return true;
    }
    const direction = line.lineIsOnDirection(toCheck);
    if (direction) {
      directions[direction] = true;
    }
  }
  return Object.values(directions).every(v => v);
}

function checkRectWithOnlyRedOrGreenTiles(lines: Line[], tile1: Vector2, tile2: Vector2): boolean {
  const corners = {
    topLeft: {x: Math.min(tile1.x, tile2.x), y: Math.min(tile1.y, tile2.y)},
    topRight: {x: Math.max(tile1.x, tile2.x), y: Math.min(tile1.y, tile2.y)},
    bottomLeft: {x: Math.min(tile1.x, tile2.x), y: Math.max(tile1.y, tile2.y)},
    bottomRight: {x: Math.max(tile1.x, tile2.x), y: Math.max(tile1.y, tile2.y)},
  }
  if (
    !checkTileIsGreenOrRed(lines, corners.topLeft) ||
    !checkTileIsGreenOrRed(lines, corners.topRight) ||
    !checkTileIsGreenOrRed(lines, corners.bottomLeft) ||
    !checkTileIsGreenOrRed(lines, corners.bottomRight)
  ) {
    return false;
  }
  for (let x = corners.topLeft.x; x <= corners.topRight.x; x++) {
    if (!checkTileIsGreenOrRed(lines, {x, y: corners.topLeft.y})) {
      return false;
    }
  }
  for (let x = corners.bottomLeft.x; x <= corners.bottomRight.x; x++) {
    if (!checkTileIsGreenOrRed(lines, {x: x, y: corners.bottomLeft.y})) {
      return false;
    }
  }
  for (let y = corners.topLeft.y; y <= corners.bottomLeft.y; y++) {
    if (!checkTileIsGreenOrRed(lines, {x: corners.topLeft.x, y})) {
      return false;
    }
  }
  for (let y = corners.topRight.y; y <= corners.bottomRight.y; y++) {
    if (!checkTileIsGreenOrRed(lines, {x: corners.topRight.x, y})) {
      return false;
    }
  }
  return true;
}

function star2(filePath: string) {
  const redTiles = getInput(filePath);
  const lines = getLinesFromRedTiles(redTiles);
  console.log(`Number of lines: ${lines.length}`);
  const pairOfRedTiles = redTiles.flatMap(
    (leftTile, index) => redTiles
      .slice(index + 1)
      .map(rightTile => ({leftTile, rightTile, area: calcRectArea(leftTile, rightTile)}))
  );
  return pairOfRedTiles
    .sort((a, b) => b.area - a.area)
    .find((pair, index) => {
      if (index % 500 === 0) {
        console.log(`${index + 1} / ${pairOfRedTiles.length} | ${(100 * (index + 1) / pairOfRedTiles.length).toFixed(2)}%`);
      }
      return checkRectWithOnlyRedOrGreenTiles(lines, pair.leftTile, pair.rightTile);
    }).area;
}

console.log(`Star 1 (sample): ${star1(`${__dirname}/star-1-sample.txt`)}`);
console.log(`Star 1: ${star1(`${__dirname}/star-1-input.txt`)}`);
console.log(`Star 2 (sample): ${star2(`${__dirname}/star-2-sample.txt`)}`);
console.log(`Star 2: ${star2(`${__dirname}/star-2-input.txt`)}`);
