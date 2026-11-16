# ondirev-site

온디레브(ondirev.com) 사이트 디자인·기능 코드.

- `dist/footer.css` · `dist/footer.js` : 아임웹이 jsDelivr로 불러가는 실제 사용 파일 (압축본)
- `src/` : 사람이 읽고 고치는 원본 (head · body · footer)

아임웹 Footer 칸 100KB 제한 때문에, Footer 코드를 이 저장소 파일로 옮겨 불러옴.

## 배포 방식 (2026-11-16 변경)
- 아임웹 Body 칸은 `https://winpat3436-ljh.github.io/ondirev-site/dist/footer.css`, Footer 칸은 `.../dist/footer.js`를 불러옵니다 (GitHub Pages).
- `main`에 올리면 1~2분 뒤 Pages가 갱신되고, 방문자 브라우저는 최대 10분(max-age=600) 안에 새 파일을 받습니다. 아임웹 수정·캐시 비우기 필요 없음.

## 빠른 반영 (로더 구조)
- 아임웹이 부르는 `dist/footer.js` 는 작은 로더. 1분 단위로 바뀌는 주소(`main.js?v=…`, `main.css?v=…`)로 실제 코드를 불러옴 → 수정 후 1~2분 안에 반영.
- 빌드: `./build.sh` (src/footer_source.html → dist/main.js, dist/main.css, dist/footer.css)
