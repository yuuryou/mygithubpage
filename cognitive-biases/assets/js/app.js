/* ==========================================================================
   Cognitive Bias Atlas — app.js (shared behaviors)

   Load order (see any page):
     assets/data/atlas.js      structure + citations (language-neutral)
     assets/data/references.js APA list (language-neutral)
     assets/js/render.js       CBA.render / CBA.openBias
     assets/js/i18n.js         locale engine  -> boots and calls CBA.render
     assets/js/app.js          this file       -> CBA.initBehaviors

   Behaviors are split in two:
     initBehaviors()    global, bound once (nav, spotlight, modal delegation)
     refreshBehaviors() re-run after every render pass (reveal, tabs)
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.prototype.slice.call((c || document).querySelectorAll(s));

  const pageUrl = new URL(location.href);

  function baseHref(a) {
    return (a.getAttribute("href") || "").split("?")[0];
  }

  /**
   * Append ?lang=<current> to every internal link so a copied or shared URL
   * opens in the language the reader was using, not the site default.
   */
  function syncLinkLocale() {
    const lang = window.CBA && CBA.i18n ? CBA.i18n.lang : null;
    if (!lang) return;
    $$("a[href]").forEach((a) => {
      const raw = a.getAttribute("href") || "";
      if (!raw || raw.charAt(0) === "#" || /^[a-z]+:/i.test(raw)) return;
      a.setAttribute("href", raw.split("?")[0] + "?lang=" + lang);
    });
  }

  /* --- nav scroll state ------------------------------------------------- */
  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const path = pageUrl.pathname.split("/").pop() || "index.html";
    $$(".nav-links a").forEach((a) => {
      if (baseHref(a) === path) a.classList.add("is-active");
    });
  }

  /* --- mobile hamburger menu -------------------------------------------- */
  function initMobileNav() {
    const nav = $(".nav");
    const toggle = $(".nav-toggle");
    const menu = $("#site-nav");
    if (!nav || !toggle || !menu) return;

    function setLabel(open) {
      const key = open ? "nav.menuClose" : "nav.menuOpen";
      const fallback = open ? "Close menu" : "Open menu";
      const label = (window.CBA && CBA.i18n && CBA.i18n.t(key)) || fallback;
      toggle.setAttribute("aria-label", label);
      toggle.setAttribute("title", label);
    }

    function setOpen(open) {
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      setLabel(open);
    }

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // close after choosing a link (the navigation proceeds normally)
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    // Escape closes the menu and returns focus to the toggle
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    // tapping the scrim closes the menu
    document.addEventListener("click", (e) => {
      if (nav.classList.contains("is-open") && !nav.contains(e.target)) setOpen(false);
    });

    // reset when the viewport grows back past the breakpoint
    // (must match the @media (max-width: 1900px) hamburger rule in main.css)
    const mq = window.matchMedia ? window.matchMedia("(max-width: 1900px)") : null;
    if (mq && typeof mq.addEventListener === "function") {
      mq.addEventListener("change", () => {
        if (!mq.matches) setOpen(false);
      });
    } else {
      window.addEventListener("resize", () => {
        if (window.innerWidth > 1900) setOpen(false);
      });
    }

    // keep the label in the active language
    document.addEventListener("cba:langchange", () => {
      setLabel(nav.classList.contains("is-open"));
    });

    setLabel(false);
  }

  /* --- reveal on scroll ------------------------------------------------- */
  function initReveal() {
    const items = $$(".reveal").filter((el) => !el.dataset.revealBound);
    if (!items.length) return;
    items.forEach((el) => (el.dataset.revealBound = "1"));

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    items.forEach((el, i) => {
      el.style.transitionDelay = Math.min((i % 6) * 60, 300) + "ms";
      io.observe(el);
    });
  }

  /* --- cursor-follow glass highlight (delegated: survives re-render) ------ */
  function initSpotlight() {
    if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;
    if (initSpotlight.bound) return;
    initSpotlight.bound = true;
    document.addEventListener(
      "pointermove",
      (ev) => {
        const el = ev.target.closest && ev.target.closest(".glass-card, .glass-btn, .tab");
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");
        el.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");
      },
      { passive: true }
    );
  }

  /* --- tabs ------------------------------------------------------------- */
  function initTabs() {
    const wrap = $(".tabs");
    if (!wrap || wrap.dataset.tabsBound === "1") return;
    wrap.dataset.tabsBound = "1";
    const tabs = $$(".tab", wrap);
    const panels = $$(".tabpanel");
    if (!tabs.length) return;

    function activate(tabEl) {
      const id = tabEl.dataset.target;
      tabs.forEach((t) => {
        const on = t === tabEl;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach((p) => {
        p.classList.toggle("is-active", p.id === id);
        if (p.id === id) $$(".reveal", p).forEach((r) => r.classList.add("is-in"));
      });
      if (window.CBA && CBA.i18n && CBA.i18n.setParam) CBA.i18n.setParam("t", id);
    }
    window.activateTab = activate;

    const wanted = new URLSearchParams(location.search).get("t");
    let initial = tabs[0];
    if (wanted) {
      const hit = tabs.find((t) => t.dataset.target === wanted);
      if (hit) initial = hit;
    }
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => activate(t));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          const dir = e.key === "ArrowRight" ? 1 : -1;
          const next = tabs[(i + dir + tabs.length) % tabs.length];
          next.focus();
          activate(next);
        }
      });
    });
    activate(initial);
  }

  /* --- bias modal (delegated) -------------------------------------------- */
  function initModal() {
    if (initModal.bound) return;
    initModal.bound = true;

    document.addEventListener("click", (e) => {
      /* The open dialog carries data-bias itself (so that render.js can rebuild
         it in the new language). Any click landing inside the dialog would
         therefore resolve to the dialog as an "opener" and immediately re-open
         it — which made the ✕ and the backdrop look dead. Clicks inside a modal
         must never count as openers. */
      if (e.target.closest && e.target.closest("dialog[data-modal]")) return;
      const opener = e.target.closest && e.target.closest("[data-bias]");
      if (!opener) return;
      openBiasFrom(opener);
    });

    $$("dialog[data-modal]").forEach((dlg) => {
      dlg.addEventListener("click", (e) => {
        const rect = dlg.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left && e.clientX <= rect.right &&
          e.clientY >= rect.top && e.clientY <= rect.bottom;
        if (!inside) dlg.close();
      });
    });
  }

  function openBiasFrom(opener) {
    const slug = opener.dataset.bias;
    const accent = opener.style.getPropertyValue("--accent").trim() || "var(--c1)";
    if (window.CBA && typeof CBA.openBias === "function") {
      const dlg = document.querySelector("dialog[data-modal='bias']");
      if (dlg) {
        dlg.dataset.bias = slug;
        dlg.dataset.accent = accent;
      }
      CBA.openBias(slug, accent);
    }
  }

  /* --- deep link: ?t=tab-XX&bias=slug ----------------------------------- */
  function applyDeepLink() {
    const params = new URLSearchParams(location.search);
    const bias = params.get("bias");
    if (!bias) return;
    const card = document.querySelector('[data-bias="' + bias + '"]');
    if (!card) return;
    setTimeout(() => {
      if (typeof card.scrollIntoView === "function") {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      // make sure the panel holding the card is the visible one
      const panel = card.closest(".tabpanel");
      if (panel && !panel.classList.contains("is-active")) {
        const tab = document.querySelector('.tab[data-target="' + panel.id + '"]');
        if (tab && window.activateTab) window.activateTab(tab);
      }
      openBiasFrom(card);
    }, 250);
  }

  /* --- narrow subcategory nav (sticky floating bar) --------------------- */
  /* Below the "tabs fit one line" threshold a category page becomes a
     vertical scroll page: every .tabpanel is a stacked section and the tab
     row turns into a sticky floating bar.

     Behaviour after a scroll-down:
       collapsed pill (only the current subcategory, one line)
         -> first click anywhere on the pill expands every button
         -> expanded: clicking a subcategory smooth-scrolls to its section
         -> clicking outside collapses the bar back into the single line
  ------------------------------------------------------------------------ */
  const SUBNARROW_MQ = window.matchMedia
    ? window.matchMedia("(max-width: 1100px)")
    : null;

  let subnavBound = false;

  function isCategoryPage() {
    return !!(document.querySelector(".tabs") && document.querySelector(".tabpanel"));
  }

  function setSubnavMode() {
    const on = SUBNARROW_MQ && SUBNARROW_MQ.matches && isCategoryPage();
    document.body.classList.toggle("subnav-narrow", on);
    if (!on) {
      document.body.classList.remove("subnav-collapsed", "subnav-expanded");
    }
    return on;
  }

  function setSubnavCollapsed(on) {
    const b = document.body;
    if (!b.classList.contains("subnav-narrow")) return;
    b.classList.toggle("subnav-collapsed", !!on);
    if (on) b.classList.remove("subnav-expanded");
  }

  function syncCurrentFromSpy() {
    const tabs = $(".tabs");
    if (!tabs) return;
    const panels = $$(".tabpanel").filter((p) => p.offsetParent !== null);
    if (!panels.length) return;
    const barBottom = (tabs.getBoundingClientRect().top || 0) + 20;
    let current = panels[0];
    for (const p of panels) {
      // a section counts as "current" slightly before its header actually
      // touches the bar, so the pill label keeps up with fast scrolling
      if (p.getBoundingClientRect().top - barBottom <= 220) current = p;
    }
    $$(".tab", tabs).forEach((t) => {
      t.classList.toggle("is-current", t.dataset.target === current.id);
    });
  }

  function revealPanelCards() {
    if (!document.body.classList.contains("subnav-narrow")) return;
    $$(".tabpanel .reveal").forEach((el) => el.classList.add("is-in"));
  }

  function subnavScrollState() {
    if (!isCategoryPage() || !SUBNARROW_MQ || !SUBNARROW_MQ.matches) return;
    const b = document.body;
    if (b.classList.contains("subnav-expanded")) {
      syncCurrentFromSpy();
      // expanding the bar changes the layout and fires an immediate scroll
      // event; ignore that side effect, but let a real user scroll (later
      // than the settle window) collapse the bar again
      if (window._subnavExpandAt && performance.now() - window._subnavExpandAt < 500) return;
      setSubnavCollapsed(true);
      return;
    }
    const first = $(".tabpanel");
    if (!first) return;
    // collapsed only after the first section has reached the sticky bar
    setSubnavCollapsed(first.getBoundingClientRect().top < 140);
    syncCurrentFromSpy();
  }

  /* Called after every render pass; also the place that keeps body state in
     sync when the locale changes and the tabs re-mount. */
  function refreshSubnav() {
    if (!setSubnavMode()) return;
    revealPanelCards();
    subnavScrollState();
    bindSubnavTabsClick();
  }

  /* Tabs live inside a re-rendered mount, so re-bind after every render;
     the function itself is idempotent thanks to the bound flag on the wrap. */
  function bindSubnavTabsClick() {
    const wrap = $(".tabs");
    if (!wrap || wrap.dataset.subnavBound === "1") return;
    wrap.dataset.subnavBound = "1";
    wrap.addEventListener("click", (e) => {
      const b = document.body;
      if (!b.classList.contains("subnav-narrow")) return;
      const tab = e.target.closest && e.target.closest(".tab");
      if (!tab) return;
      if (b.classList.contains("subnav-collapsed")) {
        // first click: expand back to the original full-width size
        e.preventDefault();
        e.stopPropagation();
        window._subnavExpandAt = performance.now();
        b.classList.remove("subnav-collapsed");
        b.classList.add("subnav-expanded");
        return;
      }
      // already expanded: scroll to the section, then collapse to the pill
      const panel = document.getElementById(tab.dataset.target);
      if (panel) {
        e.preventDefault();
        // mark immediately so the collapsed pill shows the right section
        $$(".tab", wrap).forEach((t) => {
          t.classList.toggle("is-current", t === tab);
        });
        b.classList.remove("subnav-expanded");
        b.classList.add("subnav-collapsed");
        setTimeout(() => {
          const el = document.getElementById(tab.dataset.target);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 30);
      }
    });
  }

  /* One-time bindings (window scroll / document outside-click). Must stay
     registered even across re-renders, so it lives in initBehaviors. */
  function bindSubnav() {
    if (subnavBound || !SUBNARROW_MQ) return;
    subnavBound = true;

    window.addEventListener("scroll", subnavScrollState, { passive: true });

    // outside click -> collapse back into the single-line pill
    document.addEventListener("click", (e) => {
      const b = document.body;
      if (!b.classList.contains("subnav-narrow")) return;
      if (!b.classList.contains("subnav-expanded")) return;
      if (e.target.closest && e.target.closest(".tabs")) return;
      setSubnavCollapsed(true);
    });

    // viewport crosses the breakpoint -> reset, then re-evaluate
    if (typeof SUBNARROW_MQ.addEventListener === "function") {
      SUBNARROW_MQ.addEventListener("change", () => {
        const narrow = setSubnavMode();
        if (!narrow) return;
        const b = document.body;
        b.classList.remove("subnav-collapsed", "subnav-expanded");
        subnavScrollState();
      });
    } else {
      window.addEventListener("resize", () => {
        const narrow = setSubnavMode();
        if (!narrow) return;
        const b = document.body;
        b.classList.remove("subnav-collapsed", "subnav-expanded");
        subnavScrollState();
      });
    }
  }

  /* --- public hooks (called by i18n.js) ---------------------------------- */
  function refreshBehaviors() {
    initReveal();
    refreshSubnav();
    initTabs();
    applyDeepLink();
  }

  function initBehaviors() {
    initNav();
    initMobileNav();
    initSpotlight();
    initModal();
    bindSubnav();
    refreshBehaviors();
    syncLinkLocale();
    document.addEventListener("cba:langchange", syncLinkLocale);
  }

  window.CBA = Object.assign(window.CBA || {}, {
    $,
    $$,
    initBehaviors,
    refreshBehaviors,
    applyDeepLink
  });
})();
