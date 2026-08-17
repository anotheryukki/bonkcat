import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

function findChrome() {
  const base = path.join(process.env.USERPROFILE, '.cache', 'puppeteer', 'chrome');
  const versions = fs.readdirSync(base).filter((d) => d.startsWith('win64-')).sort();
  return path.join(base, versions[versions.length - 1], 'chrome-win64', 'chrome.exe');
}

const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });
const context = browser.defaultBrowserContext();
await context.overridePermissions('http://localhost:3001', ['clipboard-read', 'clipboard-write']);

const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });
await page.click('#copyContractBtn');
await new Promise((r) => setTimeout(r, 300));
const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
const toastVisible = await page.evaluate(() => document.getElementById('copiedToast').classList.contains('show'));

console.log('Clipboard contents:', clipboardText);
console.log('Toast visible after click:', toastVisible);
console.log('Console/page errors:', errors);

await browser.close();
