/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const { chromium } = require('playwright');
const data = require('../src/components/sites/medical/site-data.json');
const origin = 'http://127.0.0.1:3000';
const dir = 'docs/research/medical/pages';
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  const categoryPosts = c => { const ids = new Set([c.id]); for (let i=0;i<data.categories.length;i++) data.categories.forEach(x=>{if(ids.has(x.parent))ids.add(x.id)}); return data.posts.filter(p=>p.categories.some(id=>ids.has(id))); };
  const paths = ['/', '/gioi-thieu/', '/lien-he/', '/author/system/', ...data.posts.map(p=>`/${p.slug}/`), ...data.categories.flatMap(c=>Array.from({length:Math.max(1,Math.ceil(categoryPosts(c).length/10))},(_,i)=>i?`${c.path}page/${i+1}/`:c.path))];
  const failures = [];
  const outgoing = new Set();
  for (let i = 0; i < paths.length; i += 6) {
    await Promise.all(paths.slice(i,i+6).map(async pathname => {
      const response = await page.request.get(origin+pathname);
      if (response.status()!==200) failures.push({pathname,status:response.status()});
      const html=await response.text();
      for (const m of html.matchAll(/href="([^"]+)"/g)) { if(m[1].startsWith('https://0141.matbao.website')) outgoing.add(m[1]); }
    }));
  }
  const views = [];
  const representatives = ['/','/gioi-thieu/','/lien-he/','/category/san-pham/','/category/san-pham/page/2/','/category/du-an/','/category/tin-tuc/','/category/tuyen-dung/','/he-thong-khi-y-te/','/benh-vien-nguyen-tri-phuong/','/21-nguyen-tac-de-hoan-thanh-cong-viec-hieu-qua/','/?s=kh%C3%AD+y+t%E1%BA%BF'];
  for(const width of [1440,390]){
    for(const pathname of representatives){
      await page.setViewportSize({width,height:1000});
      const errors=[];const handler=e=>errors.push(e.message);page.on('pageerror',handler);
      await page.goto(origin+pathname,{waitUntil:'networkidle'});
      const name=pathname==='/'?'home':pathname.includes('?')?'search':pathname.replaceAll('/','-').replace(/^-|-$/g,'');
      await page.screenshot({path:`${dir}/local-${name}-${width}-top.png`});
      for(let y=0;y<16000;y+=900){await page.mouse.wheel(0,900);await page.waitForTimeout(35)}
      await page.screenshot({path:`${dir}/local-${name}-${width}-full.png`,fullPage:true});
      views.push({pathname,width,errors,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),title:document.querySelector('h1')?.textContent}))});
      page.off('pageerror',handler);
    }
  }
  fs.writeFileSync(`${dir}/validation.json`,JSON.stringify({routesChecked:paths.length,paths,failures,sourcePageLinks:[...outgoing],views},null,2));
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(origin+'/');
  await page.locator('.desktop-nav').getByRole('link',{name:'Sản phẩm',exact:true}).click();
  await page.waitForURL(/\/category\/san-pham\/?$/);
  await page.getByRole('link',{name:'Trang tiếp theo',exact:true}).click();
  await page.waitForURL(/\/category\/san-pham\/page\/2\/?$/);
  await page.locator('.archive-item h2 a').first().click();
  await page.locator('.article-header h1').waitFor();
  await page.getByRole('textbox',{name:'Bình luận *',exact:true}).fill('Kiểm tra bình luận trên bản clone.');
  await page.getByRole('textbox',{name:'Tên *',exact:true}).fill('Nguyễn Văn An');
  await page.getByRole('textbox',{name:'Email *',exact:true}).fill('test@example.com');
  await page.getByRole('button',{name:'GỬI BÌNH LUẬN',exact:true}).click();
  if(!await page.getByRole('status').isVisible())throw Error('Comment feedback failed');
  await page.goto(origin+'/?s=zzzz-no-result-123');
  if(!await page.getByRole('heading',{name:'Không tìm thấy kết quả',exact:true}).isVisible())throw Error('Empty search failed');
  await page.goto(origin+'/gioi-thieu/');
  await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:'Menu',exact:true}).click();
  await page.locator('.mobile-panel').getByRole('link',{name:'Liên hệ',exact:true}).click();
  await page.waitForURL(/\/lien-he\/?$/);
  const report={routesChecked:paths.length,paths,failures,sourcePageLinks:[...outgoing],views,interactions:'Desktop navigation, archive pagination, article detail, comment validation/save, search empty state, mobile navigation passed'};
  fs.writeFileSync(`${dir}/validation.json`,JSON.stringify(report,null,2));
  console.log(JSON.stringify({routesChecked:paths.length,failures,sourcePageLinks:[...outgoing],viewFailures:views.filter(v=>v.overflow||v.brokenImages.length||v.errors.length),interactions:report.interactions}));
  await browser.close();
})();
