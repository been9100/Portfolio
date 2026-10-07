/* ==========================================================================
   Hyebin Lee Portfolio — 동작 스크립트
   1) 테마 토글 (html.dark + localStorage)
   2) 히어로 타이틀 로테이션 (7개 언어, blur 전환)
   3) 프로젝트 갤러리 렌더 + 카드 캐러셀 (클릭/스와이프/도트)
   4) 풀와이드 영상 카드 진행바
   ========================================================================== */

/* ---------- 1. 테마 ---------- */
(function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (saved === "dark" || (!saved && prefersDark)) root.classList.add("dark");

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const icon = btn.querySelector(".theme-btn__icon");
      if (icon) {
        icon.style.opacity = "0";
        icon.style.filter = "blur(4px)";
        icon.style.transform = "scale(0.9)";
      }
      setTimeout(() => {
        const isDark = root.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        if (icon) {
          icon.style.opacity = "";
          icon.style.filter = "";
          icon.style.transform = "";
        }
      }, 200);
    });
  });
})();

/* ---------- 2. 히어로 타이틀 로테이션 ----------
   [data-rotator] 요소마다 돌아간다. data-items / data-langs(JSON 배열)가 있으면 그 목록을,
   없으면 Work 페이지 기본 목록("一些精选" …)을 쓴다. */
(function initRotators() {
  const DEFAULT_ITEMS = [
    "一些精选",
    "選りすぐりの作品",
    "Some Selections",
    "몇 작업들",
    "Ausgewählte Werke",
    "Избранные работы",
    "Yīxiē jīngxuǎn",
  ];
  const DEFAULT_LANGS = ["zh", "ja", "en", "ko", "de", "ru", "zh-Latn"];

  document.querySelectorAll("[data-rotator]").forEach((el) => {
    let items = DEFAULT_ITEMS;
    let langs = DEFAULT_LANGS;
    try {
      if (el.dataset.items) items = JSON.parse(el.dataset.items);
      if (el.dataset.langs) langs = JSON.parse(el.dataset.langs);
    } catch (e) { /* 잘못된 JSON이면 기본 목록 사용 */ }
    if (!items.length) return;

    // 전환 주기(ms): data-interval로 요소별 조정, 기본 3200
    const interval = parseInt(el.dataset.interval, 10) || 3200;

    let i = 0;
    el.textContent = items[i];
    if (langs[i]) el.setAttribute("lang", langs[i]);

    setInterval(() => {
      el.classList.add("is-out");
      setTimeout(() => {
        i = (i + 1) % items.length;
        el.textContent = items[i];
        if (langs[i]) el.setAttribute("lang", langs[i]);
        // 전환 없이 즉시 '아래쪽·투명' 상태로 점프시킨 뒤, 다음 프레임에 전환을 켜고 제자리로 올라오게 한다.
        el.style.transition = "none";
        el.classList.remove("is-out");
        el.classList.add("is-in");
        void el.offsetWidth; // 리플로우로 즉시 상태 반영
        el.style.transition = "";
        requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove("is-in")));
      }, 500);
    }, interval);
  });
})();

/* ---------- 3. 갤러리 데이터 ----------
   슬라이드 타입:
     { type: "image", src: "...", alt: "..." }
     { type: "video", src: "....mp4", poster: "....jpg" }   // 카드 안에서 hover 재생
     { type: "player", src: "....mp4", poster: "..." }      // 풀와이드 자동 재생 + 진행바
     { type: "color", value: "linear-gradient(...)" }       // 플레이스홀더
   span: "1" | "wide"(md 2칸, sm 전체) | "full"(전체 폭)
   ratio: CSS aspect-ratio 값 (md 이상에서 적용, full 카드는 항상 적용)
   href: 있으면 카드 전체가 상세 페이지 링크가 되고 캐러셀 대신 첫 슬라이드만 표시
   text: "dark"면 밝은 이미지용으로 캡션·태그·도트·화살표를 검정 계열로 표시
------------------------------------------------------------------------ */
const PROJECTS = [
  {
    title: "Next Channel Platform UX·UI Build", client: "S Company", href: "next-platform.html", tags: ["UX Consulting", "Design System", "AI"],
    span: "1", ratio: "4/5",
    slides: [
      { type: "image", src: "images/next-platform/next-platform-card-01.jpg" },
      { type: "color", value: "linear-gradient(160deg,#1b1b1f,#0c0c0e)" },
    ],
  },
  {
    title: "SK Telecom T Universe UX·UI Build", client: "SK Telecom", href: "t-universe.html", text: "dark", tags: ["UXUI", "Design System"],
    span: "1", ratio: "4/5",
    slides: [
      { type: "image", src: "images/t-universe/t-universe-card-01.jpg" },
      { type: "color", value: "linear-gradient(180deg,#a11210,#7a0c0a)" },
      { type: "color", value: "#9d100e" },
      { type: "color", value: "linear-gradient(200deg,#c2160f,#8a0d0b)" },
      { type: "color", value: "#8b0e0c" },
      { type: "color", value: "linear-gradient(180deg,#b3120f,#6e0a09)" },
    ],
  },
  {
    title: "MUSINSA UX·UI Build", client: "MUSINSA", href: "musinsa.html", tags: ["Design System", "UXUI"],
    span: "1", ratio: "4/5",
    slides: [{ type: "image", src: "images/musinsa/musinsa-card-01.jpg" }],
  },
  {
    title: "Midea Built-In Oven AI Flow UX·UI Build", client: "MIDEA", tags: ["AI Flow", "GUI", "Prototyping"],
    href: "midea-oven.html",
    span: "1", ratio: "4/5",
    slides: [
      { type: "image", src: "images/midea-oven/midea-oven-card-01.jpg" },
      { type: "image", src: "images/midea-oven/midea-oven-card-02.jpg" },
      { type: "image", src: "images/midea-oven/midea-oven-card-03.jpg" },
      { type: "image", src: "images/midea-oven/midea-oven-card-04.jpg" },
    ],
  },
  {
    title: "Naver Plus Store Campaign Build", client: "NAVER", tags: ["Promotion", "Responsive Web"],
    span: "wide", ratio: "4/5",
    slides: [
      { type: "image", src: "images/naver-plus-store/naver-plus-store-card-01.jpg" },
      { type: "image", src: "images/naver-plus-store/naver-plus-store-card-02.jpg" },
      { type: "image", src: "images/naver-plus-store/naver-plus-store-card-03.jpg" },
      { type: "image", src: "images/naver-plus-store/naver-plus-store-card-04.jpg" },
    ],
  },
  {
    title: "Handsome EQL UX·UI Build", client: "HANDSOME", text: "dark", tags: ["UXUI", "Commerce"],
    span: "1", ratio: "4/5",
    slides: [
      { type: "image", src: "images/eql/eql-card-01.jpg" },
      { type: "image", src: "images/eql/eql-card-02.jpg" },
      { type: "image", src: "images/eql/eql-card-03.jpg" },
      { type: "image", src: "images/eql/eql-card-04.jpg" },
    ],
  },
  {
    title: "NICE Holdings Responsive Website UX·UI Build", client: "NICE HOLDINGS", tags: ["Web Design", "Dev Guide"],
    span: "1", ratio: "4/5",
    slides: [
      { type: "image", src: "images/nice/nice-card-01.jpg" },
      { type: "image", src: "images/nice/nice-card-02.jpg" },
      { type: "image", src: "images/nice/nice-card-03.jpg" },
      { type: "image", src: "images/nice/nice-card-04.jpg" },
    ],
  },
  {
    title: "Kakao Corporate Responsive Website UX·UI Build", client: "KAKAO", tags: ["Web Design", "Design System"],
    span: "1", ratio: "4/5",
    slides: [
      { type: "image", src: "images/kakao/kakao-card-01.jpg" },
      { type: "image", src: "images/kakao/kakao-card-02.jpg" },
      { type: "image", src: "images/kakao/kakao-card-03.jpg" },
      { type: "image", src: "images/kakao/kakao-card-04.jpg" },
    ],
  },
];

/* ---------- 3-1. 갤러리 렌더 ---------- */
const ICON_PREV =
  '<svg viewBox="0 0 256 256" aria-hidden="true"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"/></svg>';
const ICON_NEXT =
  '<svg viewBox="0 0 256 256" aria-hidden="true"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"/></svg>';

function slideMarkup(slide, project, index) {
  const alt = `${project.title} ${index + 1}`;
  switch (slide.type) {
    case "image":
      return `<div class="slide__media"><img src="${slide.src}" alt="${alt}" loading="lazy" decoding="async"></div>`;
    case "video":
      return `<div class="slide__media"><video src="${slide.src}" poster="${slide.poster || ""}" loop muted playsinline preload="metadata"></video></div>`;
    case "player":
      return `<div class="slide__media"><video src="${slide.src}" poster="${slide.poster || ""}" loop muted autoplay playsinline preload="metadata" data-player></video></div>`;
    case "player-color":
    case "color":
    default:
      return `<div class="slide__media"><div class="slide__ph" style="--ph:${slide.value}" data-label="${alt}"></div></div>`;
  }
}

function renderGallery() {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  gallery.innerHTML = PROJECTS.map((p, pi) => {
    const spanCls = p.span === "wide" ? " card--wide" : p.span === "full" ? " card--full" : "";
    const linked = !!p.href;
    const slidesData = linked ? p.slides.slice(0, 1) : p.slides;
    const multi = slidesData.length > 1;
    const isPlayer = !linked && (p.slides[0].type === "player" || p.slides[0].type === "player-color");

    const slides = slidesData.map((s, si) => `<div class="slide">${slideMarkup(s, p, si)}</div>`).join("");

    const nav = multi
      ? `<button type="button" class="card__nav card__nav--prev" aria-label="이전 슬라이드" data-prev>${ICON_PREV}</button>
         <button type="button" class="card__nav card__nav--next" aria-label="다음 슬라이드" data-next>${ICON_NEXT}</button>
         <div class="card__dots">${slidesData
           .map((_, si) => `<button type="button" class="card__dot${si === 0 ? " is-active" : ""}" aria-label="${si + 1}번 슬라이드로 이동" data-dot="${si}"></button>`)
           .join("")}</div>`
      : "";

    const progress = isPlayer ? `<div class="card__progress" aria-hidden="true"><span data-progress></span></div>` : "";

    const tags = p.tags.map((t) => `<span class="tag">${t}</span>`).join("");

    // 상세 페이지가 있는 카드는 전체를 링크로 감싼다
    const linkOpen = linked ? `<a class="card__link" href="${p.href}" aria-label="${p.title} 상세 보기"></a>` : "";
    const hint = linked ? `<span class="card__hint" aria-hidden="true">View project ${ICON_NEXT}</span>` : "";

    return `
<div class="card${spanCls}${linked ? " card--linked" : ""}${p.text === "dark" ? " card--dark-text" : ""}" style="--ratio:${p.ratio}" data-card>
  <div class="card__viewport">
    <div class="card__clip">
      <div class="card__track" data-track>${slides}</div>
    </div>
    ${nav}
    ${progress}
    ${linkOpen}
    ${hint}
  </div>
  <figure class="card__caption">
    <div class="card__meta">
      <figcaption class="card__title">${p.title}</figcaption>
      <figcaption class="card__client">${p.client}</figcaption>
    </div>
    <figcaption class="card__tags">${tags}</figcaption>
  </figure>
</div>`;
  }).join("");

  gallery.querySelectorAll("[data-card]").forEach(initCarousel);
  initPlayers(gallery);
  initReveal(gallery);
}

/* ---------- 3-3. 스크롤 진입 리빌 ---------- */
function initReveal(scope) {
  const cards = scope.querySelectorAll("[data-card]");
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c) => c.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        // 같은 행에서 살짝 순차 등장
        const idx = [...cards].indexOf(e.target);
        e.target.style.transitionDelay = `${(idx % 3) * 0.09}s`;
        // 등장이 끝나면 delay 제거 → hover 스케일이 즉시 반응
        e.target.addEventListener("transitionend", () => { e.target.style.transitionDelay = ""; }, { once: true });
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      });
    },
    { rootMargin: "0px 0px 8% 0px", threshold: 0.01 }
  );
  cards.forEach((c) => io.observe(c));
}

/* ---------- 3-2. 카드 캐러셀 ---------- */
function initCarousel(card) {
  const track = card.querySelector("[data-track]");
  const slides = track.children;
  const dots = card.querySelectorAll("[data-dot]");
  const n = slides.length;
  if (n <= 1) return;

  let index = 0;
  const go = (to) => {
    index = (to + n) % n;
    track.style.transform = `translate3d(${-index * 100}%,0,0)`;
    dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
    // 현재 슬라이드의 video만 재생
    [...slides].forEach((s, k) => {
      const v = s.querySelector("video");
      if (!v) return;
      if (k === index) v.play().catch(() => {});
      else v.pause();
    });
  };

  card.querySelector("[data-prev]").addEventListener("click", () => go(index - 1));
  card.querySelector("[data-next]").addEventListener("click", () => go(index + 1));
  dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.dot)));

  // 스와이프 / 드래그
  let startX = 0, dx = 0, dragging = false, width = 1;
  const onDown = (e) => {
    dragging = true;
    width = card.clientWidth;
    startX = e.clientX;
    dx = 0;
    track.classList.add("is-dragging");
  };
  const onMove = (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
    track.style.transform = `translate3d(calc(${-index * 100}% + ${dx}px),0,0)`;
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (Math.abs(dx) > width * 0.15) go(index + (dx < 0 ? 1 : -1));
    else go(index);
  };
  card.addEventListener("pointerdown", onDown);
  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerup", onUp);
  card.addEventListener("pointercancel", onUp);
  card.addEventListener("pointerleave", onUp);

  // 드래그 후 클릭 오작동 방지
  card.querySelectorAll(".card__nav").forEach((b) =>
    b.addEventListener("click", (e) => { if (Math.abs(dx) > 8) e.stopImmediatePropagation(); }, true)
  );

  // 카드 hover 시 현재 슬라이드 video 재생
  card.addEventListener("mouseenter", () => {
    const v = slides[index].querySelector("video");
    if (v) v.play().catch(() => {});
  });
  card.addEventListener("mouseleave", () => {
    const v = slides[index].querySelector("video");
    if (v && !v.hasAttribute("data-player")) v.pause();
  });
}

/* ---------- 4. 풀와이드 플레이어 진행바 ---------- */
function initPlayers(scope) {
  scope.querySelectorAll("[data-progress]").forEach((bar) => {
    const card = bar.closest("[data-card]");
    const video = card.querySelector("video[data-player]");
    if (video) {
      video.addEventListener("timeupdate", () => {
        if (video.duration) bar.style.width = `${(video.currentTime / video.duration) * 100}%`;
      });
      card.addEventListener("click", () => (video.paused ? video.play() : video.pause()));
    } else {
      // 플레이스홀더용 데모 진행바 (실제 video로 교체하면 timeupdate 사용)
      let t = 0;
      setInterval(() => {
        t = (t + 0.25) % 100;
        bar.style.width = `${t}%`;
      }, 250);
    }
  });
}

/* ---------- 5. 상세 페이지 캐러셀 (도트 클릭 / 스와이프) ---------- */
/* ---------- 상세 페이지 이미지 스크롤 인터랙션 ----------
   레퍼런스(plumyyy) 측정값: 요소가 뷰포트를 통과하는 진행도 progress = (vh - top) / (h + vh) (0~1).
   |progress - 0.5| <= 0.1 이면 여백/모서리 0, 그 밖에서는 0.4 구간에 걸쳐 선형으로 24px/32px까지 증가. */
function initDetailScrollFrames() {
  const frames = Array.from(document.querySelectorAll(".detail-figure__frame"));
  if (!frames.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    frames.forEach((frame) => {
      const r = frame.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return; // 멀리 있는 것은 건너뜀
      const progress = (vh - r.top) / (r.height + vh);
      let p = (Math.abs(progress - 0.5) - 0.1) / 0.4;
      p = Math.min(1, Math.max(0, p));
      frame.style.setProperty("--p", p.toFixed(4));
    });
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
  const start = () => {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    update();
  };
  const stop = () => {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    frames.forEach((f) => f.style.removeProperty("--p"));
  };
  if (reduce.matches) return; // 모션 최소화: 24px/32px 고정
  start();
  reduce.addEventListener?.("change", (e) => (e.matches ? stop() : start()));
  // 이미지 로드로 높이가 바뀌면 재계산
  document.querySelectorAll(".detail-figure__frame img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", schedule, { once: true });
  });
}

/* ---------- 페이지 전환: 내부 링크 클릭 시 짧게 페이드아웃 후 이동 ----------
   대상: 카드 링크(상세 진입), Back 버튼, Work/About 탭. 새 탭·수정키·앵커·외부 링크는 제외. */
function initPageTransitions() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const DURATION = 240;
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.hash) return; // 같은 페이지 앵커
    e.preventDefault();
    document.documentElement.classList.add("is-leaving");
    setTimeout(() => { location.href = url.href; }, DURATION);
  });
  // 뒤로가기(bfcache)로 복원될 때 페이드아웃 상태가 남지 않도록
  window.addEventListener("pageshow", () => document.documentElement.classList.remove("is-leaving"));
}

/* ---------- 상세 페이지 영상: 뷰포트 근처에서만 로드·재생, 벗어나면 정지 ----------
   <video class="detail-video" data-src="..." poster="..." muted loop playsinline preload="none">
   모션 최소화 설정에서는 자동 재생 대신 컨트롤을 노출한다. */
function initDetailVideos() {
  const videos = Array.from(document.querySelectorAll("video.detail-video[data-src]"));
  if (!videos.length) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const load = (v) => {
    if (v.dataset.loaded) return;
    v.dataset.loaded = "1";
    v.src = v.dataset.src;
    v.load();
  };
  if (reduce) {
    videos.forEach((v) => { v.controls = true; v.removeAttribute("loop"); load(v); });
    return;
  }
  if (!("IntersectionObserver" in window)) {
    videos.forEach((v) => { load(v); v.play().catch(() => {}); });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        load(v);
        v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    });
  }, { rootMargin: "50% 0px 50% 0px", threshold: 0 });
  videos.forEach((v) => io.observe(v));
}

function initDetailCarousels() {
  document.querySelectorAll("[data-detail-carousel]").forEach((root) => {
    const track = root.querySelector("[data-track]");
    const dots = root.querySelectorAll("[data-dot]");
    const n = track.children.length;
    let index = 0;
    const go = (to) => {
      index = (to + n) % n;
      track.style.transform = `translate3d(${-index * 100}%,0,0)`;
      dots.forEach((d, k) => {
        d.classList.toggle("is-active", k === index);
        d.setAttribute("aria-current", k === index ? "true" : "false");
      });
    };
    dots.forEach((d) => d.addEventListener("click", () => go(+d.dataset.dot)));
    let sx = 0, dx = 0, dragging = false;
    root.addEventListener("pointerdown", (e) => { dragging = true; sx = e.clientX; dx = 0; });
    root.addEventListener("pointermove", (e) => { if (dragging) dx = e.clientX - sx; });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    };
    root.addEventListener("pointerup", end);
    root.addEventListener("pointercancel", end);
    root.addEventListener("pointerleave", end);
  });
}

renderGallery();
initDetailCarousels();
initDetailScrollFrames();
initPageTransitions();
initDetailVideos();
