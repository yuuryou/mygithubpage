/* ==========================================================================
   Cognitive Bias Atlas — lang-detect.js
   Runs synchronously in <head>, before first paint.

   Purpose: set <html lang>, <html data-lang> (which selects the CJK font
   stack) and flag the document as "pending" when the source language of the
   markup differs from the language we are about to switch to, so the visitor
   never sees a flash of the wrong language.

   This is the single source of truth for locale resolution; assets/js/i18n.js
   reuses CBA.pickLang() and only falls back to its own logic if this file is
   missing.
   ========================================================================== */
(function () {
  "use strict";

  var HTML_LANG = {
    "cn-zh": "zh-Hans",
    "cn-tw": "zh-Hant",
    "en-us": "en",
    "jp": "ja"
  };
  var DEFAULT_LANG = "en-us";
  var STORAGE_KEY = "cba.lang";

  function normalize(code) {
    if (!code) return null;
    var c = String(code).toLowerCase().replace(/_/g, "-");
    if (HTML_LANG[c]) return c;
    var parts = c.split("-");
    var base = parts[0];
    var region = parts[1] || "";
    if (base === "zh") {
      return region === "hant" || region === "tw" || region === "hk" || region === "mo"
        ? "cn-tw"
        : "cn-zh";
    }
    if (base === "ja") return "jp";
    if (base === "en") return DEFAULT_LANG;
    return null;
  }

  function pickLang() {
    // 1. explicit ?lang= wins (shareable links)
    var fromQuery = normalize(new URLSearchParams(location.search).get("lang"));
    if (fromQuery) return fromQuery;
    // 2. a language the visitor chose earlier
    try {
      var stored = normalize(localStorage.getItem(STORAGE_KEY));
      if (stored) return stored;
    } catch (e) {
      /* storage blocked (private mode) — fall through */
    }
    // 3. browser preference
    var nav = navigator.languages || [navigator.language];
    for (var i = 0; i < nav.length; i++) {
      var n = normalize(nav[i]);
      if (n) return n;
    }
    return DEFAULT_LANG;
  }

  var CBA = (window.CBA = window.CBA || {});
  CBA.pickLang = pickLang;
  CBA.normalizeLang = normalize;

  var lang = pickLang();
  var root = document.documentElement;
  root.lang = HTML_LANG[lang];
  root.dataset.lang = lang;
  // markup is authored in en-us; hide translatable text only when we must swap
  if (lang !== DEFAULT_LANG) root.classList.add("i18n-pending");
})();
