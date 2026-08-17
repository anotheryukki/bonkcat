import fs from 'node:fs';
import { PNG } from 'pngjs';

const file = process.argv[2];
const points = JSON.parse(process.argv[3]);

const data = fs.readFileSync(file);
const png = PNG.sync.read(data);

for (const [x, y] of points) {
  const idx = (png.width * y + x) << 2;
  const r = png.data[idx];
  const g = png.data[idx + 1];
  const b = png.data[idx + 2];
  const a = png.data[idx + 3];
  const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  console.log(`(${x},${y}) rgba(${r},${g},${b},${a}) ${hex}`);
}
console.log('image size', png.width, png.height);
