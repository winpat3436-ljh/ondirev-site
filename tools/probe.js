// (v5) 상품 상세 대표 사진 확인 캡처
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
for(const vp of [{n:'pc',w:1440,h:900},{n:'m',w:390,h:844}]){
 const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},deviceScaleFactor:2,isMobile:vp.n==='m',userAgent:vp.n==='m'?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':undefined});
 const p=await ctx.newPage();await p.goto('https://ondirev.com/shop_view/?idx=1',{waitUntil:'load',timeout:60000});await p.waitForTimeout(9000);
 const el=await p.$('#prod_image_list');if(el)await el.screenshot({path:'probe/img_'+vp.n+'.png'});
 const info=await p.evaluate(()=>{const b=document.querySelector('.odpb');return b?{txt:b.innerText,op:getComputedStyle(b).opacity,r:b.getBoundingClientRect().toJSON()}:null});
 require('fs').writeFileSync('probe/odpb_'+vp.n+'.json',JSON.stringify(info));await ctx.close();}
await b.close();})();
