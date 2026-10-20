/* eslint-disable @typescript-eslint/no-require-imports */
const fs=require('fs');const path=require('path');
(async()=>{const html=fs.readFileSync('docs/research/medical/source-response.html','utf8');const dir='public/sites/medical';fs.mkdirSync(dir,{recursive:true});
const urls=[...new Set([...html.matchAll(/https:\/\/0141\.matbao\.website\/wp-content\/uploads\/[^\s"'<>),]+/g)].map(m=>m[0]))];
const cssUrls=[...html.matchAll(/href=['"]([^'"]+\.css[^'"]*)['"]/g)].map(m=>m[1]);
for(const url of cssUrls){const u=url.startsWith('//')?'https:'+url:url;try{const css=await(await fetch(u.replaceAll('&#038;','&'))).text();fs.writeFileSync('docs/research/medical/'+path.basename(u.split('?')[0])+(u.includes('googleapis')?'.css':''),css);}catch(e){console.log(e.message)}}
let n=0;for(let i=0;i<urls.length;i+=8){await Promise.all(urls.slice(i,i+8).map(async url=>{try{const r=await fetch(url);if(!r.ok)throw Error(r.status);fs.writeFileSync(path.join(dir,path.basename(url)),Buffer.from(await r.arrayBuffer()));n++;}catch(e){console.log(url,e.message)}}));}fs.writeFileSync('docs/research/medical/asset-map.json',JSON.stringify(urls.map(url=>({url,local:'/sites/medical/'+path.basename(url)})),null,2));console.log('Downloaded',n,'assets');})();
