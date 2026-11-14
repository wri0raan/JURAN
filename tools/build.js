// 사용법: node tools/build.js   (저장소 루트에서)
const fs = require("fs");
const path = require("path");
const C = require("./content.ko.js");
const ROOT = path.join(__dirname, "..");

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MISSING = new Set();
const IMG_RE = /\.(jpe?g|png|gif|webp|mp4)$/i;
const scanDir = (key) => { const d = path.join(ROOT, "images", "gallery", key); return fs.existsSync(d) ? fs.readdirSync(d).filter((f) => IMG_RE.test(f)).sort((a, b) => (/\.mp4$/i.test(b) - /\.mp4$/i.test(a)) || (a < b ? -1 : 1)).map((f) => `gallery/${key}/${f}`) : []; };
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
<link rel="icon" href="${p}favicon.ico" sizes="32x32">
<link rel="icon" href="${p}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${p}favicon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="${p}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}assets/site.css?v=${ver("assets/site.css")}">
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
<script src="${p}assets/site.js?v=${ver("assets/site.js")}"></script>
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

const ver = (rel) => { try { return require("crypto").createHash("md5").update(fs.readFileSync(path.join(ROOT, rel))).digest("hex").slice(0, 8); } catch (e) { return "0"; } };
function contactBlock() {
  const items = [];
  if (C.email) items.push(`<a href="mailto:${esc(C.email)}"><small>이메일</small>${esc(C.email)}</a>`);
  items.push(`<a href="https://github.com/${C.github}" rel="noopener"><small>GitHub</small>@${C.github}</a>`);
  if (C.phone) items.push(`<a href="tel:${esc(C.phone.replace(/[^0-9+]/g, ""))}"><small>전화</small>${esc(C.phone)}</a>`);
  if (C.linkedin) items.push(`<a href="${esc(C.linkedin)}" target="_blank" rel="noopener"><small>LinkedIn</small>${esc(C.linkedin.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a>`);
  const ph = arguments[0] || "";
  return `<div class="contact-wrap"><div><div class="contact">${items.join("")}</div></div><figure class="contact-ph"><img src="${ph}images/contact.jpg?v=${ver("images/contact.jpg")}" alt="${esc(C.name)}와 반려견 레오" loading="lazy"></figure><p class="contact-note">연구·협업·인턴 제안 모두 환영합니다.</p></div>`;
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
  <div class="grid wide">${C.projects.filter((x) => x.home).slice(0, 8).map((r) => card(r, "projects", p)).join("")}</div></section>
<section class="sec" id="activities">${sh("03", "활동", "activities.html")}
  <div class="list">${C.activities.map((x) => actRow(x, p)).join("")}</div></section>
<section class="sec" id="studies">${sh("04", "배움", "studies.html", "공학 밖에서 배운 것들")}
  <div class="studies">${C.studies.map((s) => studyCell(s, p)).join("")}</div></section>
<section class="sec" id="contact">${sh("05", "연락")}${contactBlock(p)}</section>`;
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
  const key = `${dir}-${it.slug}`;
  const gl = [...new Set([...(it.gallery || []).filter(has), ...scanDir(key)])];
  const gallery = `<section class="mg" data-key="${key}"><h2 class="mg-h">기록</h2><div class="masonry">${gl.map((g) => /\.mp4$/i.test(g) ? `<div class="mg-v"><video src="${p}images/${g}" autoplay muted loop playsinline preload="metadata"></video></div>` : `<a class="mg-i" href="${p}images/${g}" data-name="${esc(g.split("/").pop())}"><img src="${p}images/${g}" alt="${esc(it.title || it.name)}" loading="lazy"></a>`).join("")}</div></section>`;
  const video = it.video ? `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${it.video}" title="${esc(it.title)} 영상" loading="lazy" allowfullscreen></iframe></div>` : "";
  const embed = it.embed ? `<section class="embed3d" style="padding:0 0 56px"><h2 class="mg-h">${esc(it.embed.title || "3D 목업")}</h2><div class="video" style="aspect-ratio:4/3;min-height:480px;margin-bottom:12px"><iframe src="${p}${esc(it.embed.src)}" title="${esc(it.title)} ${esc(it.embed.title || "3D 목업")}" loading="lazy" allow="fullscreen"></iframe></div>${it.embed.note ? `<p style="font-size:14px;opacity:.75">${esc(it.embed.note)} <a href="${p}${esc(it.embed.full || it.embed.src)}" target="_blank" rel="noopener" style="border-bottom:1px solid">새 창에서 크게 보기 ↗</a></p>` : ""}</section>` : "";
  const meta = (it.meta || []).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("");
  const body = `
<a class="back" href="${p}${dir === "study" ? "studies" : dir}.html">← ${kick} 목록</a>
<div class="dhead"><p class="kick">${esc(it.en || [it.year, it.badge].filter(Boolean).join(" · "))}</p><h1>${esc(it.title || it.name)}</h1><p class="lede">${esc(it.summary)}</p>${(it.links || []).length ? `<div class="btns">${it.links.map(([l, u]) => `<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} ↗</a>`).join("")}</div>` : ""}</div>
<figure class="dhero${it.fit ? " fit" : ""}">${img(it.img, it.title || it.name, p)}</figure>
<div class="dbody">
  <div class="prose">${(it.body || []).map((x) => `<p>${x}</p>`).join("")}${it.why ? `<p class="why">${esc(it.why)}</p>` : ""}${it.link && dir === "study" ? `<p><a href="${p}${it.link}" style="border-bottom:1px solid">관련 작업 보기 →</a></p>` : ""}</div>
  <dl class="meta">${meta}${it.tags ? `<dt>키워드</dt><dd>${it.tags.map(esc).join(" · ")}</dd>` : ""}</dl>
</div>
${video}${gallery}${embed}
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
  <div><figure class="profile" data-profile><img src="images/profile.jpg?v=${ver("images/profile.jpg")}" alt="${esc(C.name)} 프로필 사진" onerror="this.outerHTML='<div class=&quot;ph&quot;><span>프로필 사진</span></div>'"></figure>
  <dl class="meta"><dt>관심 분야</dt>${A.interests.map((x) => `<dd>${esc(x)}</dd>`).join("")}</dl></div>
</div></section>
<section class="sec">${sh("", "경력")}${tl(A.experience)}</section>
<section class="sec">${sh("", "학력")}${tl(A.education.map(([a, b]) => ["", a, b]))}</section>
${A.courses ? `<section class="sec">${sh("", "주요 수강 과목")}${tl(A.courses)}</section>` : ""}
<section class="sec">${sh("", "논문 · 발표")}<div class="tl">${A.pubs.map(([y, ti, au, u]) => `<span class="y">${esc(y)}</span><div><a href="${esc(u)}" target="_blank" rel="noopener"><b>${esc(ti)}</b> <span style="color:var(--acc)">↗</span></a><br><span>${esc(au).replace("김주란", "<u>김주란</u>")}</span></div>`).join("")}</div></section>
<section class="sec">${sh("", "수상")}${tl(A.awards.map(([y, t]) => [y, t]))}</section>
<section class="sec">${sh("", "기술")}${tl(A.skills.map(([k, v]) => [k, v]))}</section>
<section class="sec">${sh("", "공학 밖에서 배운 것", "studies.html")}<div class="studies">${C.studies.map((s) => studyCell(s, "")).join("")}</div></section>
<section class="sec">${sh("", "연락")}${contactBlock("")}</section>`;
  write("about.html", page({ title: `소개 · ${C.name}`, p: "", current: "about.html", body }));
}
write("images/필요한-사진-목록.md", "# 아직 없는 사진\n\n이 이름으로 images/ 폴더에 넣고 `node tools/build.js` 하면 자동으로 들어갑니다.\n\n" + [...MISSING].sort().map((m) => "- " + m).join("\n") + "\n");
console.log("built, missing:", MISSING.size);
