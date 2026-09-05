# jasonyxu.us — Static Site

Personal site of Jason Xu, hosted on GitHub Pages at https://jasonyxu.us/.

## Stack

- Pure static HTML/CSS/JS — no build step, no framework
- GSAP 3.13 (ScrollTrigger + SplitText), local copies under `assets/js/`
- Fonts: Fraunces (display) + Inter (body) via Google Fonts
- Photos: local originals under `assets/photos-keep/` (JPG/HEIC) plus a few legacy
  GoDaddy CDN links (`img1.wsimg.com`) still referenced from older pages

## Pages

Root pages (`index.html`, `about.html`, `interests.html`, `linguistics.html`,
`sociolinguistics.html`, `endangered-languages.html`, `slt.html`, `science.html`,
`evolutionary-medicine.html`, `generative-ai.html`, `agent-skills.html`,
`my-gpts.html`, `publications.html`, `prompt-engineering.html`,
`tiny-experiments.html`, `winter-meadow.html`, `404.html`), plus:

- `articles/*.html` — full essays (linked from `slt.html`)
- `gpts/*.html` — GPT detail pages (linked from `my-gpts.html`)
- `assets/widgets/*.html` — standalone widget pages embedded as iframes
  (chart.js loaded from jsDelivr with SRI)

## Deploy

GitHub Pages from the `master` branch. The `CNAME` file maps the custom domain
`jasonyxu.us`. No Jekyll processing (`.nojekyll` present), so the repository
contents are served as-is.

Workflow: edit the HTML/CSS/JS directly, then

```
git add -A
git commit -m "describe the change"
git push origin master
```

GitHub Pages rebuilds automatically. Version-bump the `?v=` query on
`assets/css/main.css` / `assets/js/main.js` links when you change those files so
browsers pick up the new cache-busted URL. Verify at
https://jasonyxu.us/assets/css/main.css?v=<new>.
