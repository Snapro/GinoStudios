#!/usr/bin/env python3
"""
Gino Studios — Phase 1 Patch Script
Applies all Phase 1 fixes to every HTML and CSS file in the repo.
Run from the root of your local GinoStudios repo clone:
    python patch_phase1.py

What it fixes in every HTML file:
  1. Adds favicon block to <head>
  2. Adds Google Fonts <link> + preload (replaces CSS @import approach)
  3. Replaces all contact.html#quote links → gino-pricing/index.html
  4. Replaces copyright year 2024 → 2025
  5. Replaces all static.wixstatic.com image src/content URLs → local asset paths
  6. Fixes broken double-quote on gino-pricing href
  7. Fixes OG image meta tags to self-hosted URL

What it fixes in styles.css:
  8. Removes @import for Google Fonts (now loaded via HTML <link>)
"""

import os
import re
import sys

# ── CONFIG ────────────────────────────────────────────────────────────────────

FONTS_URL = (
    "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800"
    "&family=Outfit:wght@300;400;500;600&display=swap"
)

FAVICON_ROOT = """\
<link rel="icon" type="image/x-icon" href="assets/icons/favicon.ico"/>
<link rel="icon" type="image/png" sizes="32x32" href="assets/icons/favicon-32x32.png"/>
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png"/>"""

FAVICON_SUB = """\
<link rel="icon" type="image/x-icon" href="../assets/icons/favicon.ico"/>
<link rel="icon" type="image/png" sizes="32x32" href="../assets/icons/favicon-32x32.png"/>
<link rel="apple-touch-icon" href="../assets/icons/apple-touch-icon.png"/>"""

FONTS_BLOCK_ROOT = f"""\
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link rel="preload" as="style" href="{FONTS_URL}"/>
<link rel="stylesheet" href="{FONTS_URL}"/>"""

FONTS_BLOCK_SUB = FONTS_BLOCK_ROOT  # same — fonts are absolute URLs

# Wix CDN partial hash → local asset path (relative to repo root)
# Add new entries here as you discover more Wix URLs in future files
WIX_MAP = {
    # Hero / global
    "99dcc6_d1a86966a2034bcdb5ce9c550fa4976c": "assets/images/hero/hero-bg.webp",
    "375f7d_8dbfb72fa2d041339bdcffc567cad146": "assets/images/hero/banner.webp",
    # About page
    "nsplsh_9bd17f69f7084181894142bc17ea8aad": "assets/images/about/studio.webp",
    "nsplsh_31386e5238357757794c59":            "assets/images/about/studio.webp",
    "99dcc6_648d8f2001d04c22822561772dddf73d": "assets/images/about/portrait.webp",
    # Portfolio covers
    "375f7d_4ae0a2849d6c49d7a57697e208d21ae4": "assets/images/portfolio/mcti-trade-fair/cover.webp",
    "375f7d_b26e8d681c80415ab38b562a31159b1a": "assets/images/portfolio/mcti-caminex/cover.webp",
    "99dcc6_af7d92678e3c4b3894d27d8f594ed45f": "assets/images/portfolio/bankers-robbers/cover.webp",
    "99dcc6_d7bae79700ae4082a06a934a38839395": "assets/images/portfolio/samfya-beach/cover.webp",
    "99dcc6_14b5a58f18394048b6a822ff68b3fc0a": "assets/images/portfolio/tomorrow-investments/cover.webp",
    "99dcc6_ca4a6775ec564be980026aa3a0b0fd38": "assets/images/portfolio/24six-mishpacha/cover.webp",
    "99dcc6_c7b4cb57f1bf4313ab9b865fb8f81f28": "assets/images/portfolio/pet-joy-store/cover.webp",
    "99dcc6_f0816680f215444db7bb5cd7c2351d78": "assets/images/portfolio/gravity-power/cover.webp",
    "99dcc6_d6a02f85620e4bbbaaf9f818f4b4ac63": "assets/images/portfolio/soa/cover.webp",
    "99dcc6_c967ace6ee3942db9fa8c5d5ee335f4e": "assets/images/portfolio/buy-build-sell/cover.webp",
    # Services section images
    "99dcc6_3c9b9877b917406993dcfaa961194df4": "assets/images/services/arch-vis.webp",
    "375f7d_7dd03f9761484ec19b33bad1587a2524": "assets/images/services/motion-design.webp",
    "99dcc6_ae0c1879ba0b458985c5566cd3a6fbe6": "assets/images/services/graphics-print.webp",
    "99dcc6_c3cba914b1524205870d8d4d56d768ea": "assets/images/services/photography.webp",
    "99dcc6_62ffbaa5ec9e46bcaa3f8ef5120d0596": "assets/images/services/web-design.webp",
}

# ── HELPERS ───────────────────────────────────────────────────────────────────

def depth(filepath):
    """Return directory depth relative to repo root (0 = root, 1 = one level down)."""
    parts = filepath.replace("\\", "/").split("/")
    return len(parts) - 1

def rel_prefix(d):
    """Return path prefix for a given depth (0 → '', 1 → '../')."""
    return "../" * d

def apply_wix_replacements(html, d):
    """Replace all Wix CDN URLs in src and content attributes with local paths."""
    prefix = rel_prefix(d)
    changes = 0
    for wix_hash, local in WIX_MAP.items():
        pattern = rf'https://static\.wixstatic\.com/media/{re.escape(wix_hash)}[^"\']*'
        replacement = prefix + local
        new_html, n = re.subn(pattern, replacement, html)
        if n:
            changes += n
            html = new_html
    # Catch any remaining wixstatic URLs we don't have in the map
    remaining = re.findall(r'https://static\.wixstatic\.com/media/[^"\']+', html)
    if remaining:
        print(f"  ⚠  Unmapped Wix URL(s) — add to WIX_MAP:")
        for u in set(remaining):
            short = u.split("/media/")[1][:48]
            print(f"      {short}...")
    return html, changes

def insert_favicon(html, d):
    """Insert favicon block after <link rel="canonical"> or before first <link rel="stylesheet">."""
    block = FAVICON_SUB if d > 0 else FAVICON_ROOT
    if 'favicon.ico' in html:
        return html, 0  # already present
    # Try inserting after canonical link
    canonical_pat = r'(<link rel="canonical"[^/]*/?>)'
    m = re.search(canonical_pat, html)
    if m:
        insert_pos = m.end()
        return html[:insert_pos] + "\n" + block + html[insert_pos:], 1
    # Fallback: before first <link rel="stylesheet">
    stylesheet_pat = r'(<link rel="stylesheet")'
    m = re.search(stylesheet_pat, html)
    if m:
        insert_pos = m.start()
        return html[:insert_pos] + block + "\n" + html[insert_pos:], 1
    return html, 0

def insert_fonts(html, d):
    """Replace bare preconnects with full preconnect + preload + stylesheet."""
    if FONTS_URL in html:
        return html, 0  # Google Fonts link already present
    # Match the two preconnect lines (various whitespace/quote styles)
    pat = (
        r'<link rel=["\']preconnect["\'] href=["\']https://fonts\.googleapis\.com["\'][^/]*/?>'
        r'\s*'
        r'<link rel=["\']preconnect["\'] href=["\']https://fonts\.gstatic\.com["\'][^/]*/?>[ \t]*'
    )
    block = FONTS_BLOCK_SUB if d > 0 else FONTS_BLOCK_ROOT
    new_html, n = re.subn(pat, block + "\n", html, flags=re.IGNORECASE)
    return new_html, n

def fix_quote_links(html, d):
    """Replace contact.html#quote with gino-pricing/index.html."""
    prefix = rel_prefix(d)
    target = prefix + "gino-pricing/index.html"
    patterns = [
        (r'href=["\'](?:\.\.\/)*contact\.html#quote["\']', f'href="{target}"'),
        (r'href=["\']#quote["\']', f'href="{target}"'),
        # Fix the specific broken double-quote bug
        (r'href=["\'](?:\.\.\/)*gino-pricing/index\.html["\']["\']+', f'href="{target}"'),
    ]
    changes = 0
    for pat, rep in patterns:
        new_html, n = re.subn(pat, rep, html)
        if n:
            changes += n
            html = new_html
    return html, changes

def fix_copyright_year(html):
    """Update hardcoded 2024 copyright year to 2025."""
    new_html, n = re.subn(
        r'(<span class=["\']current-year["\']>)2024(</span>)',
        r'\g<1>2025\2',
        html
    )
    return new_html, n

def fix_og_images(html, d):
    """Replace Wix-hosted OG image meta content with self-hosted URL."""
    prefix = rel_prefix(d) if d == 0 else ""
    og_replacement = "https://ginostudios.zm/assets/images/og-home.jpg"
    pat = r'(content=["\'])https://static\.wixstatic\.com/media/[^"\']+(["\'])'
    new_html, n = re.subn(pat, rf'\g<1>{og_replacement}\g<2>', html)
    return new_html, n

# ── CSS PATCH ─────────────────────────────────────────────────────────────────

def patch_css(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        css = f.read()
    original = css
    # Remove Google Fonts @import (now handled in HTML)
    pat = r'@import\s+url\(["\']?https://fonts\.googleapis\.com[^)]+["\']?\)\s*;?\s*\n?'
    css, n = re.subn(pat, "", css, flags=re.IGNORECASE)
    if n:
        # Add a comment at the top so it's clear why it was removed
        css = "/* Google Fonts loaded via <link> in HTML head — @import removed (Phase 1) */\n" + css
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(css)
        print(f"  ✓  Removed @import Google Fonts from {filepath}")
    else:
        print(f"  –  No @import found in {filepath} (may already be clean)")
    return n > 0

# ── HTML PATCH ────────────────────────────────────────────────────────────────

def patch_html(filepath):
    rel = filepath.replace("\\", "/")
    d = depth(rel)
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    original = html
    report = []

    html, n = insert_favicon(html, d);           n and report.append(f"favicon added")
    html, n = insert_fonts(html, d);             n and report.append(f"Google Fonts link added")
    html, n = fix_quote_links(html, d);          n and report.append(f"{n} quote link(s) fixed")
    html, n = fix_copyright_year(html);          n and report.append(f"copyright year → 2025")
    html, n = apply_wix_replacements(html, d);   n and report.append(f"{n} Wix URL(s) replaced")
    html, n = fix_og_images(html, d);            n and report.append(f"{n} OG image(s) fixed")

    if html != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  ✓  {filepath}")
        for r in report:
            print(f"      · {r}")
    else:
        print(f"  –  {filepath} (no changes needed)")

# ── MAIN ──────────────────────────────────────────────────────────────────────

def main():
    repo_root = os.path.dirname(os.path.abspath(__file__))
    print(f"\nGino Studios — Phase 1 Patch Script")
    print(f"Repo root: {repo_root}\n")

    # Directories to skip
    skip_dirs = {".git", "node_modules", "__pycache__"}

    html_files = []
    css_files = []

    for dirpath, dirnames, filenames in os.walk(repo_root):
        # Prune skipped dirs
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for fname in filenames:
            full = os.path.join(dirpath, fname)
            rel = os.path.relpath(full, repo_root).replace("\\", "/")
            if fname.endswith(".html"):
                html_files.append(rel)
            elif fname.endswith(".css"):
                css_files.append(rel)

    print(f"Found {len(html_files)} HTML files and {len(css_files)} CSS files.\n")

    print("── CSS ──────────────────────────────────────────")
    for f in css_files:
        patch_css(f)

    print("\n── HTML ─────────────────────────────────────────")
    for f in sorted(html_files):
        patch_html(f)

    print("\n✅  Phase 1 patch complete.")
    print("   Review changes with: git diff")
    print("   Commit with: git add -A && git commit -m 'Phase 1: emergency fixes applied'")
    print()
    print("⚠  Remaining manual steps:")
    print("   1. Add favicon files to assets/icons/ (generate at realfavicongenerator.net)")
    print("   2. Populate assets/images/ with your actual WebP image files (Phase 2)")
    print("   3. Check for any ⚠ Unmapped Wix URL warnings above and add to WIX_MAP\n")

if __name__ == "__main__":
    main()
