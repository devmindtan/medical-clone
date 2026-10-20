/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true});
  const page = await browser.newPage({viewport:{width:1440,height:1000}});
  await page.goto('https://0141.matbao.website/',{waitUntil:'networkidle'});
  await page.screenshot({path:'docs/research/medical/source-desktop-top.png'});
  for(let y=0;y<10000;y+=700){await page.mouse.wheel(0,700);await page.waitForTimeout(150);}
  await page.screenshot({path:'docs/research/medical/source-desktop-full.png',fullPage:true});
  fs.writeFileSync('docs/research/medical/source-dom.html',await page.content());
  fs.writeFileSync('docs/research/medical/inspection.json',JSON.stringify(await page.evaluate(()=>({text:document.body.innerText,sections:[...document.querySelectorAll('main section')].map(el=>({class:el.className,rect:el.getBoundingClientRect().toJSON(),text:el.innerText,images:[...el.querySelectorAll('img')].map(i=>({src:i.currentSrc,alt:i.alt})),style:getComputedStyle(el).cssText})),assets:[...document.querySelectorAll('img')].map(i=>i.src),styles:[...document.styleSheets].map(s=>s.href),fonts:[...document.fonts].map(f=>({family:f.family,weight:f.weight}))})),null,2));
  await page.setViewportSize({width:390,height:844});
  await page.goto('https://0141.matbao.website/',{waitUntil:'networkidle'});
  await page.screenshot({path:'docs/research/medical/source-mobile-top.png'});
  for(let y=0;y<18000;y+=700){await page.mouse.wheel(0,700);await page.waitForTimeout(100);}
  await page.screenshot({path:'docs/research/medical/source-mobile-full.png',fullPage:true});
  await browser.close();
})();
