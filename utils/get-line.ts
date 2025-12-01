import * as fs from 'fs'

export function getLines (filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath);

  return fileContent.toString().split(/\r?\n/);
}