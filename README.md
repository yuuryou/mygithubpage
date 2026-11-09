---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: f0a6a996fecad35f3342e9897b50bd7b_fe0b1c55a66b11f199d2525400287e28
    ReservedCode1: ES0FQIDUQ9mc8NSilmkrVrCwBAY+/j0z33Ha9E+g0T4/qUABbDtWwpkS+5ZoWu1JLcvrMGxuS8BFEfeeHL7BGWPIEmqVcGXanygYNueq8WeUod1IPrQ4K/Mrrw0s9z+36FOH6TTaSMu8bs/yJCaKCRvZoWv+vhPeRudFNZt3icDpwzJpYWwaKBbImcc=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: f0a6a996fecad35f3342e9897b50bd7b_fe0b1c55a66b11f199d2525400287e28
    ReservedCode2: ES0FQIDUQ9mc8NSilmkrVrCwBAY+/j0z33Ha9E+g0T4/qUABbDtWwpkS+5ZoWu1JLcvrMGxuS8BFEfeeHL7BGWPIEmqVcGXanygYNueq8WeUod1IPrQ4K/Mrrw0s9z+36FOH6TTaSMu8bs/yJCaKCRvZoWv+vhPeRudFNZt3icDpwzJpYWwaKBbImcc=
---

# jasonyxu.us — Redesigned Static Site

Dark editorial redesign of https://jasonyxu.us/ built with the installed design skills
(GSAP 8-skill set + morphicons / shadcn-ui / awesome-design-md / ui-ux-pro-max / impeccable).

## Stack
- Pure static HTML/CSS/JS — no framework, no runtime build step (the optional
  maintenance script is `scripts/build_site.py`, see below)
- GSAP 3.13 (ScrollTrigger + SplitText) via local copies in `assets/js/`
- Fonts: Fraunces (display) + Inter (body) via Google Fonts
- Photos are served locally as JPEG XL (`.jxl`) from `assets/photos-hero/`,
  `assets/photos-thumb/`, `assets/photos-keep/` — same pixels as the original
  JPEG/PNG files, roughly 55–70% smaller. The original images are kept in place;
  only a handful of legacy editorial images still load from the `img1.wsimg.com` CDN.
- Home hero uses the existing Vimeo background video

## Pages (47 URLs in `sitemap.xml` — no single-page layout)
```
index.html                     Home (Vimeo hero + site cards + photo strip)
interests.html                 My interests hub
├── linguistics.html           10 branches
│   ├── sociolinguistics.html
│   └── endangered-languages.html
├── slt.html                   Second Language Teaching (essay index)
│   └── articles/*.html        5 full essays (cleaned & paginated)
├── science.html
│   └── evolutionary-medicine.html
├── generative-ai.html         History timeline + hubs
├── agent-skills.html
winter-meadow.html             Cat gallery (15 photos + lightbox)
publications.html              Papers + projects
prompt-engineering.html        Tools + NotebookLM embed
├── my-gpts.html               8 GPT cards
│   └── gpts/*.html            8 GPT detail pages
about.html                     CV, languages, CTUIR links, tiny experiments
tiny-experiments.html
404.html                       (excluded from sitemap)

cognitive-biases/              Sub-site: Cognitive Bias Atlas (8 pages)
├── category-I.html … category-IV.html
├── extension.html
├── references.html
└── research.html

childhood-trauma-study/        Sub-site: CPTSD guide PWA (10 pages, en / zh-Hant / zh-Hans)
├── cptsd-en.html, CPTSD childhood trauma.html, CPTSD childhood trauma-cn.html
├── development.html, development-en.html, development-cn.html
└── references.html, references-en.html, references-cn.html
```

Embedded HTML fragments live in `assets/widgets/` — they are loaded in iframes by
their parent pages and are intentionally **not** listed in the sitemap.

## Build & maintenance — `scripts/build_site.py`

There is no bundler and nothing to compile before deploying. `scripts/build_site.py`
is a zero-dependency (stdlib-only) maintenance script that keeps the hand-written
pages consistent:

```bash
python3 scripts/build_site.py --all            # bump version, sitemap, img sizes, then verify
python3 scripts/build_site.py --version 20261109a   # set ?v= on local assets, all pages
python3 scripts/build_site.py --sitemap        # rebuild sitemap.xml from the files on disk
python3 scripts/build_site.py --img-dims       # fill missing <img width height> from real files
python3 scripts/build_site.py --img-dims --fetch-remote  # also fetch CDN images for sizes
python3 scripts/build_site.py --canonical      # add self-referencing canonical to new pages
python3 scripts/build_site.py --check          # validate sitemap XML, internal links, img sizes
```

What each step guarantees:
- `--version` rewrites the `?v=` cache-busting parameter on `assets/css/main.css`,
  `assets/js/main.js` and the three GSAP files, so every page shares one version.
- `--sitemap` walks the real `.html` files (skipping `404.html`, `assets/`, `scripts/`,
  `temp/`), URL-encodes spaces, and stamps each `<lastmod>` with that file's last git
  commit date (falling back to mtime), so the dates actually differ per page.
- `--img-dims` reads the true pixel size from the image file itself — for `.jxl` it reads
  the matching original in the same folder, so no dimensions are ever guessed. It only
  adds the attributes that are missing and never rewrites existing ones.
- `--check` parses `sitemap.xml` as XML, verifies that every `href`/`src` in the site
  resolves to a file on disk, and reports any `<img>` still missing a size.

`main.css` pairs these attributes with `:where(img[width][height]) { height: auto; }`
(zero specificity, so class rules such as `.card-media img` keep full control) — the
attributes reserve the right box before the image decodes, which removes layout shift
without changing the rendered layout.

## Text encoding & line endings
`.gitattributes` normalizes every text file to LF (`text=auto eol=lf`) and marks images,
video, audio, fonts and archives as `binary`, so `.jxl` / `.mp4` files are never treated
as text. `.gitignore` keeps OS noise, `temp/` and local backups out of the repo.


## Motion (GSAP)
- Hero entrance: SplitText line reveal
- Scroll reveals: staggered sections/cards via ScrollTrigger
- `.js-split` headings: word-by-word mask reveal
- Home photo strip: horizontal parallax drift
- Gallery: subtle image parallax + full lightbox
- `prefers-reduced-motion` fully respected

## Deploy (GoDaddy — the site is hosted at jasonyxu.us)
1. Upload the contents of this folder to your hosting root (public_html / htdocs).
2. Because pages use relative paths (`./assets/...`, `../assets/...`), the whole
   folder can be dropped in place and every link keeps working.
3. If you deploy at the domain root, set `index.html` as the default document
   (usually already the case).
4. For HTTPS on the custom domain, enable the hosting SSL certificate in GoDaddy.

## To customize
- Design tokens (colors, fonts): `assets/css/main.css` → `:root`
- Nav items live in the markup of each page (no shared NAV array); after editing
  pages, run `python3 scripts/build_site.py --all` to refresh `sitemap.xml`, the
  `?v=` asset version and any new `<img>` sizes
- Photos: local `.jxl` files under `assets/photos-*/`; legacy editorial images still
  reference the `img1.wsimg.com` CDN
*（内容由AI生成，仅供参考）*
