# Fundamental — Image & Video Asset Guide

Upload sizes for every visual slot on the site. "Rendered size" is the largest
box the asset displays in; "Upload" is the recommended file to put in Sanity
(2× rendered width for sharp retina display). JPG/WebP for photos, SVG for
logos, MP4 (H.264 + AAC) for video.

## Current assets (already in the repo and in `sanity/seed/images/`)

| File | Actual dimensions | Used at |
| --- | --- | --- |
| `public/founder/anjan-1.jpg` | 2000 × 1335 px (landscape 3:2) | Home founder carousel, photo 1 |
| `public/founder/anjan-2.jpg` | 2000 × 1335 px (landscape 3:2) | Home founder carousel, photo 2 |
| `public/founder/anjan-3.jpg` | 2000 × 1335 px (landscape 3:2) | Home founder carousel, photo 3 |
| `public/founder/anjan-about.jpg` | 1335 × 2000 px (portrait 2:3) | About page portrait |
| `public/logo.svg` | vector, 331 × 67 units (≈4.9:1) | Header, waitlist (green on light) |
| `public/logo-light.svg` | vector, 329 × 67 units | Footer (light on green) |
| `app/icon.svg` | vector, 375 × 375 units | Favicon / browser tab |

## Image slots — what to upload in Sanity

| Slot (Sanity field) | Aspect ratio | Rendered size (desktop) | Recommended upload |
| --- | --- | --- | --- |
| Founder → carouselPhotos | 4:3 landscape | 384 × 288 px | **1600 × 1200 px** min |
| Founder → aboutPhoto | 2:3 portrait | 384 px wide, natural height | **1200 × 1800 px** min |
| Program → image (listing card) | ~8:3 wide | 352 × 96 px | **800 × 300 px** |
| Blog post → heroImage | 2:1 | 672 × 224 px (article), 352 × 144 px (card) | **1600 × 800 px** |
| Testimonial → photo | 1:1 square | 48 × 48 px | **400 × 400 px** |
| Lead magnet → cover | 4:5 portrait | 176 × 224 px | **800 × 1000 px** |
| Community page → photo | ~2:1 | 384 × 208 px | **1200 × 650 px** |
| About page → studioPhotos | 2:1.25 | 300 × 160 px each | **800 × 500 px** each |
| Certificate mock-up (program page) | ~8:5 | 288 × 176 px | **1080 × 660 px** |

Keep photos under ~400 KB each (Sanity serves them resized and optimized via
its CDN automatically, but smaller originals upload faster).

## Video slots

| Slot | Aspect | Player size | Recommended file |
| --- | --- | --- | --- |
| Founder → videoUrl ("Why I built Fundamental", home) | 16:9 | 320 px wide docked, full-width mobile | **1920 × 1080 px**, MP4 (H.264 + AAC), ≤ 60 MB, 2–3 min |
| Program page founder video (same asset reused) | 16:9 | 288 px wide | same file |
| Testimonial videos (future) | 16:9 | card width | **1280 × 720 px** min |

To activate the founder video: upload the MP4 anywhere public (Sanity file
asset, Mux, or YouTube-hosted MP4 link) and paste the URL into
**Studio → Founder → videoUrl** — autoplay-on-scroll and the minimizing
mini-player switch on automatically. (A local file at
`public/founder/intro.mp4` also works.)

## How content flows

- Edit at **`/studio`** (or `npx sanity dev` locally). Changes go live on the
  site within **60 seconds** (ISR revalidation).
- If a field or document is empty in Sanity, the site falls back to the
  built-in defaults in `lib/cms.ts` — nothing ever breaks.
- One-time import of all current content: see README → CMS section.
