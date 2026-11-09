// 사용법: node tools/build.js   (저장소 루트에서)
const fs = require("fs");
const path = require("path");
const C = require("./content.ko.js");
const ROOT = path.join(__dirname, "..");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MISSING = new Set();
const has = (src) => src && fs.existsSync(path.join(ROOT, "images", src));
function img(src, alt, p) {
  if (has(src)) return `<img src="${p}images/${src}" alt="${esc(alt)}" loading="lazy">`;
  MISSING.add(src);
  return `<div class="ph" role="img" aria-label="${esc(alt)}"><span>${esc(alt)}</span></div><!-- 사진: images/${esc(src || "")} -->`;
}

const NAV = [["research.html", "연구"], ["projects.html", "프로젝트"], ["activities.html", "활동"], ["studies.html", "배움"], ["about.html", "소개"]];

function page({ title, desc, p, current, body }) {
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc || C.heroIntro)}">
<link rel="icon" href="${p}favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}assets/site.css">
</head>
<body>
<header class="top"><div class="wrap">
  <a class="logo" href="${p}index.html">${esc(C.name)}<small>${esc(C.nameEn)}</small></a>
  <nav class="nav" aria-label="주요 메뉴">${NAV.map(([h, l]) => `<a href="${p}${h}"${current === h ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
  <div class="lang" role="group" aria-label="언어"><button aria-pressed="true">KO</button><button data-lang="en" aria-pressed="false" title="준비 중">EN</button></div>
</div></header>
<main class="wrap">
${body}
</main>
<footer><div class="wrap"><span>© ${new Date().getFullYear()} ${esc(C.name)} ${esc(C.nameEn)}</span><a href="https://github.com/${C.github}">github.com/${C.github}</a></div></footer>
<script src="${p}assets/site.js"></script>
</body>
</html>
`;
}

const card = (it, dir, p) => `<a class="card" href="${p}${dir}/${it.slug}.html">
  <div class="im">${img(it.img, it.title, p)}</div>
  <p class="y">${[it.year, it.badge && `<b>${esc(it.badge)}</b>`].filter(Boolean).join(" · ")}</p>
  <h3>${esc(it.title)}</h3><p>${esc(it.summary)}</p>
  ${it.tags ? `<div class="tags">${it.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</div>` : ""}
</a>`;

const actRow = (a, p) => `<a class="row" href="${p}${a.link || `activities/${a.slug}.html`}"><span class="y">${esc(a.year || "—")}</span><span class="t">${esc(a.name)}</span><span class="r">${esc(a.role)}</span>${img(a.img, a.name, p)}</a>`;

const studyCell = (s, p) => `<a href="${p}study/${s.slug}.html"><span class="en">${esc(s.en)}</span><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p></a>`;

const sh = (n, title, more, sub) => `<div class="sh">${n ? `<span class="n">${n}</span>` : ""}<h2>${title}</h2>${sub ? `<p>${sub}</p>` : ""}${more ? `<a class="more" href="${more}">전체 보기 →</a>` : ""}</div>`;

function contactBlock() {
  const items = [];
  if (C.email) items.push(`<a href="mailto:${esc(C.email)}"><small>이메일</small>${esc(C.email)}</a>`);
  items.push(`<a href="https://github.com/${C.github}" rel="noopener"><small>GitHub</small>@${C.github}</a>`);
  return `<div class="contact">${items.join("")}</div>`;
}

function write(rel, html) {
  const f = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

// ---------- home
{
  const p = "";
  const [a, b, c] = C.heroTitle;
  const body = `
<section class="hero">
  <div>
    <p class="kick">VISUAL COMPUTING · ${esc(C.tagline)}</p>
    <h1>${esc(a)}<br><em>${esc(b)}</em><br>${esc(c)}</h1>
    <p class="intro">${esc(C.heroIntro)}</p>
    <p class="now"><span class="dot"></span>${esc(C.heroNow)}</p>
  </div>
  <div class="mosaic">${C.heroTiles.map(([src, cap, href]) => `<a href="${p}${href}">${img(src, cap, p)}<span>${esc(cap)}</span></a>`).join("")}</div>
</section>
<section class="stats">${C.stats.map(([n, u, k, d, href]) => `<a href="${p}${href}"><b>${n}<small>${u}</small></b><span>${esc(k)}</span><em>${esc(d)}</em></a>`).join("")}</section>
<section class="sec" id="research">${sh("01", "연구", "research.html")}
  <div class="grid tall">${C.research.map((r) => card(r, "research", p)).join("")}</div></section>
<section class="sec" id="projects">${sh("02", "프로젝트", "projects.html")}
  <div class="grid wide">${C.projects.filter((x) => x.home).slice(0, 6).map((r) => card(r, "projects", p)).join("")}</div></section>
<section class="sec" id="activities">${sh("03", "활동", "activities.html")}
  <div class="list">${C.activities.map((x) => actRow(x, p)).join("")}</div></section>
<section class="sec" id="studies">${sh("04", "배움", "studies.html", "공학 밖에서 배운 것들")}
  <div class="studies">${C.studies.map((s) => studyCell(s, p)).join("")}</div></section>
<section class="sec" id="contact">${sh("05", "연락")}${contactBlock()}</section>`;
  write("index.html", page({ title: `${C.name} · ${C.nameEn}`, p, current: "", body }));
}

// ---------- list pages
const listPage = (file, title, sub, inner) =>
  write(file, page({ title: `${title} · ${C.name}`, p: "", current: file, body: `<div class="dhead"><p class="kick">${esc(sub)}</p><h1>${title}</h1></div><section class="sec">${inner}</section>` }));
listPage("research.html", "연구", "RESEARCH", `<div class="grid tall">${C.research.map((r) => card(r, "research", "")).join("")}</div>`);
listPage("projects.html", "프로젝트", "PROJECTS", `<div class="grid wide">${C.projects.map((r) => card(r, "projects", "")).join("")}</div>`);
listPage("activities.html", "활동", "ACTIVITIES", `<div class="list">${C.activities.map((x) => actRow(x, "")).join("")}</div>`);
listPage("studies.html", "배움", "공학 밖에서 배운 것들",
  `<p class="prose" style="max-width:720px;margin-bottom:36px;color:var(--body)">가상 공간과 옷, 움직임을 제대로 만들고 싶어서 공학 밖의 수업들도 찾아 들었습니다. 지금 하는 연구의 관심이 어디서 왔는지 보여주는 기록입니다.</p>
   <div class="studies">${C.studies.map((s) => studyCell(s, "")).join("")}</div>`);

// ---------- detail pages
function detail(dir, list, it, i, kick) {
  const p = "../";
  const prev = list[i - 1], next = list[i + 1];
  const href = (x) => (x.link && dir === "activities" ? p + x.link : `${x.slug}.html`);
  (it.gallery || []).filter((g) => !has(g)).forEach((g) => MISSING.add(g));
  const gl = (it.gallery || []).filter(has);
  const gallery = gl.length ? `<div class="gallery${it.fit ? " fit" : ""}">${gl.map((g) => img(g, it.title || it.name, p)).join("")}</div>` : "";
  const video = it.video ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${it.video}" title="${esc(it.title)} 영상" loading="lazy" allowfullscreen></iframe></div>` : "";
  const meta = (it.meta || []).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  const body = `
<a class="back" href="${p}${dir === "study" ? "studies" : dir}.html">← ${kick} 목록</a>
<div class="dhead"><p class="kick">${esc(it.en || [it.year, it.badge].filter(Boolean).join(" · "))}</p><h1>${esc(it.title || it.name)}</h1><p class="lede">${esc(it.summary)}</p>${(it.links || []).length ? `<div class="btns">${it.links.map(([l, u]) => `<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("")}</div>` : ""}</div>
<figure class="dhero${it.fit ? " fit" : ""}">${img(it.img, it.title || it.name, p)}</figure>
<div class="dbody">
  <div class="prose">${(it.body || []).map((x) => `<p>${x}</p>`).join("")}${it.why ? `<p class="why">${esc(it.why)}</p>` : ""}${it.link && dir === "study" ? `<p><a href="${p}${it.link}" style="border-bottom:1px solid">관련 작업 보기 →</a></p>` : ""}</div>
  <dl class="meta">${meta}${it.tags ? `<dt>키워드</dt><dd>${it.tags.map(esc).join(" · ")}</dd>` : ""}</dl>
</div>
${video}${gallery}
<nav class="pager">${prev ? `<a href="${href(prev)}">← 이전<b>${esc(prev.title || prev.name)}</b></a>` : "<span></span>"}${next ? `<a href="${href(next)}" style="text-align:right">다음 →<b>${esc(next.title || next.name)}</b></a>` : ""}</nav>`;
  write(`${dir}/${it.slug}.html`, page({ title: `${it.title || it.name} · ${C.name}`, desc: it.summary, p, current: dir === "study" ? "studies.html" : `${dir}.html`, body }));
}
C.research.forEach((it, i, a) => detail("research", a, it, i, "연구"));
C.projects.forEach((it, i, a) => detail("projects", a, it, i, "프로젝트"));
C.activities.filter((x) => !x.link).forEach((it, i, a) => detail("activities", a, it, i, "활동"));
C.studies.forEach((it, i, a) => detail("study", a, it, i, "배움"));

// ---------- about
{
  const A = C.about;
  const tl = (rows) => `<div class="tl">${rows.map((r) => `<span class="y">${esc(r[0])}</span><div><b>${esc(r[1])}</b>${r[2] ? `<br><span>${esc(r[2])}</span>` : ""}</div>`).join("")}</div>`;
  const body = `
<div class="dhead"><p class="kick">ABOUT</p><h1>소개</h1></div>
<section class="sec"><div class="dbody" style="padding:0">
  <div class="prose"><p class="about-lead">${esc(A.lead)}</p>${A.story.map((s) => `<p>${esc(s)}</p>`).join("")}<p style="color:var(--mute);font-size:15px">${esc(A.early)}</p></div>
  <dl class="meta"><dt>관심 분야</dt>${A.interests.map((x) => `<dd>${esc(x)}</dd>`).join("")}</dl>
</div></section>
<section class="sec">${sh("", "경력")}${tl(A.experience)}</section>
<section class="sec">${sh("", "학력")}${tl(A.education.map(([a, b]) => ["", a, b]))}</section>
<section class="sec">${sh("", "논문 · 발표")}<div class="tl">${A.pubs.map(([y, ti, au, u]) => `<span class="y">${esc(y)}</span><div><a href="${esc(u)}" target="_blank" rel="noopener"><b>${esc(ti)}</b> <span style="color:var(--acc)">↗</span></a><br><span>${esc(au).replace("김주란", "<u>김주란</u>")}</span></div>`).join("")}</div></section>
<section class="sec">${sh("", "수상")}${tl(A.awards.map(([y, t]) => [y, t]))}</section>
<section class="sec">${sh("", "기술")}${tl(A.skills.map(([k, v]) => [k, v]))}</section>
<section class="sec">${sh("", "공학 밖에서 배운 것", "studies.html")}<div class="studies">${C.studies.map((s) => studyCell(s, "")).join("")}</div></section>
<section class="sec">${sh("", "연락")}${contactBlock()}</section>`;
  write("about.html", page({ title: `소개 · ${C.name}`, p: "", current: "about.html", body }));
}
write("images/필요한-사진-목록.md", "# 아직 없는 사진\n\n이 이름으로 images/ 폴더에 넣고 `node tools/build.js` 하면 자동으로 들어갑니다.\n\n" + [...MISSING].sort().map((m) => "- " + m).join("\n") + "\n");
console.log("built, missing:", MISSING.size);
