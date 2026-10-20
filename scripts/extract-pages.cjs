/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const base = 'docs/research/medical/pages';
const origin = 'https://0141.matbao.website';
(async () => {
  const rawPosts = JSON.parse(fs.readFileSync(`${base}/posts.json`, 'utf8'));
  const rawCategories = JSON.parse(fs.readFileSync(`${base}/categories.json`, 'utf8'));
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage();
  await page.route('**/*', r => r.abort());
  await page.setContent('<html><body></body></html>');
  const data = await page.evaluate(({ rawPosts, rawCategories, origin }) => {
    const assets = new Set();
    const decode = html => { const el = document.createElement('textarea'); el.innerHTML = html; return el.value; };
    const local = url => { if (!url) return ''; if (url.includes('/wp-content/uploads/')) { assets.add(origin + url.slice(url.indexOf('/wp-content/uploads/'))); return '/sites/medical/' + url.split('/').pop().split('?')[0]; } if (url.startsWith(origin)) return url.slice(origin.length) || '/'; if (/^https?:\/\/0141\.chilibusiness\.net/.test(url)) return new URL(url).pathname; return url; };
    const sanitize = html => {
      const el = document.createElement('div');
      el.innerHTML = html;
      el.querySelectorAll('script,style,iframe,form,link,meta').forEach(n => n.remove());
      el.querySelectorAll('*').forEach(n => {
        for (const attribute of [...n.attributes]) {
          if (attribute.name.startsWith('on') || ['id', 'srcset', 'sizes', 'style'].includes(attribute.name)) n.removeAttribute(attribute.name);
        }
        for (const key of ['src', 'href']) if (n.hasAttribute(key)) {
          const value = n.getAttribute(key);
          if (/^javascript:/i.test(value)) n.removeAttribute(key); else n.setAttribute(key, local(value));
        }
      });
      return el.innerHTML;
    };
    const posts = rawPosts.map(post => ({ id: post.id, slug: post.slug, title: decode(post.title.rendered), date: post.date, categories: post.categories, image: local(post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ''), excerpt: decode(post.excerpt.rendered.replace(/<[^>]*>/g, '')).trim(), content: sanitize(post.content.rendered), comments: post.comment_status === 'open' }));
    const categories = rawCategories.map(c => ({ id: c.id, name: decode(c.name), slug: c.slug, parent: c.parent, path: new URL(c.link).pathname, count: c.count }));
    return { posts, categories, assets: [...assets] };
  }, { rawPosts, rawCategories, origin });
  await page.setContent(fs.readFileSync(`${base}/gioi-thieu.html`, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ''));
  const about = await page.evaluate(() => [...document.querySelectorAll('main p')].map(p => p.textContent.trim()).filter(Boolean));
  const avatar = rawPosts[0]._embedded?.author?.[0]?.avatar_urls?.['96'];
  const downloads = new Set([...data.assets, `${origin}/wp-content/uploads/2024/02/mbws-img1-14.jpg`, `${origin}/wp-content/uploads/2024/02/mbws-img1-15.jpg`]);
  let count = 0;
  for (const url of downloads) {
    const target = 'public/sites/medical/' + path.basename(url.split('?')[0]);
    if (fs.existsSync(target)) continue;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Asset ${response.status}: ${url}`);
    fs.writeFileSync(target, Buffer.from(await response.arrayBuffer())); count++;
  }
  if (avatar) { const response = await fetch(avatar); if (response.ok) fs.writeFileSync('public/sites/medical/author-system.png', Buffer.from(await response.arrayBuffer())); }
  fs.writeFileSync('src/components/sites/medical/site-data.json', JSON.stringify({ posts: data.posts, categories: data.categories, about }, null, 2));
  fs.writeFileSync(`${base}/asset-map.json`, JSON.stringify([...downloads].map(url => ({ url, local: '/sites/medical/' + path.basename(url.split('?')[0]) })), null, 2));
  console.log('Extracted', data.posts.length, 'posts;', data.categories.length, 'categories;', count, 'new assets');
  await browser.close();
})();
