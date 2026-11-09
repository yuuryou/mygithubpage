#!/usr/bin/env python3
"""build_site.py — maintenance script for jasonyxu.us (pure static site).

What it does (each step is opt-in):

  --version VER   统一刷新全站本地资源缓存版本号（assets/css/main.css、
                  assets/js/{main,gsap.min,ScrollTrigger.min,SplitText.min}.js
                  的 ?v= 参数）
  --sitemap       依据实际存在的 .html 重新生成 sitemap.xml，lastmod 取各档
                  最后一次 git 提交日期（无 git 记录时退回档案 mtime）
  --img-dims      为缺少 width/height 的 <img> 补上真实像素尺寸（读取本地图片
                  档或远端图片的真实尺寸，绝不猜测）
  --canonical     为尚未设置 canonical 的页面补上自引用 canonical（子站用）
  --check         校验：sitemap 是否合法 XML、内部链接是否失效、是否仍有
                  缺尺寸的图片、canonical 是否重复
  --all           等价于 --version（取当日版本号）--sitemap --img-dims --check

Design notes
  * 零第三方依赖：图片尺寸由内建 header 解析取得（PNG/JPEG/GIF/WebP/BMP）。
    .jxl 的尺寸取自同名原始图（.jpg/.jpeg/.png/.gif）；原始图已清理时退回
    Pillow + pillow-jxl（可选）。
  * 所有写入都是 UTF-8 且保留原文件的换行符（不静默把 CRLF 改成 LF）。
  * 幂等：重复执行不会产生新的差异；已有 width/height 的 <img> 不会被改动。
  * 只读以外的唯一副作用就是改写 .html / sitemap.xml 文本。

Usage
  python3 scripts/build_site.py --all
  python3 scripts/build_site.py --version 20261109a
  python3 scripts/build_site.py --sitemap --check
  python3 scripts/build_site.py --img-dims --fetch-remote   # 允许抓远端图片取尺寸
"""

from __future__ import annotations

import argparse
import base64
import datetime as _dt
import hashlib
import io
import json
import os
import re
import struct
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://jasonyxu.us"

# 需要带 ?v= 版本号的本地资源（相对路径）
VERSIONED_ASSETS = (
    "assets/css/main.css",
    "assets/js/main.js",
    "assets/js/gsap.min.js",
    "assets/js/ScrollTrigger.min.js",
    "assets/js/SplitText.min.js",
)

# sitemap 排除：内嵌 fragment、错误页
SITEMAP_EXCLUDE_DIRS = {"assets", ".git", "scripts", "temp"}
SITEMAP_EXCLUDE_FILES = {"404.html"}

TEXT_EXT = {".html", ".css", ".js", ".json", ".md", ".txt", ".xml", ".svg", ".py", ".sh"}


# --------------------------------------------------------------------------
# io helpers
# --------------------------------------------------------------------------
def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8", newline="") as fh:
        return fh.read()


def write_text(path: str, text: str) -> None:
    with open(path, "w", encoding="utf-8", newline="") as fh:
        fh.write(text)


def walk_html() -> list[str]:
    out = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = sorted(d for d in dirnames if d not in {".git"})
        for name in sorted(filenames):
            if name.lower().endswith((".html", ".htm")):
                out.append(os.path.join(dirpath, name))
    return out


def rel(path: str) -> str:
    return os.path.relpath(path, ROOT).replace(os.sep, "/")


# --------------------------------------------------------------------------
# image size (dependency-free)
# --------------------------------------------------------------------------
def _size_from_bytes(data: bytes):
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        w, h = struct.unpack(">II", data[16:24])
        return w, h
    if data[:6] in (b"GIF87a", b"GIF89a"):
        w, h = struct.unpack("<HH", data[6:10])
        return w, h
    if data[:2] == b"BM":
        w, h = struct.unpack("<ii", data[18:26])
        return abs(w), abs(h)
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        chunk = data[12:16]
        if chunk == b"VP8 ":
            w = struct.unpack("<H", data[26:28])[0] & 0x3FFF
            h = struct.unpack("<H", data[28:30])[0] & 0x3FFF
            return w, h
        if chunk == b"VP8L":
            b = data[21:25]
            bits = b[0] | (b[1] << 8) | (b[2] << 16) | (b[3] << 24)
            return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
        if chunk == b"VP8X":
            w = int.from_bytes(data[24:27], "little") + 1
            h = int.from_bytes(data[27:30], "little") + 1
            return w, h
    if data[:2] == b"\xff\xd8":  # JPEG: walk markers for SOFn
        i, n = 2, len(data)
        while i < n - 9:
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
                i += 2
                continue
            seg_len = struct.unpack(">H", data[i + 2:i + 4])[0]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                          0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return w, h
            i += 2 + seg_len
    return None


def local_image_size(path: str):
    """Return (w, h) for a local image path, or None. .jxl 走同名原始图。"""
    if not os.path.isfile(path):
        return None
    ext = os.path.splitext(path)[1].lower()
    if ext == ".jxl":
        base = os.path.splitext(path)[0]
        for orig in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
            if os.path.isfile(base + orig):
                return local_image_size(base + orig)
        try:  # optional: Pillow + pillow-jxl
            from PIL import Image  # type: ignore
            import pillow_jxl  # noqa: F401  # type: ignore
            with Image.open(path) as im:
                return im.size
        except Exception:
            return None
    with open(path, "rb") as fh:
        head = fh.read(64 * 1024)
    if ext in (".jpg", ".jpeg") and len(head) >= 64 * 1024:
        with open(path, "rb") as fh:
            head = fh.read()
    return _size_from_bytes(head)


def remote_image_size(url: str, cache: dict, fetch: bool):
    key = hashlib.sha1(url.encode("utf-8")).hexdigest()
    if key in cache:
        val = cache[key]
        return tuple(val) if val else None
    if not fetch:
        return None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (build_site)"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        size = _size_from_bytes(data)
    except Exception as exc:  # network/CND hiccup: never guess
        print(f"    ! remote fetch failed: {url} ({exc})")
        size = None
    cache[key] = list(size) if size else None
    return size


# --------------------------------------------------------------------------
# steps
# --------------------------------------------------------------------------
def step_version(version: str) -> None:
    pat = re.compile(r"\?v=([0-9A-Za-z._-]+)")
    changed, total = 0, 0
    for path in walk_html():
        text = read_text(path)
        original = text

        def repl(match):
            nonlocal total
            total += 1
            return f"?v={version}"

        text = pat.sub(repl, text)
        if text != original:
            write_text(path, text)
            changed += 1
    print(f"[version] {version}: {total} 处引用 / {changed} 个文件已更新")


def sitemap_entries() -> list[tuple[str, str]]:
    entries = []
    for path in walk_html():
        r = rel(path)
        top = r.split("/")[0]
        if top in SITEMAP_EXCLUDE_DIRS:
            continue
        if r in SITEMAP_EXCLUDE_FILES:
            continue
        name = os.path.basename(r)
        if name.lower().endswith(".htm") and not name.lower().endswith(".html"):
            continue
        if name == "index.html":
            url_dir = os.path.dirname(r)
            url = f"{SITE}/{url_dir}/" if url_dir else f"{SITE}/"
        else:
            url = f"{SITE}/{r}"
        url = urllib.parse.quote(url, safe=":/?#[]@!$&'()*+,;=%~")
        entries.append((url, path))
    entries.sort(key=lambda e: e[0])
    return entries


def git_last_commit_date(path: str) -> str | None:
    try:
        out = subprocess.run(
            ["git", "-C", ROOT, "log", "-1", "--format=%cs", "--", rel(path)],
            capture_output=True, text=True, timeout=30, check=False,
        )
    except Exception:
        return None
    date = out.stdout.strip()
    return date or None


def step_sitemap() -> None:
    entries = sitemap_entries()
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url, path in entries:
        lastmod = git_last_commit_date(path)
        if not lastmod:
            lastmod = _dt.date.fromtimestamp(os.path.getmtime(path)).isoformat()
        loc = url.replace("&", "&amp;").replace("<", "&lt;")
        lines.append(f"  <url><loc>{loc}</loc><lastmod>{lastmod}</lastmod></url>")
    lines.append("</urlset>\n")
    out = os.path.join(ROOT, "sitemap.xml")
    write_text(out, "\n".join(lines))
    dates = sorted({re.search(r"<lastmod>([^<]+)", ln).group(1) for ln in lines if "<lastmod>" in ln})
    print(f"[sitemap] {len(entries)} 条 URL，lastmod 取值 {dates[0]} … {dates[-1]}（共 {len(dates)} 种）")


IMG_RE = re.compile(r"<img\b[^>]*>", re.IGNORECASE)


def _resolve_local(html_path: str, src: str) -> str | None:
    if src.startswith(("http://", "https://", "//", "data:")):
        return None
    src = src.split("?")[0].split("#")[0]
    if not src:
        return None
    if src.startswith("/"):
        return os.path.join(ROOT, src.lstrip("/"))
    return os.path.normpath(os.path.join(os.path.dirname(html_path), urllib.parse.unquote(src)))


def step_img_dims(fetch_remote: bool) -> None:
    cache_path = os.path.join(tempfile.gettempdir(), "mygithubpage_imgdims.json")
    try:
        with open(cache_path, encoding="utf-8") as fh:
            cache = json.load(fh)
    except Exception:
        cache = {}

    added = skipped = already = 0
    skip_list: list[str] = []
    for html_path in walk_html():
        text = read_text(html_path)
        original = text
        pieces = []
        last = 0
        for match in IMG_RE.finditer(text):
            tag = match.group(0)
            if "width=" in tag and "height=" in tag:
                already += 1
                continue
            src_m = re.search(r'\bsrc\s*=\s*"([^"]*)"', tag, re.IGNORECASE)
            if not src_m:
                skipped += 1
                continue
            src = src_m.group(1)
            size = None
            if src.startswith("data:"):
                try:
                    payload = src.split(",", 1)[1]
                    size = _size_from_bytes(base64.b64decode(payload + "==="))
                except Exception:
                    size = None
            elif src.startswith(("http://", "https://", "//")):
                url = src if src.startswith("http") else "https:" + src
                size = remote_image_size(url, cache, fetch_remote)
            else:
                path = _resolve_local(html_path, src)
                size = local_image_size(path) if path else None
            if not size:
                skipped += 1
                skip_list.append(f"{rel(html_path)} :: {src[:80]}")
                continue
            w, h = int(size[0]), int(size[1])
            extra = ""
            if "width=" not in tag:
                extra += f' width="{w}"'
            if "height=" not in tag:
                extra += f' height="{h}"'
            new_tag = tag[:-1].rstrip() + extra + ">"
            pieces.append((match.start(), match.end(), new_tag))
            added += 1
        if pieces:
            for start, end, new_tag in reversed(pieces):
                text = text[:start] + new_tag + text[end:]
        if text != original:
            write_text(html_path, text)

    with open(cache_path, "w", encoding="utf-8") as fh:
        json.dump(cache, fh)
    print(f"[img-dims] 新增 width/height: {added} 个；已有尺寸: {already} 个；无法取得尺寸: {skipped} 个")
    if not fetch_remote and skipped:
        print("        （远端图片默认不抓取，加 --fetch-remote 可补齐）")
    for line in skip_list[:20]:
        print(f"        skip: {line}")


CANON_RE = re.compile(r'<link\s+rel="canonical"[^>]*>', re.IGNORECASE)


def canonical_url(html_path: str) -> str:
    r = rel(html_path)
    if os.path.basename(r) == "index.html":
        d = os.path.dirname(r)
        url = f"{SITE}/{d}/" if d else f"{SITE}/"
    else:
        url = f"{SITE}/{r}"
    return urllib.parse.quote(url, safe=":/?#[]@!$&'()*+,;=%~")


def step_canonical() -> None:
    """只为缺少 canonical 的页面补自引用 canonical，已有的一律不动。"""
    added, kept = 0, 0
    for html_path in walk_html():
        if rel(html_path).split("/")[0] in SITEMAP_EXCLUDE_DIRS:
            continue  # 内嵌 widget fragment 不需要 canonical
        text = read_text(html_path)
        if CANON_RE.search(text):
            kept += 1
            continue
        url = canonical_url(html_path)
        tag = f'<link rel="canonical" href="{url}">'
        m = re.search(r'<meta\s+name="description"[^>]*>', text, re.IGNORECASE)
        if m:
            idx = m.end()
        else:
            idx = text.lower().find("</head>")
            if idx < 0:
                print(f"    ! no </head> in {rel(html_path)}, skipped")
                continue
        text = text[:idx] + "\n" + tag + text[idx:]
        write_text(html_path, text)
        added += 1
        print(f"        + {rel(html_path)} → {url}")
    print(f"[canonical] 新增 {added} 个，已存在 {kept} 个")


LINK_RE = re.compile(r'(?:href|src)\s*=\s*"([^"]+)"', re.IGNORECASE)


def step_check() -> int:
    problems = 0

    # 1) sitemap 合法 XML
    sm = os.path.join(ROOT, "sitemap.xml")
    try:
        tree = ET.parse(sm)
        ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locs = [e.text for e in tree.getroot().findall(".//s:loc", ns)]
        print(f"[check] sitemap.xml 合法 XML，{len(locs)} 条 URL")
        missing = []
        for loc in locs:
            p = urllib.parse.unquote(loc.replace(SITE + "/", ""))
            p = p or "index.html"
            full = os.path.join(ROOT, p)
            if p.endswith("/") or p == "":
                full = os.path.join(full, "index.html")
            if not os.path.isfile(full):
                missing.append(loc)
        if missing:
            problems += len(missing)
            print(f"[check] sitemap 指向不存在的页面 {len(missing)} 个: {missing[:5]}")
    except Exception as exc:
        problems += 1
        print(f"[check] sitemap.xml 解析失败: {exc}")

    # 2) 内部链接 / 资源引用是否存在
    broken: list[str] = []
    for html_path in walk_html():
        text = read_text(html_path)
        for m in LINK_RE.finditer(text):
            ref = m.group(1).strip()
            if not ref or ref.startswith(("http://", "https://", "//", "data:", "mailto:",
                                          "tel:", "#", "javascript:")):
                continue
            ref = ref.split("#")[0].split("?")[0]
            if not ref:
                continue
            target = _resolve_local(html_path, ref)
            if target and not os.path.exists(target):
                broken.append(f"{rel(html_path)} → {ref}")
    if broken:
        problems += len(broken)
        print(f"[check] 失效内部引用 {len(broken)} 处")
        for b in broken[:10]:
            print(f"        {b}")
    else:
        print("[check] 无失效内部链接")

    # 3) 缺尺寸图片
    lacking = 0
    for html_path in walk_html():
        for tag in IMG_RE.findall(read_text(html_path)):
            if "width=" not in tag or "height=" not in tag:
                lacking += 1
    print(f"[check] 仍缺 width/height 的 <img>: {lacking} 个")

    # 4) canonical 唯一
    dup = 0
    for html_path in walk_html():
        count = len(CANON_RE.findall(read_text(html_path)))
        if count > 1:
            dup += 1
            print(f"        ! canonical 重复 {count} 次: {rel(html_path)}")
    problems += dup
    print(f"[check] canonical 重复的页面: {dup} 个")

    print(f"[check] 结论: {'通过' if problems == 0 else f'{problems} 处待处理'}")
    return problems


def main() -> int:
    ap = argparse.ArgumentParser(description="Maintenance build for jasonyxu.us")
    ap.add_argument("--version", nargs="?", const=_dt.date.today().strftime("%Y%m%d") + "a",
                    help="刷新资源版本号，缺省为当日 + a 后缀")
    ap.add_argument("--sitemap", action="store_true", help="重建 sitemap.xml")
    ap.add_argument("--img-dims", action="store_true", help="补齐 <img> width/height")
    ap.add_argument("--canonical", action="store_true", help="补齐缺失的 canonical")
    ap.add_argument("--fetch-remote", action="store_true", help="抓取远端图片以取得真实尺寸")
    ap.add_argument("--check", action="store_true", help="校验产出")
    ap.add_argument("--all", action="store_true", help="version + sitemap + img-dims + check")
    args = ap.parse_args()

    did = False
    if args.version is not None:
        step_version(args.version)
        did = True
    if args.sitemap:
        step_sitemap()
        did = True
    if args.img_dims:
        step_img_dims(args.fetch_remote)
        did = True
    if args.canonical:
        step_canonical()
        did = True
    if args.all:
        step_version(args.version or (_dt.date.today().strftime("%Y%m%d") + "a"))
        step_sitemap()
        step_img_dims(args.fetch_remote)
        step_canonical()
        return 1 if step_check() else 0
    if args.check:
        return 1 if step_check() else 0
    if not did:
        ap.print_help()
    return 0


if __name__ == "__main__":
    sys.exit(main())
