@AGENTS.md

# Davis Cell Phone Repair — Demo Site

A conversion-focused demo website built to pitch to the real business owner. The
business already ranks #1 on Google with 131 reviews and a 4.6 star rating — the
site's only job is to turn warm leads into calls or walk-ins.

## Project Goal

Remove friction between "I found them on Google" and "I'm heading there now."
Every design and code decision should serve that goal. No SEO fluff, no About
pages, no contact forms. The CTA is a phone call or directions.

## Stack

- **Next.js 16 (App Router)** — TypeScript, no `src/` dir
- **Tailwind CSS v4** — utility-first, mobile-first
- **Formspree** — if a form is ever added (no backend)
- **Vercel** — target deployment platform (free tier)

## Commands

```bash
npm run dev      # local dev server on :3000
npm run build    # production build
npm run lint     # eslint
```

## Site Structure

Single-page site (`/`). All sections scroll vertically — no sub-pages.
Each section has an `id` so nav links can anchor-scroll to it.

```
/   ← single page, all sections below
```

### Section Order (top to bottom)

#### 1. NAV
- Logo (text or SVG) on the left
- Anchor links: Services · Reviews · Contact
- `[Call Now]` button — right side, always visible, `tel:` link
- Sticky on scroll; collapses to hamburger on mobile

#### 2. HERO  `id="hero"`
- Headline: **"Davis' #1 Rated Phone Repair Shop"**
- Subhead: "131 Reviews · 4.6 Stars on Google"
- Two CTAs side by side: `[Get a Quote]` (scrolls to contact form) · `[Call Now]` (`tel:` link)
- Star rating badge (4.6 ★) visible inline

#### 3. SERVICES + PRICING  `id="services"`
- Grid of repair types: iPhone screen · Android screen · Battery · Charging port · Water damage · + others
- Each card shows: repair name, price range (e.g. "$79–$149"), turnaround time (e.g. "~1 hour")
- Mobile: 1 column. Tablet+: 2–3 columns.

#### 4. WHY CHOOSE US  `id="why"`
- 4–5 trust pillars as icon + label cards:
  - Fast Repairs (most done same day)
  - Affordable Pricing
  - 1-Year Warranty
  - Walk-Ins Welcome
  - UC Davis Students Welcome
- Keep copy short — one line per pillar

#### 5. REVIEWS  `id="reviews"`
- 4.6 ★ · 131 Google Reviews badge — large and prominent at top of section
- 3–4 manually curated review cards (real quotes, first name + initial only)
- Each card: star rating, quote, reviewer name

#### 6. CONTACT / BOOKING FORM  `id="contact"`
- Form fields: Name, Phone, Device (select or text), Issue (textarea), Submit
- Beside or below the form: address, hours, click-to-call phone link
- Form submits via Formspree (no backend)

#### 7. GOOGLE MAPS EMBED  `id="map"`
- Full-width iframe embed of 1818 2nd St, Davis, CA 95616
- Tappable on mobile — opens Google Maps app

#### 8. FOOTER
- Business name, address, phone (tap-to-call), hours
- Copyright line
- No social links unless owner provides them

## Conversion Priorities (in order)

1. **Tap-to-call button** — in NAV and HERO, visible without scrolling on any phone
2. **Social proof in HERO** — 4.6 ★ · 131 reviews above the fold, not buried
3. **Price transparency in SERVICES** — ranges shown openly; no "call for pricing"
4. **Quote form** — low-commitment first step before a call
5. **Map embed** — removes the "where exactly are they?" friction

## Code Conventions

- Mobile-first Tailwind: write `sm:` and `md:` breakpoints as overrides, not defaults
- Components live in `components/` at the project root
- Pages live in `app/` using the App Router (`page.tsx`, `layout.tsx`)
- No CSS modules, no styled-components — Tailwind only
- No `any` types in TypeScript
- Phone number is always rendered as `<a href="tel:+15307534888">` for tap-to-call
- Directions link always points to Google Maps with the business address pre-filled

## Content (Real Business Data)

- **Name:** Davis Cell Phone Repair
- **Phone:** (530) 753-4888
- **Address:** 1818 2nd St, Davis, CA 95616
- **Hours:** Mon–Sat 10am–7pm, Sun 11am–6pm
- **Google Rating:** 4.6 ★ · 131 reviews
- **Tagline:** "Davis's fastest phone repair — walk-ins welcome"

## Component Map

```
components/
  Navbar.tsx          # sticky nav with anchor links + Call Now CTA
  Hero.tsx            # headline, subhead, star badge, two CTAs
  Services.tsx        # repair type grid with price ranges + turnaround
  WhyChooseUs.tsx     # trust pillar icon cards
  Reviews.tsx         # rating badge + 3–4 curated review cards
  ContactForm.tsx     # Formspree form + address/hours sidebar
  MapEmbed.tsx        # full-width Google Maps iframe
  Footer.tsx          # name, address, hours, phone, copyright
```

## What NOT to Build

- No separate pages — this is a single-page site with anchor nav
- No blog or SEO content pages
- No multi-step booking flow
- No user accounts or auth
- No CMS integration for this demo
- No animations that delay time-to-interactive on mobile
- No hero image carousels

## Git Workflow

- Commit often, small logical units
- Commit message format: `type: short description` (e.g., `feat: add tap-to-call hero button`)
- Types: `feat`, `fix`, `style`, `chore`, `refactor`
- Push after every meaningful feature or component is complete
