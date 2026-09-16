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
- Pure static HTML/CSS/JS — no build step, no framework
- GSAP 3.13 (ScrollTrigger + SplitText) via local copies in `assets/js/`
- Fonts: Fraunces (display) + Inter (body) via Google Fonts
- All photos served from the existing img1.wsimg.com CDN (no asset migration needed)
- Home hero uses the existing Vimeo background video

## Pages (30 total — no single-page layout)
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
404.html
```

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
- Nav items: edit `NAV` in the build script (`temp/build_site.py`) and rebuild
- Photos: files reference existing `img1.wsimg.com` URLs — swap the `IMG` constant
*（内容由AI生成，仅供参考）*
