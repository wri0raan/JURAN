# 인수인계 · 포트폴리오 사이트 (JURAN)

> 새 채팅에서 이 파일을 통째로 붙여넣거나 첨부하고 "이어서 작업하자"라고 하면 됩니다.
> 작성: 2026-11-14 · 마지막 커밋 `1dac7e4` (main)

---

## 1. 기본 정보

| 항목 | 내용 |
|---|---|
| 사이트 | https://wri0raan.github.io/JURAN/ |
| 저장소 | `wri0raan/juran` (GitHub, public) · 배포 브랜치 `main` (GitHub Pages) · 작업 브랜치 `ko-redesign`도 같이 push |
| 사용자 | 김주란 (Juran Kim). 반말로 편하게 대화, 직설적인 의견 선호, Claude를 "로드"라고 부름 |
| 공개 이메일 | **juranisworking@gmail.com** (계정 이메일 wri0raan@gmail.com 은 사이트에 쓰지 말 것) |
| 전화번호 | **사이트에 넣지 않기로 결정** (넣었다가 뺐음) |
| 링크드인 | 아직 미제공 |

---

## 2. 구조 (정적 사이트 생성기)

```
tools/content.ko.js   ← 모든 내용(한국어). 여기만 고치면 됨
tools/build.js        ← node tools/build.js 로 전체 HTML 생성
assets/site.css       ← 스타일 (코발트 + Paperlogy 폰트, 최대 폭 1440px)
assets/site.js        ← 언어 토글, 라이트박스, 기록 갤러리 로더, 편집 모드
images/               ← 대표 이미지 (항목의 img 필드)
images/gallery/<구분>-<slug>/   ← 상세 페이지 하단 '기록' 갤러리 (자동 masonry)
papers/               ← 논문 PDF (사이트에서 바로 열림)
favicon.svg / .ico / favicon-192.png / apple-touch-icon.png
```

- 생성되는 페이지: `index, research, projects, activities, studies, about` + 상세 `research/ projects/ activities/ study/`
- 갤러리 폴더 이름 규칙: `research-<slug>`, `projects-<slug>`, `activities-<slug>`, `study-<slug>`
  - jpg/png/gif/webp 는 이미지, **mp4 는 자동재생(무음 반복) 영상**으로 들어감 (맨 앞에 배치)
- 홈 화면 노출: 항목에 `home: true` (프로젝트는 최대 8개)
- 링크 버튼: `links: [["라벨", "URL"]]` · 상세 페이지는 한 단계 아래라 사이트 내부 파일은 `../papers/...` 처럼 씀
- 유튜브: `video: "영상ID"`
- CSS/JS/프로필 사진에 `?v=해시` 자동 부착 → 폰 캐시 문제 해결됨
- 편집 모드: 사이트 주소 뒤 `?edit` → GitHub 토큰(본인 브라우저에만 저장)으로 사진 업로드 가능. `?noedit` 로 끔

### 작업 흐름
```bash
git clone https://github.com/wri0raan/juran.git && cd juran
# (얕은 클론이면) git config remote.origin.fetch "+refs/heads/*:refs/remotes/origin/*"
# content.ko.js 수정 → 이미지 넣기
node tools/build.js          # "built, missing: N" = 대표 이미지 없는 항목 수
git add -A && git commit -m "..." && git push origin HEAD:main HEAD:ko-redesign
```
이미지는 긴 변 1400–1600px, JPEG 품질 82–86 정도로 줄여서 넣음 (HEIC 는 pillow-heif 로 변환).

---

## 3. 현재 내용 (항목 slug)

- **연구**: gait(졸업논문, 반려견 보행 3D 복원) · animatronics(공저자, PDF 직접 보기 + 해파리 시뮬 영상 2개) · crowd-sim(KCGS 2025 포스터) · xr-cafe(1저자, HCI Korea 창의상 우수상)
- **프로젝트**: acupoint(AI 실시간 트래킹, 국립 전시) · xr-spatial(CoSpace, 쿼레이트 1인 개발) · sangun(산군) · deep-learning-cg · tiniping(DreamBooth) · maeum-songil(마음손길, 본인=개발·외형 설계·시제품) · wordchain · code-black(GitHub 링크) · frozen-murder(유튜브) · song-for-my-dog(영상) · insaenghak(인생학 이수)
- **활동**: cucg · siggraph-2024 · siggraph-2022(둘 다 "학생 자원봉사자(SV) 선발") · gstar-2024(학과 탐방대) · lul · raons(회장, 부천시 청년 커뮤니티 지원 프로젝트 선정 2022–2023) · aristotellers · annyeong-korea(KOREA FESTA 2021) · statist(부회장, 블루패스 포함) · nvidia-dli · gdgoc
- **배움**: color · fashion · cad(애플스토어 포스터 포함) · drafting · storyboard · artwork · maya(이름 "Maya 및 Houdini", 메롱해치를 여기로 옮김)
- **소개**: 프로필 사진(전신, 보정본, 원본 비율) · 연락 섹션 사진(상반신 보정본, 링크 아래) · 학력은 가톨릭대 1줄만 · 어릴 때 이야기(영재원·LED 큐브/POV·센서 피아노·지질학회·창의력 챔피언 4회)는 본문 문단에 · AI 수업(인공지능입문·기계학습·영상처리)은 소개 본문 한 문장으로만

### 삭제한 것 (다시 넣지 말 것)
노코드 웹빌더 · 108초 명상 영상 · 튼튼 용기 · 주요 수강 과목 섹션 · 학력의 고교·영재원 · 전화번호 · 메롱해치 프로젝트(→배움으로 이동)

---

## 4. 확정된 결정 · 주의

- 애니메트로닉스는 **공저자** (제1저자 아님. 공동 1저자 주장은 교수님 확인 전엔 쓰지 않기)
- XR 카페 가상 점원은 **CG 캐릭터** (실제 배우 합성 아님)
- 군중 시뮬 갤러리 마지막 이미지는 연구실 관련 연구(KCGS 2024, 본인 저자 아님) — 본문에 밝혀둠
- 티니핑: DreamBooth 맞음. 실제 티니핑 이미지로 학습한 결과물이지만 **이미지 그대로 두기로 결정** (비상업)
- 장학금 금액·가계곤란 장학금은 표기 안 함
- 저작권: 영화 스틸·노래 가사·악보 이미지는 넣지 않음. 영상은 음악 저작권 때문에 소리 제거해서 넣음
- 파비콘: 코발트 물방울 + 하트 (모바일용 PNG/ICO 까지 적용 완료)

---

## 5. 남은 일

1. **대표 이미지 없는 5곳**: acupoint · cospace · wordchain · aristotellers · nvidia-dli → 사진 받으면 `images/<이름>.jpg` 로 넣고 빌드
2. **아이클라우드 사진 분류 (사용자가 직접)**: 공유 링크 https://share.icloud.com/photos/00agrvdbya99DAZs5fTlZVf5w (772장)
   - 다운로드 폴더 `포폴_사진목록/` 에 번호 붙은 목록 이미지 19장 있음 (초록 테두리 = 이미 사이트에 들어감)
   - 사용자가 번호로 분류해 주거나, 전체 zip 을 받아 폴더별로 정리하면 → 해당 갤러리에 넣기
   - **GDGoC 사진과 랩실(CUCG) 사진이 섞여 있음** (2025.3–2026.11, 목록 16–18번) → 사용자 분류 대기
   - GDGoC '반죽뭉치' 케이크 사진(#746)은 팀원 얼굴 노출 → 사용자 확인 대기
3. **아직 못 받은 정보**: 링크드인 URL · XR 대외활동(이름·주최·시기) · 아리랑스쿨 기자단/NVIDIA 사진
4. **메롱해치 유튜브 영상** (`-GtqxkJ3Nro`) — 배움 페이지에 영상 넣는 기능 원하면 build.js 의 study 상세에 video 지원 추가
5. 영어(EN) 버전은 아직 "coming soon"
6. 별도 진행 중: KAIRI 연구 인턴 지원서 (마감 11.15), 다운로드 폴더 `인수인계_자소서_KAIRI_AIGEN.md` 참고

---

## 6. 작업 요령 (막혔던 것들)

- 작업 공간에서 노션 S3·wixstatic·아이클라우드는 직접 접근이 막힘 → **사용자 컴퓨터 연결 + 내장 브라우저** 사용
  - 내장 브라우저로 해당 사이트를 연 뒤, 페이지 안에서 fetch 로 여러 파일을 하나의 묶음(blob)으로 만들고 **링크를 클릭**해서 다운로드 폴더에 저장 → stage 해서 가져옴 (자동 다운로드 여러 개는 차단되고, 클릭 1회는 통과)
  - 노션 파일: Notion 커넥터로 페이지 fetch → `get_file_download_urls`(5분 유효) → 그 S3 주소 하나를 브라우저 탭으로 열고 같은 출처에서 나머지를 fetch
  - 아이클라우드 공유: `ckdatabasews.icloud.com .../records/resolve` 로 토큰 받고 `records/query` (recordType `CPLAssetAndMasterByAssetDate`, continuationMarker 페이지네이션)
- stage 한도: 파일당 400MB, 호출당 50개·500MB → 큰 zip 은 사용자가 컴퓨터에서 압축 풀어줘야 함
- 노션 내보내기 원본 7.4GB zip 이 다운로드 폴더에 있음 (2023-2학기까지 수강 강의) — 필요한 건 노션 커넥터로 직접 꺼내는 게 빠름
- 다운로드 폴더 임시 파일(`p2.bin`, `icloud_pack.bin`, `*.tmp`)은 지워도 됨
