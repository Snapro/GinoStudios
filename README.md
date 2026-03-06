# Gino Studios Zambia — Static Website

> **YOU CREATE THE NARRATIVE. We make it unforgettable.**  
> Lusaka-based creative studio · Architectural Visualisation · Motion Design · Photography · Graphics · Web

---

## 60-Second Overview

This is a fully static, production-ready website for **Gino Studios Zambia** built to deploy on Netlify with zero backend. It includes:

- **8 core pages** + **5 service detail pages** + **3 blog posts** + legal pages (18 pages total)
- **Netlify Forms** for Contact, Quote, and Newsletter (no backend required)
- **Security headers** and redirect rules via `netlify.toml`
- **Responsive dark luxury editorial** design (mobile-first, WCAG-aware)
- **Minimal JavaScript** — vanilla JS only, no frameworks
- **SEO-ready** — title tags, meta descriptions, OpenGraph, Twitter cards, JSON-LD schema
- **Lazy-loaded images** and animated stat counters

---

## 🗂 Folder Structure

```
/
├── index.html              ← Home page
├── about.html              ← About page
├── portfolio.html          ← Portfolio / work showcase
├── contact.html            ← Contact + Quote request forms
├── privacy.html            ← Privacy Policy
├── terms.html              ← Terms & Conditions
├── netlify.toml            ← Netlify build, headers, redirects
├── site-config.json        ← Site-wide configuration reference
├── README.md               ← This file
├── SOURCE_ATTRIBUTION.txt  ← Content sourcing notes
│
├── services/
│   ├── index.html          ← Services overview page
│   ├── service-1.html      ← Architectural Visualisation
│   ├── service-2.html      ← Motion Design
│   ├── service-3.html      ← Graphics Design & Print
│   ├── service-4.html      ← Photography & Videography
│   └── service-5.html      ← Web Design & Development
│
├── blog/
│   ├── index.html          ← Blog listing page
│   ├── post-1.html         ← Architectural Visualisation post
│   ├── post-2.html         ← Motion Design post
│   └── post-3.html         ← Brand Strategy post
│
├── assets/
│   ├── images/             ← Add your images here
│   │   └── og-home.jpg     ← OpenGraph image (1200×630px)
│   ├── icons/              ← Favicon, PWA icons
│   └── social/             ← Social media assets
│
├── css/
│   └── styles.css          ← Single master stylesheet
│
└── js/
    └── main.js             ← Single vanilla JS file
```

---

## ✏️ How to Edit Content

### Text Content
All content lives directly in the `.html` files. Search for the text you want to change and edit it in place.

**To update the company tagline:**  
Search for `YOU CREATE THE NARRATIVE` across all files.

**To update contact details:**  
Search for `[PLACEHOLDER:` in all files — these mark every field needing real data. Key placeholders:
- `hello@ginostudios.zm` → replace with real email
- `+260 000 000 000` → replace with real phone number

**To add portfolio images:**  
1. Place images in `assets/images/portfolio/`
2. In `portfolio.html`, replace each `.pf-card-inner` placeholder div with an `<img>` tag:
```html
<img src="assets/images/portfolio/your-image.jpg" alt="Project description" loading="lazy" />
```

**To add blog posts:**  
Duplicate `blog/post-1.html`, rename it, and update the title, date, tag, and body content. Then add a card to `blog/index.html`.

---

## 🎨 How to Change Branding

All design tokens are defined as CSS custom properties at the top of `css/styles.css`:

```css
:root {
  --bg-base:        #080b0f;   /* Main background */
  --gold:           #c8a96e;   /* Primary accent colour */
  --gold-light:     #e2c48a;   /* Lighter accent */
  --text-primary:   #f2ede4;   /* Main text */
  --text-secondary: #a8a099;   /* Body text */
  --font-display:   'Syne', sans-serif;    /* Headings */
  --font-body:      'Outfit', sans-serif;  /* Body text */
}
```

**To change the accent colour:** Update `--gold` and `--gold-light`.  
**To switch to a light theme:** Update `--bg-base`, `--bg-surface`, `--bg-card` to light values and adjust text colours accordingly.  
**To change fonts:** Update the `@import url()` at the top of `styles.css` and the `--font-display` / `--font-body` variables.

---

## 🚀 How to Deploy to Netlify

### Method 1: Git (Recommended)

1. Push this repository to GitHub:
```bash
git init
git add .
git commit -m "Initial commit — Gino Studios website"
git remote add origin https://github.com/YOUR_USERNAME/ginostudios-zm.git
git push -u origin main
```

2. Go to [app.netlify.com](https://app.netlify.com)
3. Click **"Add new site" → "Import an existing project"**
4. Connect your GitHub account and select this repository
5. Build settings:
   - **Build command:** *(leave blank)*
   - **Publish directory:** `.`
6. Click **Deploy site**

### Method 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy (from repo root)
netlify init
netlify deploy --prod
```

### Method 3: Drag & Drop

1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag the entire project folder onto the Netlify drop zone
3. Done — your site is live

---

## 🌐 How to Connect a Custom Domain

1. In Netlify Dashboard → **Site settings → Domain management**
2. Click **"Add a domain"**
3. Enter your domain (e.g. `ginostudios.zm`)
4. Update your DNS records at your registrar:
   - **A record:** `75.2.60.5` (Netlify's load balancer)
   - **CNAME for www:** `your-site-name.netlify.app`
5. Netlify will auto-provision an SSL certificate via Let's Encrypt

---

## 📬 How to Activate Netlify Forms

All three forms (`contact`, `quote`, `newsletter`) are already configured with:
- `data-netlify="true"`
- `name="form-name"` hidden input
- Honeypot spam protection field

**To activate:**
1. Deploy the site to Netlify at least once
2. Go to **Netlify Dashboard → Forms**
3. Your forms will appear automatically after the first successful submission
4. Set up **email notifications** in Forms → Settings → Notifications
5. Optionally connect to Zapier, Slack, or other integrations

**To test:** Submit each form after deployment. Check the Forms dashboard for incoming submissions.

---

## 📊 How to Add Google Analytics

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
3. Add this snippet before `</head>` in every HTML page:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

4. Update the CSP in `netlify.toml` if needed (the current policy already allows `googletagmanager.com`).

---

## ♿ Accessibility Testing Checklist

- [ ] All images have descriptive `alt` attributes
- [ ] Form inputs have associated `<label>` elements
- [ ] Color contrast ratio ≥ 4.5:1 for normal text (check with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/))
- [ ] All interactive elements are keyboard-navigable (Tab key)
- [ ] Focus indicators are visible (`:focus` styles present)
- [ ] ARIA attributes used where appropriate (`aria-label`, `aria-expanded`)
- [ ] Page `<title>` is unique and descriptive on every page
- [ ] Semantic HTML structure used (`<nav>`, `<main>`, `<article>`, `<footer>`, headings hierarchy)
- [ ] No content relies solely on colour to convey meaning
- [ ] Mobile nav closes on link click and restores scroll
- [ ] Run [WAVE accessibility checker](https://wave.webaim.org/) on each page

---

## ⚡ Performance Optimization Checklist

- [ ] All images converted to WebP format (use [Squoosh](https://squoosh.app/))
- [ ] Images sized appropriately for their display size
- [ ] `loading="lazy"` added to all below-fold images
- [ ] Images have explicit `width` and `height` attributes (prevents CLS)
- [ ] Google Fonts loaded with `font-display: swap`
- [ ] CSS minified for production (`npx clean-css-cli css/styles.css -o css/styles.min.css`)
- [ ] JS minified (`npx terser js/main.js -o js/main.min.js`)
- [ ] No unused CSS (audit with Chrome DevTools Coverage tab)
- [ ] Netlify asset compression enabled (automatic)
- [ ] Lighthouse score ≥ 90 on all pages (test with [PageSpeed Insights](https://pagespeed.web.dev/))

---

## 🎨 Mini Style Guide

### Colours
| Token | Hex | Usage |
|---|---|---|
| `--bg-base` | `#080b0f` | Page background |
| `--bg-surface` | `#0f1318` | Elevated surfaces |
| `--bg-card` | `#141920` | Card backgrounds |
| `--gold` | `#c8a96e` | Primary accent, CTAs |
| `--gold-light` | `#e2c48a` | Hover states |
| `--text-primary` | `#f2ede4` | Headings, emphasis |
| `--text-secondary` | `#a8a099` | Body copy |
| `--text-muted` | `#5c5650` | Labels, captions |

### Typography
| Role | Font | Weight |
|---|---|---|
| Display / Headings | Syne | 800 |
| Sub-headings | Syne | 700 |
| Labels / Eyebrows | Syne | 600 |
| Body copy | Outfit | 400 |
| Body emphasis | Outfit | 500 |
| Light text | Outfit | 300 |

### Spacing Scale
`4px · 8px · 12px · 16px · 24px · 32px · 48px · 64px · 96px · 120px`

### Border Radius
- `sm` — 4px (buttons, inputs)
- `md` — 8px (small cards)
- `lg` — 16px (large cards, sections)

### Breakpoints
- Mobile: `< 480px`
- Tablet: `480px – 768px`
- Desktop: `768px – 1024px`
- Wide: `> 1024px`
- Max content width: `1280px`

---

## 📋 Content Update Notes

All placeholder text is marked with `[PLACEHOLDER: ...]` comments throughout the HTML files. Before launch, search for `PLACEHOLDER` and replace every instance with real content.

Critical placeholders:
1. **Email address** — `hello@ginostudios.zm`
2. **Phone number** — `+260 000 000 000`
3. **Portfolio images** — all `.pf-card` sections
4. **Blog cover images** — all `.blog-image-placeholder` sections
5. **Service/About images** — all `.service-image-placeholder` sections
6. **OG image** — `assets/images/og-home.jpg` (1200×630px recommended)
7. **Favicon** — `assets/icons/favicon.ico`

---

*Built for Gino Studios Zambia · © <span class="current-year">2024</span> · Deploy on Netlify*
