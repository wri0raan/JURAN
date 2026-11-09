// Juran Kim 포트폴리오 — 언어 토글, 기록 갤러리, 편집 모드(사진 업로드)
(function () {
  var REPO = "wri0raan/juran", BRANCH = "main";
  var API = "https://api.github.com/repos/" + REPO + "/contents/";
  var IMG_RE = /\.(jpe?g|png|gif|webp)$/i;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} }
  };
  // 사이트 루트 경로 (상세 페이지는 ../)
  var root = (document.querySelector('link[rel="stylesheet"][href*="assets/site.css"]') || {}).getAttribute
    ? document.querySelector('link[href*="assets/site.css"]').getAttribute("href").replace("assets/site.css", "") : "";

  // ---------- 토스트 / 언어
  var toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);
  function say(msg, ms) {
    toast.textContent = msg; toast.classList.add("on");
    clearTimeout(say.t); say.t = setTimeout(function () { toast.classList.remove("on"); }, ms || 1800);
  }
  document.querySelectorAll(".lang button[data-lang='en']").forEach(function (b) {
    b.parentElement.addEventListener("click", function (e) {
      if (e.target === b) say("English version coming soon");
    });
  });
  var m = location.search.match(/theme=(\w+)/);
  if (m) document.documentElement.setAttribute("data-theme", m[1]);

  // ---------- 라이트박스
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML = '<img alt=""><button class="x" aria-label="닫기">×</button><button class="pv" aria-label="이전">‹</button><button class="nx" aria-label="다음">›</button>';
  document.body.appendChild(lb);
  var lbList = [], lbIdx = 0;
  function lbShow(i) { lbIdx = (i + lbList.length) % lbList.length; lb.querySelector("img").src = lbList[lbIdx]; lb.classList.add("on"); }
  lb.addEventListener("click", function (e) {
    if (e.target.classList.contains("pv")) lbShow(lbIdx - 1);
    else if (e.target.classList.contains("nx")) lbShow(lbIdx + 1);
    else lb.classList.remove("on");
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("on")) return;
    if (e.key === "Escape") lb.classList.remove("on");
    if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    if (e.key === "ArrowRight") lbShow(lbIdx + 1);
  });
  function bindGallery(sec) {
    var items = sec.querySelectorAll(".mg-i");
    sec.classList.toggle("has", items.length > 0);
    items.forEach(function (a, i) {
      a.onclick = function (e) {
        e.preventDefault();
        lbList = Array.prototype.map.call(sec.querySelectorAll(".mg-i"), function (x) { return x.getAttribute("href"); });
        lbShow(i);
      };
    });
  }
  function addItem(sec, url, name) {
    var a = document.createElement("a");
    a.className = "mg-i"; a.href = url; a.setAttribute("data-name", name);
    a.innerHTML = '<img loading="lazy" alt="">';
    a.firstChild.src = url;
    sec.querySelector(".masonry").appendChild(a);
  }

  // ---------- 기록 갤러리: 저장소 폴더에 새로 올라온 사진도 자동으로 불러오기
  var galleries = document.querySelectorAll(".mg[data-key]");
  galleries.forEach(function (sec) {
    bindGallery(sec);
    var key = sec.getAttribute("data-key");
    fetch(API + "images/gallery/" + key + "?ref=" + BRANCH)
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (files) {
        if (!Array.isArray(files)) return;
        var have = {};
        sec.querySelectorAll(".mg-i").forEach(function (a) { have[a.getAttribute("data-name")] = 1; });
        files.filter(function (f) { return f.type === "file" && IMG_RE.test(f.name) && !have[f.name]; })
          .sort(function (a, b) { return a.name < b.name ? -1 : 1; })
          .forEach(function (f) { addItem(sec, f.download_url, f.name); });
        bindGallery(sec);
      })
      .catch(function () {});
  });

  // ---------- 편집 모드 (주소 뒤에 ?edit 를 붙여 한 번 들어가면 이 브라우저에서 계속 켜짐)
  if (/[?&]edit\b/.test(location.search)) store.set("jk_edit", "1");
  if (/[?&]noedit\b/.test(location.search)) { store.set("jk_edit", null); store.set("jk_token", null); }
  if (store.get("jk_edit") !== "1") return;

  var bar = document.createElement("div");
  bar.className = "ed-bar";
  document.body.appendChild(bar);
  function renderBar() {
    var tok = store.get("jk_token");
    bar.innerHTML = tok
      ? '<b>편집 모드</b><span>사진을 올리면 1~2분 뒤 모든 방문자에게 보여요.</span><button data-a="logout">토큰 지우기</button><button data-a="off">편집 모드 끄기</button>'
      : '<b>편집 모드</b><input type="password" placeholder="GitHub 토큰 붙여넣기 (이 브라우저에만 저장)"><button data-a="save">저장</button><button data-a="off">끄기</button>';
  }
  bar.addEventListener("click", function (e) {
    var a = e.target.getAttribute("data-a");
    if (a === "save") { var v = bar.querySelector("input").value.trim(); if (v) { store.set("jk_token", v); renderBar(); say("토큰 저장됨"); } }
    if (a === "logout") { store.set("jk_token", null); renderBar(); }
    if (a === "off") { store.set("jk_edit", null); bar.remove(); document.querySelectorAll(".ed-add,.ed-status").forEach(function (x) { x.remove(); }); galleries.forEach(function (s) { s.classList.remove("editing"); }); }
  });
  renderBar();

  // 사진 줄이기: 긴 변 1800px, JPEG
  function shrink(file) {
    return new Promise(function (res, rej) {
      if (/gif$/i.test(file.type)) { var fr = new FileReader(); fr.onload = function () { res({ b64: fr.result.split(",")[1], ext: "gif" }); }; fr.onerror = rej; fr.readAsDataURL(file); return; }
      var img = new Image();
      img.onload = function () {
        var s = Math.min(1, 1800 / Math.max(img.width, img.height));
        var c = document.createElement("canvas");
        c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        res({ b64: c.toDataURL("image/jpeg", 0.85).split(",")[1], ext: "jpg" });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = rej;
      img.src = URL.createObjectURL(file);
    });
  }
  function put(pathInRepo, b64, msg) {
    var headers = { Authorization: "Bearer " + store.get("jk_token"), Accept: "application/vnd.github+json" };
    return fetch(API + pathInRepo + "?ref=" + BRANCH, { headers: headers })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (old) {
        var body = { message: msg, content: b64, branch: BRANCH };
        if (old && old.sha) body.sha = old.sha;
        return fetch(API + pathInRepo, { method: "PUT", headers: headers, body: JSON.stringify(body) });
      })
      .then(function (r) {
        if (!r.ok) return r.json().then(function (j) { throw new Error(j.message || r.status); });
        return r.json();
      });
  }
  function picker(multiple, onFiles) {
    var inp = document.createElement("input");
    inp.type = "file"; inp.accept = "image/*"; inp.multiple = multiple;
    inp.onchange = function () { if (inp.files.length) onFiles(Array.prototype.slice.call(inp.files)); };
    inp.click();
  }
  function needToken() { if (!store.get("jk_token")) { say("먼저 아래 편집 바에 토큰을 넣어주세요", 2600); return true; } }

  // 기록 갤러리에 여러 장 추가
  galleries.forEach(function (sec) {
    sec.classList.add("editing");
    var key = sec.getAttribute("data-key");
    var btn = document.createElement("button");
    btn.className = "ed-add"; btn.textContent = "+ 사진 여러 장 추가";
    var st = document.createElement("p"); st.className = "ed-status";
    sec.insertBefore(st, sec.querySelector(".masonry"));
    sec.insertBefore(btn, st);
    btn.onclick = function () {
      if (needToken()) return;
      picker(true, function (files) {
        var done = 0, stamp = Date.now();
        st.textContent = "0 / " + files.length + " 올리는 중…";
        files.reduce(function (chain, f, i) {
          return chain.then(function () {
            return shrink(f).then(function (o) {
              var name = stamp + "-" + String(i + 1).padStart(2, "0") + "." + o.ext;
              return put("images/gallery/" + key + "/" + name, o.b64, "기록 사진 추가: " + key).then(function (j) {
                addItem(sec, j.content.download_url, name);
                bindGallery(sec);
                st.textContent = (++done) + " / " + files.length + " 올림";
              });
            });
          });
        }, Promise.resolve()).then(function () {
          st.textContent = files.length + "장 올림 · 1~2분 뒤 사이트에 반영돼요";
        }).catch(function (e) { st.textContent = "올리기 실패: " + e.message; });
      });
    };
  });

  // 소개 페이지 프로필 사진
  var prof = document.querySelector("[data-profile]");
  if (prof) {
    var pb = document.createElement("button");
    pb.className = "ed-add"; pb.textContent = "프로필 사진 바꾸기";
    prof.parentNode.insertBefore(pb, prof.nextSibling);
    pb.onclick = function () {
      if (needToken()) return;
      picker(false, function (files) {
        pb.textContent = "올리는 중…";
        shrink(files[0]).then(function (o) { return put("images/profile.jpg", o.b64, "프로필 사진 변경"); })
          .then(function (j) {
            prof.innerHTML = '<img alt="프로필 사진">';
            prof.firstChild.src = j.content.download_url + "?t=" + Date.now();
            pb.textContent = "바뀜 · 1~2분 뒤 반영";
          })
          .catch(function (e) { pb.textContent = "실패: " + e.message; });
      });
    };
  }
})();
