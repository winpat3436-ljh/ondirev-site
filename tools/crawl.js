// 자사몰 공개 페이지 점검(진단용): 화면을 실제처럼 스크롤하며 캡처 + 링크·문구·추적 태그 수집. 차단을 피하려고 천천히 방문
const {chromium}=require('playwright');const fs=require('fs');
const BASE='https://ondirev.com';const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const UA_M='Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
(async()=>{const b=await chromium.launch();fs.mkdirSync('probe/crawl',{recursive:true});
 const ctxM=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,userAgent:UA_M,locale:'ko-KR'});
 const ctxP=await b.newContext({viewport:{width:1440,height:900},locale:'ko-KR'});
 const out={pages:[]};
 async function visit(ctx,u,name,shots){const p=await ctx.newPage();const req=[];const errs=[];p.on('request',r=>req.push(r.url()));p.on('pageerror',e=>errs.push(e.message));
  const t0=Date.now();await p.goto(u,{waitUntil:'load',timeout:60000}).catch(e=>errs.push('goto '+e.message));const tLoad=Date.now()-t0;await p.waitForTimeout(6000);
  const links=await p.$$eval('a[href]',as=>as.map(a=>[a.innerText.trim().slice(0,30),a.getAttribute('href')]).filter(x=>x[1]&&!x[1].startsWith('javascript')));
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);const vh=p.viewportSize().height;let i=0;
  for(let y=0;y<H&&i<shots;y+=vh-60,i++){await p.evaluate(y=>window.scrollTo(0,y),y);await p.waitForTimeout(1300);await p.screenshot({path:`probe/crawl/${name}_${String(i).padStart(2,'0')}.jpg`,type:'jpeg',quality:60});}
  const info=await p.evaluate(()=>({title:document.title,desc:document.querySelector('meta[name=description]')?.content||'',ogt:document.querySelector('meta[property="og:title"]')?.content||'',ogi:document.querySelector('meta[property="og:image"]')?.content||'',text:document.body.innerText.slice(0,9000)}));
  await p.waitForTimeout(3000);
  const tags={ga:req.filter(r=>/google-analytics|googletagmanager|gtag/.test(r)).slice(0,3),meta:req.some(r=>/facebook\.(net|com)/.test(r)),kakao:req.filter(r=>/kakao|daumcdn/.test(r)).slice(0,3),naver:req.some(r=>/wcs\.naver|wcslog|nlog/.test(r)),gads:req.some(r=>/googleads|doubleclick/.test(r))};
  out.pages.push({u,name,tLoad,H,errs:errs.slice(0,5),tags,nreq:req.length,links,...info});await p.close();fs.writeFileSync('probe/crawl/result.json',JSON.stringify(out,null,1));await sleep(15000);}
 await visit(ctxM,BASE+'/','home_m',8);
 const hp=out.pages[0].links.map(x=>x[1]).map(h=>h.startsWith('http')?h:BASE+(h.startsWith('/')?'':'/')+h).filter(h=>h.startsWith(BASE));
 const uniq=[...new Set(hp.map(h=>h.split('#')[0]))].filter(h=>h!==BASE+'/'&&!/login|logout|join|shop_cart|mypage|search|policy|privacy|terms|instagram/i.test(h)).slice(0,6);
 out.found=uniq;
 for(const [i,u] of uniq.entries()) await visit(ctxM,u,'p'+i+'_m',8);
 await visit(ctxM,BASE+'/shop_view/?idx=1','prod_m',14);
 await visit(ctxP,BASE+'/','home_pc',4);
 await visit(ctxP,BASE+'/shop_view/?idx=1','prod_pc',5);
 await b.close();})();
