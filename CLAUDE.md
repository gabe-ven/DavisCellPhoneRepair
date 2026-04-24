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

```
/            Home — above-the-fold CTA, pricing preview, reviews, hours + map
/pricing     Full repair price list by device and repair type
```

That's it. Two pages maximum. Do not add pages without a clear conversion reason.

## Conversion Priorities (in order)

1. **Tap-to-call button** — must be visible without scrolling on any phone
2. **Get Directions button** — second most important action
3. **Today's hours / open status** — shown immediately, no clicking
4. **Price transparency** — listed openly; hiding prices kills trust
5. **Social proof** — 4.6 ★ · 131 Google Reviews shown above the fold

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

## What NOT to Build

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
