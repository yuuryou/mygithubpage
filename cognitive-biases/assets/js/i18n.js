/* ==========================================================================
   Cognitive Bias Atlas — i18n.js
   Locale registry, dynamic resource loading, DOM translation, switcher UI.

   Resource contract
   -----------------
   assets/i18n/ui.<lang>.js      -> CBA.registerUI(lang, { ... })
   assets/i18n/biases.<lang>.js  -> CBA.registerContent(lang, { slug: {...} })
   assets/data/atlas.js          -> language-neutral structure + citations

   Markup contract
   ---------------
   data-i18n="a.b.c"                     -> textContent
   data-i18n-attr="placeholder:x, aria-label:y"  -> element attributes
   data-lang-switch                      -> mount point for the switcher
   body[data-page] / body[data-needs]    -> page id / resources required
   ========================================================================== */
(function () {
  "use strict";

  var CBA = (window.CBA = window.CBA || {});

  /* --- locale registry -------------------------------------------------- */
  /* `native` is intentionally never translated: each option is rendered in
     its own language, per product requirement. */
  var LOCALES = {
    "cn-zh": { native: "简体中文", htmlLang: "zh-Hans", dir: "ltr" },
    "cn-tw": { native: "繁體中文", htmlLang: "zh-Hant", dir: "ltr" },
    "en-us": { native: "English", htmlLang: "en", dir: "ltr" },
    "jp": { native: "日本語", htmlLang: "ja", dir: "ltr" }
  };
  var ORDER = ["cn-zh", "cn-tw", "en-us", "jp"];
  var DEFAULT_LANG = "en-us";
  var STORAGE_KEY = "cba.lang";

  var state = { lang: null, ui: {}, content: {}, loaded: {}, ready: false };
  var queue = [];

  /* --- small helpers ---------------------------------------------------- */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isLocale(code) {
    return Object.prototype.hasOwnProperty.call(LOCALES, code);
  }

  function normalize(code) {
    if (!code) return null;
    var c = String(code).toLowerCase().replace(/_/g, "-");
    if (isLocale(c)) return c;
    // map common browser tags onto the four supported locales
    var base = c.split("-")[0];
    if (base === "zh") {
      var region = (c.split("-")[1] || "").toLowerCase();
      if (region === "hans" || region === "cn" || region === "sg" || region === "hans-cn") return "cn-zh";
      if (region === "hant" || region === "tw" || region === "hk" || region === "mo") return "cn-tw";
      return "cn-zh";
    }
    if (base === "ja") return "jp";
    if (base === "en") return "en-us";
    return null;
  }

  function detect() {
    // lang-detect.js already resolved this before first paint — reuse it so
    // there is exactly one resolution path.
    if (typeof CBA.pickLang === "function") {
      var pre = normalize(CBA.pickLang());
      if (pre) return pre;
    }
    // 1. explicit ?lang= wins (handy for shared links)
    var q = new URLSearchParams(location.search).get("lang");
    var fromQuery = normalize(q);
    if (fromQuery) return fromQuery;
    // 2. previously chosen
    var stored = null;
    try {
      stored = normalize(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      stored = null;
    }
    if (stored) return stored;
    // 3. browser preference
    var nav = (navigator.languages || [navigator.language]).map(normalize).filter(Boolean);
    if (nav.length) return nav[0];
    return DEFAULT_LANG;
  }

  /* --- resource loading ------------------------------------------------- */
  function loadScript(src, cb) {
    var s = document.createElement("script");
    s.src = src;
    s.async = false;
    s.onload = cb;
    s.onerror = function () {
      // Missing resource must never break the page: fall back to defaults.
      console.warn("[i18n] failed to load " + src);
      cb();
    };
    document.head.appendChild(s);
  }

  function needsContent() {
    var n = (document.body && document.body.dataset.needs) || "";
    return n.split(/\s+/).indexOf("biases") !== -1;
  }

  function ensure(lang, cb) {
    var pending = 0;
    var done = false;
    function finish() {
      if (!done && pending === 0) {
        done = true;
        state.loaded[lang] = true;
        cb();
      }
    }
    function add(src) {
      pending++;
      loadScript(src, function () {
        pending--;
        finish();
      });
    }
    if (state.loaded[lang]) return finish();
    add("assets/i18n/ui." + lang + ".js");
    if (needsContent()) add("assets/i18n/biases." + lang + ".js");
  }

  CBA.registerUI = function (lang, dict) {
    state.ui[lang] = dict || {};
  };
  CBA.registerContent = function (lang, dict) {
    state.content[lang] = dict || {};
  };

  /* --- translation lookup ----------------------------------------------- */
  /**
   * Resolve a dot-path against a dictionary.
   *
   * At each level the longest literal key wins, so both styles work:
   *   { meta: { "home.title": "…" } }   -> t("meta.home.title")
   *   { cat: { I: { title: "…" } } }    -> t("cat.I.title")
   * Without the longest-match rule a flat key containing a dot ("home.title")
   * would be unreachable, because a naive split would descend into "home".
   */
  function lookup(dict, key) {
    if (!dict) return undefined;
    var parts = String(key).split(".");
    var node = dict;
    var i = 0;
    while (i < parts.length) {
      if (node == null || typeof node !== "object") return undefined;
      var matched = false;
      for (var j = parts.length; j > i; j--) {
        var candidate = parts.slice(i, j).join(".");
        if (Object.prototype.hasOwnProperty.call(node, candidate)) {
          node = node[candidate];
          i = j;
          matched = true;
          break;
        }
      }
      if (!matched) return undefined;
    }
    return node;
  }

  /**
   * Translate a dot-path key for the active language.
   * Falls back to the default locale, then to the key itself.
   */
  function t(key, vars) {
    var val = lookup(state.ui[state.lang], key);
    if (val === undefined && state.lang !== DEFAULT_LANG) {
      val = lookup(state.ui[DEFAULT_LANG], key);
    }
    if (val === undefined) return key;
    return interpolate(val, vars);
  }

  function interpolate(value, vars) {
    if (!vars) return value;
    if (Array.isArray(value)) return value.map((v) => interpolate(v, vars));
    if (typeof value !== "string") return value;
    return value.replace(/\{(\w+)\}/g, function (m, name) {
      return vars[name] == null ? m : vars[name];
    });
  }

  /* --- DOM application --------------------------------------------------- */

  /**
   * Resolve a `data-i18n-vars="code:I, title:cat.I.title"` spec.
   * Each value is looked up as a UI key first; if there is no such key the
   * raw text is used as a literal. This keeps variable interpolation
   * declarative in markup instead of requiring a custom renderer.
   */
  function varsOf(el) {
    var spec = el.getAttribute("data-i18n-vars");
    if (!spec) return null;
    var out = {};
    spec.split(",").forEach(function (pair) {
      var bits = pair.split(":");
      if (bits.length < 2) return;
      var name = bits[0].trim();
      var raw = bits.slice(1).join(":").trim();
      var v = lookup(state.ui[state.lang], raw);
      if (v === undefined && state.lang !== DEFAULT_LANG) v = lookup(state.ui[DEFAULT_LANG], raw);
      out[name] = v === undefined ? raw : v;
    });
    return out;
  }

  function applyDocument() {
    var root = document.documentElement;
    var meta = LOCALES[state.lang] || LOCALES[DEFAULT_LANG];
    root.lang = meta.htmlLang;
    root.dir = meta.dir;
    root.dataset.lang = state.lang;
    root.classList.remove("i18n-pending"); // release the no-flash guard

    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      el.textContent = t(el.getAttribute("data-i18n"), varsOf(el));
    }

    var htmlNodes = document.querySelectorAll("[data-i18n-html]");
    for (var h = 0; h < htmlNodes.length; h++) {
      htmlNodes[h].innerHTML = t(htmlNodes[h].getAttribute("data-i18n-html"), varsOf(htmlNodes[h]));
    }

    var attrNodes = document.querySelectorAll("[data-i18n-attr]");
    for (var j = 0; j < attrNodes.length; j++) {
      var node = attrNodes[j];
      var spec = node.getAttribute("data-i18n-attr");
      spec.split(",").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length < 2) return;
        var attr = bits[0].trim();
        var value = t(bits.slice(1).join(":").trim(), varsOf(node));
        if (value) node.setAttribute(attr, value);
      });
    }

    if (typeof CBA.render === "function") CBA.render(state.lang);
    updateSwitcher();
    document.dispatchEvent(new CustomEvent("cba:langchange", { detail: { lang: state.lang } }));
  }

  /* --- language switcher -------------------------------------------------- */
  var ICON_GLOBE =
    '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"></circle>' +
    '<path d="M3 12h18"></path>' +
    '<path d="M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18"></path></svg>';

  function buildSwitcher() {
    var mount = document.querySelector("[data-lang-switch]");
    if (!mount || mount.dataset.built === "1") return;
    mount.dataset.built = "1";

    var wrap = document.createElement("div");
    wrap.className = "lang-switch";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "lang-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML =
      '<span class="lang-ico">' + ICON_GLOBE + "</span>" +
      '<span class="lang-current"></span>' +
      '<span class="lang-caret" aria-hidden="true">▾</span>';

    var menu = document.createElement("ul");
    menu.className = "lang-menu";
    menu.setAttribute("role", "listbox");
    ORDER.forEach(function (code) {
      var li = document.createElement("li");
      var opt = document.createElement("button");
      opt.type = "button";
      opt.className = "lang-opt";
      opt.setAttribute("role", "option");
      opt.setAttribute("data-lang", code);
      opt.textContent = LOCALES[code].native; // always its own language
      opt.addEventListener("click", function () {
        setLang(code);
        close();
      });
      li.appendChild(opt);
      menu.appendChild(li);
    });

    function close() {
      wrap.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = wrap.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    mount.appendChild(wrap);
  }

  function updateSwitcher() {
    var wrap = document.querySelector(".lang-switch");
    if (!wrap) return;
    var label = wrap.querySelector(".lang-current");
    var meta = LOCALES[state.lang];
    if (label && meta) label.textContent = meta.native;
    var btn = wrap.querySelector(".lang-btn");
    if (btn) {
      var aria = t("nav.language", { language: meta.native });
      btn.setAttribute("aria-label", aria);
      btn.setAttribute("title", aria);
    }
    var opts = wrap.querySelectorAll(".lang-opt");
    for (var i = 0; i < opts.length; i++) {
      var on = opts[i].getAttribute("data-lang") === state.lang;
      opts[i].setAttribute("aria-selected", on ? "true" : "false");
      opts[i].classList.toggle("is-active", on);
    }
  }

  /* --- public API -------------------------------------------------------- */

  /**
   * Update one query-string parameter in place, keeping ?lang= intact.
   * Used by the tab strip so switching tabs never drops the language.
   */
  function setParam(key, value) {
    try {
      var url = new URL(location.href);
      if (value == null || value === "") url.searchParams.delete(key);
      else url.searchParams.set(key, value);
      url.searchParams.set("lang", state.lang);
      history.replaceState(null, "", url.toString());
    } catch (e) {
      /* ignore */
    }
  }

  function setLang(lang, cb) {
    if (!isLocale(lang)) return;
    state.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* storage blocked — session-only switching still works */
    }
    try {
      var url = new URL(location.href);
      url.searchParams.set("lang", lang);
      history.replaceState(null, "", url.toString());
    } catch (e) {
      /* ignore */
    }
    ensure(lang, function () {
      applyDocument();
      if (cb) cb();
    });
  }

  function boot(cb) {
    var lang = detect();
    state.lang = lang;
    buildSwitcher();
    ensure(lang, function () {
      applyDocument();
      state.ready = true;
      if (typeof CBA.initBehaviors === "function") CBA.initBehaviors();
      queue.splice(0).forEach(function (fn) {
        fn(state.lang);
      });
      if (cb) cb(state.lang);
    });
  }

  /** Run `fn` once the first locale has been applied. */
  function onReady(fn) {
    if (state.ready) fn(state.lang);
    else queue.push(fn);
  }

  CBA.i18n = {
    locales: LOCALES,
    order: ORDER,
    defaultLang: DEFAULT_LANG,
    t: t,
    esc: esc,
    setLang: setLang,
    setParam: setParam,
    boot: boot,
    onReady: onReady,
    get lang() {
      return state.lang;
    },
    get ready() {
      return state.ready;
    },
    get ui() {
      return state.ui[state.lang] || {};
    },
    get content() {
      return state.content[state.lang] || {};
    }
  };
  CBA.esc = esc;

  /* --- auto boot -------------------------------------------------------- */
  /* Pages only need to load the scripts in order; no inline boot call. */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      boot();
    });
  } else {
    boot();
  }
})();
