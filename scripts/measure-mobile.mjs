import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

function findChrome() {
  const base = path.join(process.env.USERPROFILE, '.cache', 'puppeteer', 'chrome');
  const versions = fs.readdirSync(base).filter((d) => d.startsWith('win64-')).sort();
  return path.join(base, versions[versions.length - 1], 'chrome-win64', 'chrome.exe');
}

const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844 });
await page.goto('http://localhost:3001', { waitUntil: 'networkidle0' });

const data = await page.evaluate(() => {
  function info(sel) {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) };
  }
  return {
    section: info('section'),
    eyebrow: info('.mono-label.text-bonk'),
    headlineWrap: info('h1'),
    paragraphBlock: info('h1').bottom, // placeholder
    catCol: info('section .shrink-0'),
    divider: (() => { const el = document.querySelectorAll('body > div')[0]; const r = el.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), height: Math.round(r.height) }; })(),
    footer: info('footer'),
    bodyScrollHeight: document.documentElement.scrollHeight,
  };
});
console.log(JSON.stringify(data, null, 2));
await browser.close();
