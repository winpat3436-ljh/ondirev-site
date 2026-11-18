// 확인용: 메뉴 링크가 일반 방문자에게 열리는지 (천천히, 페이지마다 새 창)
const {chromium}=require('playwright');const fs=require('fs');const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const U=['/home','/','/IN/?idx=1','/products','/prdouct','/IN','/service','/faq','/notice','/directions','/home'];
(async()=>{const b=await chromium.launch();fs.mkdirSync('probe/crawl',{recursive:true});const out=[];
 for(const [i,u] of U.entries()){const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,locale:'ko-KR',userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});
  const p=await ctx.newPage();let st=0;p.on('response',r=>{if(r.url().replace(/\/$/,'')===('https://ondirev.com'+u).replace(/\/$/,''))st=r.status()});
  await p.goto('https://ondirev.com'+u,{waitUntil:'load',timeout:60000}).catch(()=>{});await p.waitForTimeout(5000);
  const r=await p.evaluate(()=>({url:location.href,title:document.title,blocked:/접근이 제한|Access is restricted/.test(document.body.innerText),h:document.documentElement.scrollHeight,txt:document.body.innerText.replace(/\s+/g,' ').slice(0,300)}));
  await p.screenshot({path:'probe/crawl/v'+i+'.jpg',type:'jpeg',quality:50});out.push({u,st,...r});await ctx.close();fs.writeFileSync('probe/crawl/verify.json',JSON.stringify(out,null,1));await sleep(20000);}
 await b.close();})();
