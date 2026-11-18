// 자사몰 공개 페이지 점검(진단용): 주요 페이지 화면·문구·속도·추적 태그 수집
const {chromium}=require('playwright');const fs=require('fs');
const BASE='https://ondirev.com';
(async()=>{const b=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});fs.mkdirSync('probe/crawl',{recursive:true});
 const home=await b.newPage();await home.goto(BASE+'/',{waitUntil:'networkidle',timeout:60000}).catch(()=>{});await home.waitForTimeout(3000);
 let links=await home.$$eval('a[href]',as=>as.map(a=>a.href));
 links=[...new Set(links.filter(h=>h.startsWith('https://ondirev.com')&&!/#|logout|javascript/.test(h)).map(h=>h.split('#')[0]))];
 const pages=[BASE+'/',...links.filter(h=>h!==BASE+'/')].slice(0,18);
 pages.push(BASE+'/shop_cart',BASE+'/login',BASE+'/directioncheck');
 const out=[];
 for(const [i,u] of [...new Set(pages)].entries()) for(const vp of [{n:'m',w:390,h:844,m:true},{n:'pc',w:1440,h:900,m:false}]){
  const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},isMobile:vp.m,hasTouch:vp.m,userAgent:vp.m?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':undefined});
  const p=await ctx.newPage();const req=[];const errs=[];p.on('request',r=>req.push(r.url()));p.on('pageerror',e=>errs.push(e.message));
  const t0=Date.now();await p.goto(u,{waitUntil:'load',timeout:60000}).catch(e=>errs.push('goto '+e.message));const tLoad=Date.now()-t0;
  await p.waitForTimeout(5000);
  for(let y=0;y<30;y++){await p.mouse.wheel(0,900);await p.waitForTimeout(120);} await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(800);
  const info=await p.evaluate(()=>({title:document.title,desc:document.querySelector('meta[name=description]')?.content||'',og:document.querySelector('meta[property="og:image"]')?.content||'',h:document.documentElement.scrollHeight,text:document.body.innerText.slice(0,6000)}));
  const tags={ga:req.some(r=>/google-analytics|googletagmanager|gtag/.test(r)),meta:req.some(r=>/facebook\.(net|com)\/(tr|en_US\/fbevents)/.test(r)),kakaoPixel:req.some(r=>/t1\.daumcdn\.net\/kas|kakaopixel/i.test(r)),naver:req.some(r=>/wcs\.naver|wcslog/.test(r)),clarity:req.some(r=>/clarity\.ms/.test(r)),hotjar:req.some(r=>/hotjar/.test(r))};
  const name=String(i).padStart(2,'0')+'_'+vp.n;
  await p.screenshot({path:'probe/crawl/'+name+'.jpg',fullPage:true,type:'jpeg',quality:55}).catch(()=>{});
  out.push({u,vp:vp.n,tLoad,errs:errs.slice(0,5),tags,nreq:req.length,...info});await ctx.close();}
 fs.writeFileSync('probe/crawl/result.json',JSON.stringify(out,null,1));await b.close();})();
