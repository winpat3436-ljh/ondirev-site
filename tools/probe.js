// (v8) 상품 상세 수량·가격 영역 확인 (비회원)
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const vp of [{n:'m',w:390,h:844},{n:'pc',w:1440,h:900}]){
 const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},deviceScaleFactor:2,isMobile:vp.n==='m',hasTouch:vp.n==='m',userAgent:vp.n==='m'?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':undefined});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.goto('https://ondirev.com/shop_view/?idx=1',{waitUntil:'load',timeout:60000});await p.waitForTimeout(9000);
 const box=await p.$('.odqa');
 if(box){await box.scrollIntoViewIfNeeded();await p.waitForTimeout(500);
   const r=await p.evaluate(()=>{const a=document.querySelector('.odqa').getBoundingClientRect();const mb=document.querySelector('.od-mbuy');const e=(mb||document.querySelector('.odqa').parentElement).getBoundingClientRect();return {y:Math.max(0,a.top-20),h:Math.min(900,Math.max(a.bottom,e.bottom)-a.top+40)}});
   await p.screenshot({path:'probe/qa_'+vp.n+'_1.png',clip:{x:0,y:r.y,width:vp.w,height:Math.min(r.h,vp.h-r.y)}});
   await p.click('.odqa-t[data-n="2"]');await p.waitForTimeout(1500);
   await p.screenshot({path:'probe/qa_'+vp.n+'_2.png',clip:{x:0,y:r.y,width:vp.w,height:Math.min(r.h,vp.h-r.y)}});}
 const info=await p.evaluate(()=>({odqa:document.querySelectorAll('.odqa').length,on:document.querySelector('.odqa-t.on')?.dataset.n,tot:document.querySelector('.od-mbuy .od-mtotal')?.innerText,k:document.querySelector('.odqa-k')?.innerText}));
 require('fs').writeFileSync('probe/qa_'+vp.n+'.json',JSON.stringify({info,errs:errs.slice(0,5)}));await ctx.close();}
await b.close();})();
