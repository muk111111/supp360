# SUPP360 — Supply Chain Website

Static, dependency-free website for **SUPP360** — *Move. Store. Fulfil. Pack.*
Built to be hosted on GitHub Pages at **https://supp360.com** (no `github.io` in the URL).

Deliberately a different design language from vensunservices.com: light canvas, violet/mint/amber/coral
service colours, rounded cards, pill controls, a tabbed service switcher and a mega-menu — Zoho-style,
product-led, rather than the navy corporate look.

## Pages

| File | Page | URL |
|---|---|---|
| `index.html` | Home — hero, stats strip, tabbed services, service cards, why SUPP360, how we work, industries, CTA | `/` |
| `services.html` | Services — all four service lines in full (anchors: `#transportation`, `#warehousing`, `#fulfilment`, `#fulfilment-dark`, `#packaging`) + FAQ | `/services` |
| `about.html` | About Us — approach, how we operate, coverage across the chain | `/about` |
| `contact.html` | Contact Us — enquiry form + phone / WhatsApp / email / address | `/contact` |
| `404.html` | Not-found page (served automatically by GitHub Pages) | — |

Supporting files: `assets/css/styles.css`, `assets/js/main.js` (nav, mega-menu, tabs, reveal),
`assets/js/form.js` (enquiry form), `assets/img/favicon.svg`, `assets/img/og-image.svg`,
`sitemap.xml`, `robots.txt`, `CNAME`, `.nojekyll`.

Header and footer markup is repeated in each HTML file (plain static site, no build step) — if you
change a nav link or a phone number, update it in **all** pages.

## ⚠️ Fill these in before going live

Search and replace across all files:

| Placeholder | Where | Replace with |
|---|---|---|
| `+91 00000 00000` | topbar + footer of every page, `contact.html`, `index.html` JSON-LD | real phone number |
| `tel:+910000000000` | same places | `tel:+91XXXXXXXXXX` |
| `910000000000` | `assets/js/form.js` (`WHATSAPP_NUMBER`), `contact.html` wa.me link | WhatsApp number, digits only, no `+` |
| `info@supp360.com` | topbar, footer, `contact.html`, `form.js` (`FALLBACK_EMAIL`), JSON-LD | real enquiry inbox |
| `Corporate Office Address Line 1 / Area, City, State — PIN Code` | footer of every page, `contact.html`, JSON-LD (`postalCode: 000000`) | real office address |
| `Mon – Sat: 9:30 AM – 6:30 PM` | footer, `contact.html` | real business hours |

Quick way to do the phone/email swap:

```bash
cd mukul2
grep -rl '00000 00000' . --include='*.html'          # see which files are affected
sed -i '' 's/+91 00000 00000/+91 98765 43210/g' *.html
sed -i '' 's/910000000000/919876543210/g' *.html assets/js/form.js
```

## Enquiry form

The site is static, so the form does not post to a server. On submit it builds a formatted message
and opens WhatsApp with it pre-filled (`assets/js/form.js`). Set `WHATSAPP_NUMBER` there.
If you'd rather receive emails, swap in a Formspree / Google Forms endpoint in the same file.

## Photography

Section images are loaded from the Unsplash CDN (free to use, no attribution required) and declared
as CSS backgrounds in `assets/css/styles.css` (`.ph-logistics`, `.ph-warehouse`, `.ph-fulfilment`,
`.ph-packaging`, `.ph-team`). Each sits on a colour gradient, so if an image fails to load the layout
still looks intentional.

To use your own photos: drop files into `assets/img/` and change the matching `url(...)` to
e.g. `url("../img/warehouse.jpg")`. Keep JPEGs under ~300 KB.

## Local preview

```bash
python3 serve.py        # http://localhost:8000
```

Use `serve.py`, not `python3 -m http.server`. The site uses extensionless URLs (`/services`, not
`/services.html`), which GitHub Pages resolves automatically but the stock Python server does not —
`serve.py` reproduces that behaviour, and also serves `404.html` for unknown paths.

## Hosting — GitHub Pages + GoDaddy domain

### 1. Push the site to GitHub

```bash
cd mukul2
git init
git add -A
git commit -m "SUPP360 website"
git branch -M main
git remote add origin https://github.com/<your-username>/supp360.git
git push -u origin main
```

(Create the empty **public** repo `supp360` on GitHub first.)

### 2. Turn on GitHub Pages

Repo → **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main`, folder `/ (root)` → Save.

Same page → **Custom domain** → enter `supp360.com` → Save.
Leave **Enforce HTTPS** for later (step 4).

The `CNAME` file in this repo already contains `supp360.com` — don't delete it.

### 3. DNS settings in GoDaddy

GoDaddy → **My Products** → next to `supp360.com` click **DNS** → **Manage Zones / DNS Records**.

**Delete first** (GoDaddy adds these by default and they break Pages):
* the parked `A` record on `@` pointing at a GoDaddy IP (e.g. `Parked` / `76.76.21.21`)
* any `CNAME` on `www` pointing to `@` or to a GoDaddy domain-forwarding target
* any GoDaddy **Forwarding** rule on the domain (Domain Settings → Forwarding → delete)

**Then add these records** (TTL: leave as 1 hour / default):

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 1 hour |
| A | `@` | `185.199.109.153` | 1 hour |
| A | `@` | `185.199.110.153` | 1 hour |
| A | `@` | `185.199.111.153` | 1 hour |
| CNAME | `www` | `<your-username>.github.io` | 1 hour |

Notes:
* In GoDaddy, `@` means the root domain (`supp360.com`). Type `@` exactly.
* The CNAME value must end with a dot-less `github.io` — e.g. `muk111111.github.io` — **not** the repo URL.
* Optionally also add the four AAAA records for IPv6:
  `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (Name `@`).
* Leave GoDaddy nameservers as they are — you're only editing records, not delegating DNS.

### 4. Back in GitHub

Wait for DNS to propagate (usually 30 min, can take a few hours), then:
Repo → **Settings → Pages** → the custom domain should show a green check → tick **Enforce HTTPS**.

If it shows "domain does not resolve", wait longer and click **Remove**/re-add the custom domain once.

### 5. Verify

```bash
dig supp360.com +short          # should list the four 185.199.x.153 addresses
dig www.supp360.com +short      # should show <your-username>.github.io
curl -I https://supp360.com     # should return 200 after HTTPS is issued
```

## URLs

Pages are linked without the `.html` extension, root-relative. The `.html` URLs still work
(GitHub Pages serves both), so any link already shared stays valid. Each page's
`<link rel="canonical">` points at the extensionless form, which is what search engines index.
