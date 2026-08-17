import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

function findChrome() {
  const base = path.join(process.env.USERPROFILE, '.cache', 'puppeteer', 'chrome');
  const versions = fs.readdirSync(base).filter((d) => d.startsWith('win64-')).sort();
  return path.join(base, versions[versions.length - 1], 'chrome-win64', 'chrome.exe');
}

const sizes = [
  [1920, 1080],
  [1536, 864],
  [1440, 900],
  [1366, 768],
  [1280, 800],
];

const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });
for (const [w, h] of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h });
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }));
  console.log(`${w}x${h} ->`, metrics, 'hOverflow:', metrics.scrollWidth - metrics.clientWidth, 'vOverflow:', metrics.scrollHeight - metrics.clientHeight);
  await page.close();
}
await browser.close();
