import fs from 'node:fs';
import { PNG } from 'pngjs';

const file = process.argv[2];
const data = fs.readFileSync(file);
const png = PNG.sync.read(data);
const { width, height } = png;

let minX = width, maxX = 0, minY = height, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (width * y + x) << 2;
    const a = png.data[idx + 3];
    if (a > 10) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}
console.log({ width, height, minX, maxX, minY, maxY });
console.log('top margin %', (minY / height * 100).toFixed(1));
console.log('bottom margin %', ((height - maxY) / height * 100).toFixed(1));
console.log('left margin %', (minX / width * 100).toFixed(1));
console.log('right margin %', ((width - maxX) / width * 100).toFixed(1));
