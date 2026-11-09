// KO/EN 토글. 영어판이 준비되면 EN 버튼의 disabled를 빼고 /en/ 경로로 연결하면 된다.
(function () {
  var t = document.createElement("div");
  t.className = "toast";
  document.body.appendChild(t);
  document.querySelectorAll(".lang button[data-lang='en']").forEach(function (b) {
    b.parentElement.addEventListener("click", function (e) {
      if (e.target === b || b.contains(e.target)) {
        t.textContent = "English version coming soon";
        t.classList.add("on");
        setTimeout(function () { t.classList.remove("on"); }, 1800);
      }
    });
  });
  // 미리보기용: ?theme=plum / ?theme=blue
  var m = location.search.match(/theme=(\w+)/);
  if (m) document.documentElement.setAttribute("data-theme", m[1]);
})();
