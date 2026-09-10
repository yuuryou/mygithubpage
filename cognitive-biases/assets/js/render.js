/* ==========================================================================
   Cognitive Bias Atlas — render.js
   Builds every content region from language-neutral structure (atlas.js,
   references.js) plus the active locale's content (biases.<lang>.js) and UI
   strings (ui.<lang>.js).

   Citations always come from atlas.js / references.js and are rendered
   verbatim: they are never passed through translation.

   Mount points are declared in HTML as  <div data-render="key"></div>.
   ========================================================================== */
(function () {
  "use strict";

  var CBA = (window.CBA = window.CBA || {});

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* --- accessors -------------------------------------------------------- */
  function t(key, vars) {
    return CBA.i18n ? CBA.i18n.t(key, vars) : key;
  }
  function content() {
    return (CBA.i18n && CBA.i18n.content) || {};
  }
  function entry(slug) {
    return content()[slug] || null;
  }
  function refs(slug) {
    var atlas = CBA.atlas || {};
    return (atlas.refs && atlas.refs[slug]) || [];
  }
  function atlas() {
    return CBA.atlas || { categories: [], extras: [] };
  }
  function catMeta(code) {
    var cats = atlas().categories;
    for (var i = 0; i < cats.length; i++) if (cats[i].code === code) return cats[i];
    return null;
  }
  function countOf(cat) {
    var n = 0;
    cat.subcategories.forEach(function (s) {
      n += s.slugs.length;
    });
    return n;
  }
  function totalBiasCount() {
    var n = 0;
    atlas().categories.forEach(function (c) {
      n += countOf(c);
    });
    return n + atlas().extras.length;
  }

  /* --- bias card -------------------------------------------------------- */
  function biasCard(slug, accent) {
    var e = entry(slug);
    if (!e) return "";
    var r = refs(slug);
    var tags = "";
    if (e.application) tags += '<span class="mini-tag">' + esc(t("card.tagApplication")) + "</span>";
    if (e.debiasing) tags += '<span class="mini-tag">' + esc(t("card.tagDebiasing")) + "</span>";
    if (r.length) tags += '<span class="mini-tag">' + esc(t("card.tagSources")) + "</span>";

    var mini = (e.examples || [])
      .slice(0, 2)
      .map(function (x) {
        return '<div class="example">' + esc(x) + "</div>";
      })
      .join("");

    return (
      '<article class="glass-card bias-card reveal" data-bias="' + esc(slug) + '" style="--accent:' + accent + '">' +
      '<div class="top"><h4>' + esc(e.name) + "</h4></div>" +
      '<p class="definition">' + esc(e.definition) + "</p>" +
      (mini ? '<div class="examples-mini">' + mini + "</div>" : "") +
      (tags ? '<div class="tag-row">' + tags + "</div>" : "") +
      "</article>"
    );
  }

  /* --- bias modal -------------------------------------------------------- */
  function openBias(slug, accent) {
    var e = entry(slug);
    if (!e) return;
    var dlg = document.querySelector("dialog[data-modal='bias']");
    if (!dlg) return;
    var r = refs(slug);
    var html =
      '<div class="modal-panel" style="--accent:' + accent + '">' +
      /* the ✕ sits outside .modal-scroll, so it stays put while a long entry
         (definition / examples / application / debiasing / sources) scrolls */
      '<button class="modal-close" type="button" aria-label="' + esc(t("modal.close")) + '">✕</button>' +
      '<div class="modal-scroll">' +
      '<h2 class="modal-title">' + esc(e.name) + "</h2>" +
      '<div class="modal-body">' +
      "<h5>" + esc(t("modal.definition")) + "</h5>" +
      '<p class="definition">' + esc(e.definition) + "</p>" +
      "<h5>" + esc(t("modal.examples")) + "</h5>" +
      (e.examples || []).map(function (x) {
        return '<div class="example">' + esc(x) + "</div>";
      }).join("") +
      (e.application
        ? "<h5>" + esc(t("modal.application")) + "</h5><p>" + esc(e.application) + "</p>"
        : "") +
      (e.debiasing
        ? "<h5>" + esc(t("modal.debiasing")) + "</h5><p>" + esc(e.debiasing) + "</p>"
        : "") +
      (r.length
        ? "<h5>" + esc(t("modal.sources")) + "</h5>" +
          /* data-citation marks source strings that must stay in the original
             language; no translation is ever applied to their contents. */
          '<ul class="modal-refs" data-citation="apa">' +
          r.map(function (x) {
            return "<li>" + esc(x) + "</li>";
          }).join("") +
          "</ul>"
        : "") +
      "</div>" +
      "</div></div>";
    dlg.innerHTML = html;
    dlg.setAttribute("aria-label", e.name);
    var close = dlg.querySelector(".modal-close");
    if (close) close.addEventListener("click", function () { dlg.close(); });
    // showModal() throws InvalidStateError on a dialog that is already open,
    // which is exactly what happens when the language changes mid-view.
    if (typeof dlg.showModal === "function" && !dlg.open) dlg.showModal();
  }

  /* --- region renderers --------------------------------------------------- */
  var REGIONS = {
    /* Home: the four category cards */
    "home-categories": function () {
      return atlas()
        .categories.map(function (c, i) {
          var n = countOf(c);
          return (
            '<a href="category-' + c.code + '.html" class="glass-card cat-card cat-accent-' + (i + 1) +
            ' reveal" style="--accent:' + c.accent + '">' +
            '<span class="num">CATEGORY ' + c.code + "</span>" +
            "<h3>" + esc(t("cat." + c.code + ".title")) + "</h3>" +
            '<div class="cat-zh">' + esc(t("cat." + c.code + ".short")) + "</div>" +
            "<p>" + esc(t("cat." + c.code + ".desc")) + "</p>" +
            '<div style="display:flex;align-items:center">' +
            '<span class="count">' + esc(t("bias.count", { n: n })) + "</span>" +
            '<span class="go">' + esc(t("card.explore")) + " <span>→</span></span>" +
            "</div></a>"
          );
        })
        .join("");
    },

    /* Home: four-axis strip */
    "home-axis": function () {
      return atlas()
        .categories.map(function (c) {
          return (
            '<div class="item"><b style="color:' + c.accent + '">' +
            esc(c.code + " · " + t("cat." + c.code + ".title")) +
            "</b><span>" + esc(t("cat." + c.code + ".short")) + " · " +
            esc(t("bias.countShort", { n: countOf(c) })) + "</span></div>"
          );
        })
        .join("");
    },

    /* Home: hero statistics */
    "home-stats": function () {
      var stats = [
        [totalBiasCount(), t("home.statEntries")],
        [atlas().categories.length, t("home.statCategories")],
        [(CBA.researchMethodCount() || 6), t("home.statMethods")],
        [(CBA.references || []).length, t("home.statRefs")]
      ];
      return stats
        .map(function (s) {
          return '<div class="stat"><b>' + s[0] + "</b><span>" + esc(s[1]) + "</span></div>";
        })
        .join("");
    },

    /* Home: debiasing chip strip */
    "home-chips": function () {
      var chips = CBA.i18n.ui.home && CBA.i18n.ui.home.chips ? CBA.i18n.ui.home.chips : [];
      return chips
        .map(function (c) {
          return '<span class="chip">' + esc(c) + "</span>";
        })
        .join("");
    },

    /* Category pages: tab strip */
    "category-tabs": function (page) {
      var c = catMeta(page.cat);
      if (!c) return "";
      return c.subcategories
        .map(function (s) {
          return (
            '<button class="tab" role="tab" aria-selected="false" data-target="tab-' + s.code +
            '" style="--accent:' + c.accent + '">' + esc(t("sub." + s.code)) + "</button>"
          );
        })
        .join("");
    },

    /* Category pages: one panel per subcategory */
    "category-panels": function (page) {
      var c = catMeta(page.cat);
      if (!c) return "";
      return c.subcategories
        .map(function (s) {
          var cards = s.slugs
            .map(function (slug) {
              return biasCard(slug, c.accent);
            })
            .join("");
          return (
            '<div class="tabpanel" id="tab-' + s.code + '" role="tabpanel" aria-label="' +
            esc(t("sub." + s.code)) + '">' +
            '<div class="sub-head"><h3>' + esc(t("sub." + s.code)) + "</h3></div>" +
            '<div class="bias-grid">' + cards + "</div>" +
            "</div>"
          );
        })
        .join("");
    },

    /* Extension page: entry-count chips */
    "extension-chips": function () {
      var n = atlas().extras.length;
      return (
        '<span class="chip">' + esc(t("extension.chipCount", { n: n })) + "</span>" +
        '<span class="chip">' + esc(t("extension.chipSource")) + "</span>"
      );
    },

    /* Extension page */
    extras: function () {
      var accent = atlas().extraAccent || "#fcd34d";
      return atlas().extras
        .map(function (x) {
          return biasCard(x.slug, accent);
        })
        .join("");
    },

    /* Research page: debiasing method cards */
    methods: function () {
      var list = (CBA.i18n.ui && CBA.i18n.ui.researchMethods) || [];
      return list
        .map(function (m, i) {
          return (
            '<div class="glass-card method-card reveal" style="--accent:#34d399">' +
            '<div class="step">' + esc(t("research.methodLabel", { n: pad2(i + 1) })) + "</div>" +
            "<h4>" + esc(m.title) + "</h4>" +
            "<p>" + esc(m.body) + "</p>" +
            (m.ref ? '<p class="ref" data-citation="apa">' + esc(m.ref) + "</p>" : "") +
            "</div>"
          );
        })
        .join("");
    },

    /* Research page: frontier items */
    frontiers: function () {
      var list = (CBA.i18n.ui && CBA.i18n.ui.researchFrontier) || [];
      return list
        .map(function (m) {
          return (
            '<div class="glass-card frontier-item reveal" style="--accent:#a78bfa">' +
            "<h4>" + esc(m.title) + "</h4>" +
            "<p>" + esc(m.body) + "</p>" +
            (m.ref ? '<span class="ref">' + esc(m.ref) + "</span>" : "") +
            "</div>"
          );
        })
        .join("");
    },

    /* References page — original language, never translated */
    references: function () {
      return (CBA.references || [])
        .map(function (r) {
          return "<li>" + r + "</li>";
        })
        .join("");
    },

    /* References page: footer note with the live entry count */
    "references-note": function () {
      return esc(t("references.note", { n: (CBA.references || []).length }));
    }
  };

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /* Regions that read bias entries. Pages declare data-needs="biases" to have
     biases.<lang>.js loaded; other regions only need UI strings. */
  var NEEDS_BIAS_CONTENT = { "category-panels": 1, extras: 1 };

  /* --- page context ------------------------------------------------------- */
  function pageContext() {
    var b = document.body;
    return { page: b.dataset.page || "", cat: b.dataset.cat || "" };
  }

  /* --- main render pass ---------------------------------------------------- */
  function render(lang) {
    var ctx = pageContext();
    var mounts = document.querySelectorAll("[data-render]");
    for (var i = 0; i < mounts.length; i++) {
      var el = mounts[i];
      var key = el.getAttribute("data-render");
      var fn = REGIONS[key];
      if (typeof fn !== "function") continue;
      // Skip bias-entry regions until biases.<lang>.js has registered content.
      if (NEEDS_BIAS_CONTENT[key] && !Object.keys(content()).length) continue;
      el.innerHTML = fn(ctx);
      /* Re-rendering replaces every child, so behaviour bindings recorded on
         this mount are stale. Clearing the flag lets app.js re-bind tabs. */
      delete el.dataset.tabsBound;
    }
    // If a bias dialog is currently open, refresh it in the new language.
    var open = document.querySelector("dialog[data-modal='bias'][open]");
    if (open && open.dataset.bias) openBias(open.dataset.bias, open.dataset.accent || "var(--c1)");

    if (typeof CBA.refreshBehaviors === "function") CBA.refreshBehaviors();
  }

  CBA.render = render;
  CBA.openBias = openBias;
  CBA.researchMethodCount = function () {
    var l = (CBA.i18n && CBA.i18n.ui && CBA.i18n.ui.researchMethods) || [];
    return l.length;
  };
  CBA.esc = esc;
})();
