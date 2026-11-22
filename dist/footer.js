/* ONDIREV 로더: 3분마다 새 주소로 불러와서, 수정하면 몇 분 안에 반영됨 (?od_fresh=1 을 붙이면 그 브라우저는 항상 최신) */
(function(){
  var b = "https://winpat3436-ljh.github.io/ondirev-site/", d = b + "dist/", v = Math.floor(Date.now() / 180000), P = location.pathname, S = location.search, off = false;
  try{ var q = /[?&]od_fresh=([01])/.exec(S); if(q) localStorage.setItem("od_fresh", q[1]); if(localStorage.getItem("od_fresh") === "1") v = Date.now(); off = localStorage.getItem("od_v2") === "0" || /[?&]od_v2=0/.test(S); }catch(e){}
  /* 1) 이 페이지에 필요한 새 디자인 묶음과 첫 화면 사진을 본 코드보다 먼저, 동시에 받기 시작 */
  var pre = window.__odPre = window.__odPre || {};
  function get(n){ try{ pre[n] = fetch(d + "v2/" + n + "?v=" + v).then(function(r){ return r.ok ? r.text() : null; }).catch(function(){ return null; }); }catch(e){} }
  function img(u, m){ try{ var k = document.createElement("link"); k.rel = "preload"; k.as = "image"; k.href = b + u; if(m) k.media = m; document.head.appendChild(k); }catch(e){} }
  if(!off){
    if(/[?&]idx=1(&|#|$)/.test(S)) get("pdp_in.html");
    else if(/[?&](mode|idx)=/.test(S)){}
    else if(/^\/(home\/?)?$/.test(P)){ get("home.html"); img("img/home/hero_m.webp", "(max-width:991px)"); img("img/home/hero_pc.webp", "(min-width:992px)"); }
    else if(/^\/(service|notice|faq|one-on-one)\/?$/.test(P)) get("svc.html");
    else if(/^\/(direction|directions|products|prdouct|IN)\/?$/.test(P)) get("pages.html");
  }
  /* 2) 스타일: 먼저 불러 둔 footer.css 바로 뒤에 최신본을 넣고, 다 불러오면 같은 내용인 예전 것은 꺼서 규칙이 두 벌로 계산되지 않게 함 */
  var old = document.querySelector('link[rel="stylesheet"][href*="ondirev-site/dist/footer.css"]');
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = d + "main.css?v=" + v;
  l.onload = function(){ try{ if(old && l.sheet) old.disabled = true; }catch(e){} };
  if(old && old.parentNode) old.parentNode.insertBefore(l, old.nextSibling); else document.head.appendChild(l);
  /* 3) 본 코드 */
  var s = document.createElement("script"); s.src = d + "main.js?v=" + v; s.async = false; document.body.appendChild(s);
})();
