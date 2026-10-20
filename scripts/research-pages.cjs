/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const { chromium } = require('playwright');
const origin = 'https://0141.matbao.website';
const dir = 'docs/research/medical/pages';
(async () => {
  fs.mkdirSync(dir, { recursive: true });
  for (const resource of ['pages', 'posts', 'categories']) {
    const response = await fetch(`${origin}/wp-json/wp/v2/${resource}?per_page=100&_embed`);
    const text = await response.text();
    fs.writeFileSync(`${dir}/${resource}.json`, text);
    console.log(resource, response.status, text.length);
  }
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const paths = ['/gioi-thieu/', '/category/san-pham/', '/category/du-an/', '/category/tin-tuc/', '/category/tuyen-dung/', '/lien-he/', '/benh-vien-nguyen-tri-phuong/', '/21-nguyen-tac-de-hoan-thanh-cong-viec-hieu-qua/'];
  const evidence = [];
  for (const pathname of paths) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    await page.goto(origin + pathname, { waitUntil: 'networkidle' });
    const slug = pathname.split('/').filter(Boolean).pop();
    fs.writeFileSync(`${dir}/${slug}.html`, await page.content());
    for (let n = 0; n < 8; n++) { await page.mouse.wheel(0, 800); await page.waitForTimeout(80); }
    await page.screenshot({ path: `${dir}/${slug}-desktop.png`, fullPage: true });
    evidence.push(await page.evaluate(() => ({ url: location.href, title: document.title, text: document.querySelector('main').innerText, main: document.querySelector('main').innerHTML, links: [...document.querySelectorAll('main a')].map(a => ({ href: a.href, text: a.textContent.trim() })), metrics: [...document.querySelectorAll('main h1,main h2,.page-title,.post-sidebar,.entry-content,.entry-header,.archive-page-header,.post-item,.entry-image')].map(e => ({ tag: e.tagName, class: e.className, text: e.textContent.trim().slice(0, 80), rect: e.getBoundingClientRect().toJSON(), font: getComputedStyle(e).font, padding: getComputedStyle(e).padding, margin: getComputedStyle(e).margin })) })));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${dir}/${slug}-mobile.png`, fullPage: true });
    console.log(pathname);
    await page.close();
  }
  fs.writeFileSync(`${dir}/evidence.json`, JSON.stringify(evidence, null, 2));
  await browser.close();
})();
