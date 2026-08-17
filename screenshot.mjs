import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findChrome() {
  const base = path.join(process.env.USERPROFILE || __dirname, '.cache', 'puppeteer', 'chrome');
  if (!fs.existsSync(base)) throw new Error('No cached chrome found at ' + base);
  const versions = fs.readdirSync(base).filter((d) => d.startsWith('win64-'));
  if (versions.length === 0) throw new Error('No chrome build found in ' + base);
  versions.sort();
  const latest = versions[versions.length - 1];
  return path.join(base, latest, 'chrome-win64', 'chrome.exe');
}

const url = process.argv[2] || 'http://localhost:3001';
const label = process.argv[3];
const viewportWidth = parseInt(process.argv[4], 10) || 1920;
const viewportHeight = parseInt(process.argv[5], 10) || 1080;

const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter((f) => /^screenshot-\d+/.test(f));
const nums = existing.map((f) => parseInt(f.match(/^screenshot-(\d+)/)[1], 10));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = `screenshot-${next}${label ? '-' + label : ''}.png`;
const outPath = path.join(dir, filename);

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: viewportWidth, height: viewportHeight });
await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log('Saved ' + outPath);
