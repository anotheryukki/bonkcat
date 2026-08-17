import fs from 'node:fs';
import { PNG } from 'pngjs';

const [, , inFile, outFile, x0, y0, x1, y1] = process.argv;
const minX = parseInt(x0, 10);
const minY = parseInt(y0, 10);
const maxX = parseInt(x1, 10);
const maxY = parseInt(y1, 10);

const src = PNG.sync.read(fs.readFileSync(inFile));
const w = maxX - minX;
const h = maxY - minY;
const out = new PNG({ width: w, height: h });

for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const srcIdx = (src.width * (y + minY) + (x + minX)) << 2;
    const dstIdx = (w * y + x) << 2;
    out.data[dstIdx] = src.data[srcIdx];
    out.data[dstIdx + 1] = src.data[srcIdx + 1];
    out.data[dstIdx + 2] = src.data[srcIdx + 2];
    out.data[dstIdx + 3] = src.data[srcIdx + 3];
  }
}

fs.writeFileSync(outFile, PNG.sync.write(out));
console.log('wrote', outFile, w, 'x', h);
