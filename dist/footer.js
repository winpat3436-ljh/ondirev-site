/* ONDIREV 로더: 1분마다 새 주소로 불러와서, 수정하면 1~2분 안에 반영됨 */
(function(){
  var b = "https://winpat3436-ljh.github.io/ondirev-site/dist/", v = Math.floor(Date.now() / 60000);
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = b + "main.css?v=" + v; document.head.appendChild(l);
  var s = document.createElement("script"); s.src = b + "main.js?v=" + v; s.async = false; document.body.appendChild(s);
})();
