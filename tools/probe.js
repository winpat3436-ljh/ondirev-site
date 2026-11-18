// 상품 상세 첫 화면에서 왼쪽 대표 사진 크기 변화를 시간별로 기록 (진단용)
const {chromium}=require('playwright');const fs=require('fs');
const URLS=["https://ondirev.com/shop_view/?idx=1"];
(async()=>{const b=await chromium.launch({ignoreDefaultArgs:['--hide-scrollbars']});const out={};
for(const vp of [{n:'pc',w:1440,h:900},{n:'m',w:390,h:844}]) for(const block of [false]){
 const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},userAgent:vp.n==='m'?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':undefined,isMobile:vp.n==='m',hasTouch:vp.n==='m',recordVideo:{dir:'probe/v_'+vp.n,size:{width:vp.w,height:vp.h}}});
 const p=await ctx.newPage(); if(block) await p.route(/github\.io/,r=>r.abort());
 await p.addInitScript(()=>{window.__log=[];const t0=performance.now();const tick=()=>{try{const w=document.querySelector('.goods_thumbs_wrap');const f=document.querySelector('.goods_wrapper > .goods_form, .goods_form');
   let big=null,a=0;if(w)for(const im of w.querySelectorAll('img')){const r=im.getBoundingClientRect();if(r.width*r.height>a){a=r.width*r.height;big=im}}
   const R=e=>{if(!e)return null;const r=e.getBoundingClientRect();return[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]};
   const ai=document.querySelector('.owl-item.active img')||big;window.__log.push({src:ai?(ai.currentSrc||ai.src).slice(-60):'',nat:ai?ai.naturalWidth+'x'+ai.naturalHeight:'',ai:ai?R(ai):null,hold:R(document.querySelector('.goods_thumbs .holder')),t:Math.round(performance.now()-t0),img:R(big),wrap:R(w),form:R(f),ready:document.documentElement.classList.contains('od-ready'),sb:window.innerWidth-document.documentElement.clientWidth});}catch(e){}
   if(performance.now()-t0<9000)requestAnimationFrame(tick)};tick();});
 await p.goto(URLS[0],{waitUntil:'commit'});await p.waitForTimeout(9500);
 const log=await p.evaluate(()=>window.__log);
 const dom=await p.evaluate(()=>{const g=document.querySelector('.goods_wrapper')||document.querySelector('.goods_thumbs_wrap')?.parentElement;
   const walk=(e,d)=>{if(!e||d>7)return'';const cs=getComputedStyle(e);const r=e.getBoundingClientRect();let s='  '.repeat(d)+e.tagName.toLowerCase()+(e.id?'#'+e.id:'')+(e.className&&typeof e.className==='string'?'.'+e.className.trim().split(/\s+/).join('.'):'')+` [${cs.display} pos:${cs.position} flex:${cs.flex} w:${cs.width} minw:${cs.minWidth} ${Math.round(r.width)}x${Math.round(r.height)}]`+(e.style&&e.style.cssText?' style="'+e.style.cssText.slice(0,160)+'"':'')+'\n';
     for(const c of [...e.children].slice(0,12)) if(c.tagName!=='SCRIPT'&&c.tagName!=='STYLE')s+=walk(c,d+1);return s};
   return g?walk(g,0):'no goods_wrapper';});
 const k=vp.n+(block?'_noOD':'_OD');out[k]={log,dom};await p.screenshot({path:'probe/'+k+'.png'});await ctx.close();}
fs.writeFileSync('probe/result.json',JSON.stringify(out,null,1));await b.close();})();
