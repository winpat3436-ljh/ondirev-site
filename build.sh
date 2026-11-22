#!/bin/sh
# 빌드: src/footer_source.html -> dist/main.js, dist/main.css (실제 코드)
#       dist/footer.js = 아주 작은 로더 (아임웹이 부르는 주소는 그대로)
#       dist/footer.css = main.css 와 같은 내용 (첫 화면 깜빡임 방지용)
set -e
cd "$(dirname "$0")"
B=${BUILD_DIST:-/tmp/claude-0/-home-claude/07494ea6-6213-55ee-a7e3-8c3741738a35/scratchpad/min}
T=$(mktemp -d)
(cd "$B" && node build_dist.js "$OLDPWD/src/footer_source.html" "$T")
# 각 블록 앞에 진단용 표시(평소에는 아무 일도 안 함)
awk '{print ";window.__odL&&__odL(" NR ")" $0} END{print ";window.__odL&&__odL(0);"}' "$T/footer.js" > dist/main.js
cp "$T/footer.css" dist/main.css
cp "$T/footer.css" dist/footer.css
cat > dist/footer.js <<'JS'
/* ONDIREV 로더: 1분마다 새 주소로 불러와서, 수정하면 1~2분 안에 반영됨 */
(function(){
  var b = "https://winpat3436-ljh.github.io/ondirev-site/dist/", v = Math.floor(Date.now() / 60000);
  var l = document.createElement("link"); l.rel = "stylesheet"; l.href = b + "main.css?v=" + v; document.head.appendChild(l);
  var s = document.createElement("script"); s.src = b + "main.js?v=" + v; s.async = false; document.body.appendChild(s);
})();
JS
rm -rf "$T"
echo built
