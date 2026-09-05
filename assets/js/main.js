/* Jason Xu — jasonyxu.us redesign
   GSAP motion: SplitText headings, ScrollTrigger reveals, parallax, progress bar, gallery lightbox.
   Robustness: every block is isolated in try/catch; all reveal states use immediateRender:false
   so content is NEVER permanently hidden even if a trigger fails. */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Touch devices: skip scroll-triggered reveals/parallax. Content stays
  // fully visible (no fade-in delay when reaching a card) and the page
  // avoids per-frame scroll compositing that made effects feel late.
  var coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  /* ---------- Vimeo hero: iframe starts hidden; fade in only when player sends "ready" ---------- */
  var vimeo = document.querySelector(".hero-media iframe");
  if (vimeo) {
    var vimeoReady = false;
    window.addEventListener("message", function (e) {
      if (!vimeoReady && e.origin && e.origin.indexOf("player.vimeo.com") !== -1
          && e.data && e.data.event === "ready") {
        vimeoReady = true;
        vimeo.style.opacity = "1";
      }
    });
    setTimeout(function () {
      if (!vimeoReady) vimeo.style.opacity = "0";
    }, 6000);
  }

  /* ---------- nav ---------- */
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  // Note: no scroll handler here — the top bar keeps a constant color at
  // every scroll position (no scroll-state class toggling).

  if (toggle && links) {
    function setNav(open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    }
    toggle.addEventListener("click", function () {
      setNav(!links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        setNav(false);
      });
    });
  }

  /* ---------- scroll progress ---------- */
  var bar = document.getElementById("progressBar");
  function onProgress() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }
  window.addEventListener("scroll", onProgress, { passive: true });
  onProgress();

  /* ---------- lightbox (works without GSAP) ---------- */
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxCaption = document.getElementById("lightboxCaption");
  var lightboxClose = document.getElementById("lightboxClose");
  var galleryItems = document.querySelectorAll(".gallery-item img");

  function openLightbox(img) {
    if (!lightbox) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
    if (lightboxCaption) {
      var fig = img.closest("figure");
      var cap = fig && fig.querySelector("figcaption")
        ? fig.querySelector("figcaption").textContent
        : "";
      lightboxCaption.textContent = cap;
      lightboxCaption.style.display = cap ? "" : "none";
    }
    clearTimeout(lightbox._closeTimer);
    lightbox.classList.remove("is-closing");
    lightbox.hidden = false;
    void lightbox.offsetWidth; /* reflow so open transition starts from hidden state */
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    if (lightbox.classList.contains("is-closing")) return;
    lightbox.classList.remove("is-open");
    lightbox.classList.add("is-closing");
    lightbox._closeTimer = setTimeout(function () {
      lightbox.hidden = true;
      lightbox.classList.remove("is-closing");
      document.body.style.overflow = "";
    }, 380);
  }
  galleryItems.forEach(function (img) {
    img.addEventListener("click", function () { openLightbox(img); });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Winter & Meadow cinema backdrop ----------
     Crossfade every cat photo behind the page. No GSAP needed so it
     still runs for reduced-motion users (just the fade, no drift). */
  (function () {
    var slides = Array.prototype.slice.call(document.querySelectorAll("#wmSlides .wm-slide"));
    var cinema = document.getElementById("wmCinema");
    if (!slides.length) return;
    var idx = 0;
    var active = slides[0];
    active.classList.add("is-on");
    var INTERVAL = 4600;
    var timer = null;
    var noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function switchTo(n) {
      if (noMotion || slides.length < 2) return;
      idx = (n + slides.length) % slides.length;
      var nextEl = slides[idx];
      if (nextEl === active) return;
      var prevEl = active;
      var img = new Image();
      var src = nextEl.getAttribute("data-src");
      if (!src) return;
      img.src = src;
      function apply() {
        if (prevEl !== active) return; // a newer switch already won
        nextEl.style.backgroundImage = "url('" + src + "')";
        nextEl.classList.add("is-on");
        prevEl.classList.remove("is-on");
        active = nextEl;
      }
      img.onload = apply;
      img.onerror = apply;
    }
    function step() { switchTo(idx + 1); }
    function start() { if (!timer) timer = setInterval(step, INTERVAL); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    if (noMotion) return; // keep the first frame visible, no rotation
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) start(); else stop();
        });
      }, { rootMargin: "300px 0px" });
      io.observe(cinema || slides[0]);
    } else {
      start();
    }
  })();

  /* ---------- GSAP: skip when lib missing or reduced motion ---------- */
  if (typeof gsap === "undefined" || reduced) {
    return;
  }

  try { gsap.registerPlugin(ScrollTrigger); } catch (e) { return; }

  function safe(fn) { try { fn(); } catch (e) { /* isolate animation failures */ } }

  /* Hero (home) entrance — plays immediately at top */
  safe(function () {
    var heroKicker = document.querySelector("[data-hero-kicker]");
    var heroTitle = document.querySelector("[data-hero-title]");
    var heroSub = document.querySelector("[data-hero-sub]");
    var heroCta = document.querySelector("[data-hero-cta]");
    if (heroTitle) {
      var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (heroKicker) tl.from(heroKicker, { y: 18, opacity: 0, duration: 0.7 }, 0.1);
      tl.from(heroTitle.querySelectorAll(".line"), { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.16 }, 0.3);
      if (heroSub) tl.from(heroSub, { y: 20, opacity: 0, duration: 0.8 }, 0.9);
      if (heroCta) tl.from(heroCta.children, { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 }, 1.05);
    }
  });

  /* Split headings — word reveal; waits for fonts, never hides content on failure */
  function bindSplits() {
    safe(function () {
      if (coarse) return; // touch: keep headings plainly visible
      document.querySelectorAll(".js-split").forEach(function (el) {
        if (!el.textContent.trim()) return;
        var split = SplitText.create(el, { type: "words", wordsClass: "split-word" });
        gsap.fromTo(split.words,
          { yPercent: 90, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.035,
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top 85%", once: true }
          });
      });
    });
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(bindSplits).catch(bindSplits);
  } else {
    bindSplits();
  }

  /* Generic reveals — immediateRender:false keeps content visible until trigger fires */
  safe(function () {
    if (coarse) return; // touch: cards render fully, no fade-in lag
    gsap.utils.toArray(".reveal").forEach(function (el) {
      gsap.fromTo(el,
        { y: 34, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        });
    });
  });

  /* Home photo strip parallax drift */
  safe(function () {
    if (coarse) return;
    var strip = document.querySelector(".js-photo-strip");
    if (strip) {
      gsap.to(strip, {
        xPercent: -12,
        ease: "none",
        scrollTrigger: { trigger: strip, start: "top bottom", end: "bottom top", scrub: 1.2 }
      });
    }
  });

  /* Parallax on gallery images (subtle) */
  safe(function () {
    if (coarse) return;
    gsap.utils.toArray(".gallery-item img").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -8 }, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: { trigger: img, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });
  });

  /* ============================================================
     Cat Universe — Meadow & Winter interaction layer
     3D tilt, magnetic buttons, hero parallax,
     cat pupils follow, spotlight, 3D card entrances
     ============================================================ */
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* --- 3D tilt on cards (desktop only) --- */
  safe(function () {
    if (!finePointer) return;
    gsap.utils.toArray("[data-tilt], .card, .gallery-item, .link-card, .cat-card, .pub").forEach(function (el) {
      var rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
      var ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
      var intensity = el.classList.contains("cat-3d") ? 12 : 6;
      el.classList.add("tilt-3d");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        ry(nx * intensity);
        rx(-ny * intensity);
      });
      el.addEventListener("mouseleave", function () {
        rx(0); ry(0);
      });
    });
  });

  /* --- magnetic buttons --- */
  safe(function () {
    if (!finePointer) return;
    gsap.utils.toArray(".btn").forEach(function (btn) {
      var mx = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      var my = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.28);
        my((e.clientY - (r.top + r.height / 2)) * 0.38);
      });
      btn.addEventListener("mouseleave", function () {
        mx(0); my(0);
      });
    });
  });

  /* --- hero mouse parallax (depth layers) --- */
  safe(function () {
    if (!finePointer) return;
    var heroContent = document.querySelector(".hero-content");
    if (!heroContent) return;
    var layers = Array.prototype.slice.call(heroContent.children);
    var depth = [0.35, 0.7, 1, 1.4, 1.8]; // kicker, title, sub, cta
    document.querySelector(".hero").addEventListener("mousemove", function (e) {
      var r = this.getBoundingClientRect();
      var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      layers.forEach(function (layer, i) {
        var d = depth[i] || 1;
        gsap.to(layer, {
          x: nx * 14 * d,
          y: ny * 10 * d,
          rotationY: nx * 2.5 * d,
          rotationX: -ny * 2 * d,
          duration: 1.2, ease: "power3.out",
          transformPerspective: 800
        });
      });
    });
    document.querySelector(".hero").addEventListener("mouseleave", function () {
      layers.forEach(function (layer) {
        gsap.to(layer, { x: 0, y: 0, rotationX: 0, rotationY: 0, duration: 1, ease: "power3.out" });
      });
    });
  });

  /* --- cat pupils follow the pointer --- */
  safe(function () {
    if (!finePointer) return;
    gsap.utils.toArray(".cat-3d-face--back").forEach(function (card) {
      var pupils = card.querySelectorAll(".cat-pupil");
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
        var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
        pupils.forEach(function (p) {
          gsap.to(p, { x: nx * 4, y: ny * 4, duration: 0.35, ease: "power2.out" });
        });
      });
      card.addEventListener("mouseleave", function () {
        pupils.forEach(function (p) {
          gsap.to(p, { x: 0, y: 0, duration: 0.6, ease: "power2.out" });
        });
      });
    });
  });

  /* --- flip cards on touch (hover is CSS-driven on desktop) --- */
  safe(function () {
    if (finePointer) return;
    gsap.utils.toArray(".cat-3d").forEach(function (card) {
      card.addEventListener("click", function () {
        card.classList.toggle("is-flipped");
      });
    });
  });

  /* --- spotlight CSS vars on cards --- */
  safe(function () {
    if (!finePointer) return;
    gsap.utils.toArray(".card, .cat-3d-face, .gallery-item").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(2) + "%");
        el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(2) + "%");
      });
    });
  });

  /* --- 3D card entrances on scroll (opacity is handled by .reveal) --- */
  safe(function () {
    if (coarse) return;
    gsap.utils.toArray(".card, .link-card, .cat-3d, .gallery-item, .pub").forEach(function (el) {
      gsap.fromTo(el,
        { rotationY: -10, transformPerspective: 900 },
        {
          rotationY: 0, duration: 1, ease: "power3.out",
          immediateRender: false,
          scrollTrigger: { trigger: el, start: "top 88%", once: true }
        });
    });
  });

  /* --- auto rotating photo album (home bottom) --- */
  safe(function () {
    var album = document.querySelector(".album.js-album");
    if (!album) return;
    var stage = album.querySelector(".album-stage");
    var slides = gsap.utils.toArray(stage.querySelectorAll(".album-slide"));
    var counter = album.querySelector(".album-counter");
    var prevBtn = album.querySelector(".album-prev");
    var nextBtn = album.querySelector(".album-next");
    if (slides.length < 2) return;
    var idx = 0, timer = null, req = 0;
    var INTERVAL = 4200;
    var imgs = slides.map(function (s) { return s.querySelector("img"); });

    function activate(n) {
      slides[idx].classList.remove("is-active");
      idx = n;
      slides[idx].classList.add("is-active");
      if (counter) counter.textContent = (idx + 1) + " / " + slides.length;
    }
    function preload(n) {
      var im = imgs[n];
      if (im && im.getAttribute("loading") === "lazy") im.loading = "eager";
    }
    function go(n) {
      n = (n + slides.length) % slides.length;
      var token = ++req;
      preload((n + 1) % slides.length);
      var im = imgs[n];
      function done() { if (token === req) activate(n); }
      if (im && !(im.complete && im.naturalWidth)) {
        im.addEventListener("load", done, { once: true });
        preload(n);
        setTimeout(done, 1400);
      } else {
        done();
      }
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() { if (!timer) { timer = setInterval(next, INTERVAL); } }

    if (prevBtn) prevBtn.addEventListener("click", function () { stop(); prev(); start(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stop(); next(); start(); });
    album.addEventListener("mouseenter", stop);
    album.addEventListener("mouseleave", start);
    album.addEventListener("touchstart", stop, { passive: true });
    album.addEventListener("touchend", start);
    if (reduced) return;
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { start(); } else { stop(); }
        });
      }, { rootMargin: "300px 0px" });
      io.observe(album);
    } else {
      start();
    }
  });

  /* --- About: liquid-glass cursor sheen over CV photo sections --- */
  safe(function () {
    if (!finePointer) return;
    var sections = gsap.utils.toArray(".cv-section");
    sections.forEach(function (sec) {
      var raf = null;
      sec.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = sec.getBoundingClientRect();
          var x = (((e.clientX - r.left) / r.width) * 100).toFixed(2);
          var y = (((e.clientY - r.top) / r.height) * 100).toFixed(2);
          sec.style.setProperty("--lx", x + "%");
          sec.style.setProperty("--ly", y + "%");
        });
      });
      sec.addEventListener("mouseleave", function () {
        sec.style.setProperty("--lx", "50%");
        sec.style.setProperty("--ly", "26%");
      });
    });
  });

  window.addEventListener("load", function () {
    try { ScrollTrigger.refresh(); } catch (e) {}
  });
})();
