// (v6) 상품 상세 대표 사진 확인 캡처
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const vp of [{n:'pc',w:1440,h:900},{n:'m',w:390,h:844}]){
 const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},deviceScaleFactor:2,isMobile:vp.n==='m',userAgent:vp.n==='m'?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':undefined});
 const p=await ctx.newPage();await p.goto('https://ondirev.com/shop_view/?idx=1',{waitUntil:'load',timeout:60000});await p.waitForTimeout(9000);
 const el=await p.$('#prod_image_list');if(el)await el.screenshot({path:'probe/img_'+vp.n+'.png'});
 await p.evaluate(()=>{const d=document.querySelectorAll('.owl-dot');if(d[2])d[2].click();else{const t=document.querySelectorAll('.goods_thumbs_wrap img');if(t[2])t[2].click();}});await p.waitForTimeout(1500);if(el)await el.screenshot({path:'probe/img3_'+vp.n+'.png'});const info=await p.evaluate(()=>{const b=document.querySelector('.odpb');const a=[...document.querySelectorAll('#prod_image_list .owl-item:not(.cloned)')].findIndex(x=>x.classList.contains('active'));return b?{active:a,txt:b.innerText,op:getComputedStyle(b).opacity,vis:getComputedStyle(b).visibility}:null});
 require('fs').writeFileSync('probe/odpb_'+vp.n+'.json',JSON.stringify(info));await ctx.close();}
await b.close();})();
