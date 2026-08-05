# ShuruKar — PRD

## Original problem statement
Single-page, mobile-first marketing + lead-capture site for **ShuruKar**, an AI-powered
entrepreneurship mentor app built under **The Bharat Project** (founded by Shradha Sharma,
founder of YourStory). The app is 15–20 days from launching on iOS/Android. This site is the
interim front door: capture aspiring entrepreneurs' ideas and contact details now, show them
the movement is already real and moving, and convert them into app users at launch.
Deployment target: **shurukar.in**.

## User personas
- **First-time, first-generation entrepreneur, Tier 2/3/4 India.** Has an idea, nobody to ask.
  Mid-range Android, 4G. Reads Hindi/Hinglish, not startup English.
- **Someone with no idea yet** who wants inspiration and a launch notification.
- **Government / press / partner contact** viewing on desktop — needs credibility and momentum proof.

## Core requirements (static)
- Voice: warm, Hindi-first Hinglish, trusted elder sibling (Didi) — never corporate, never
  government-portal, no jargon ("ecosystem", "stakeholders", "leverage").
- Design: explicitly NOT government-looking. Saffron/amber accent (#EA580C / #C2410C) on
  cream (#FEF9F3) with deep charcoal-navy (#14213D) dark sections. Poppins display + Inter body.
  Rounded corners, soft shadows, generous whitespace.
- Mobile-first, fast load, thumb-friendly targets, sticky bottom CTA on mobile.
- Primary conversion point: idea submission form. Mobile number is the key field for the
  app-launch notification campaign. Data must be exportable.

## Architecture
- **Frontend:** React (CRA + craco), Tailwind (custom `saffron` / `ink` / `cream` / `charcoal`
  tokens), framer-motion for reveals + counters, recharts for the age chart,
  react-fast-marquee for the live ticker, lucide-react icons.
- **Backend:** FastAPI, all routes under `/api`. MongoDB via `MONGO_URL` / `DB_NAME`.
- **Object storage:** Emergent object storage (`EMERGENT_LLM_KEY`) for optional file/photo uploads.
- **Email:** Resend confirmation email on submit (skipped gracefully while `RESEND_API_KEY` is empty).

### Endpoints
| Route | Purpose |
|---|---|
| `POST /api/submit-idea` | Idea submission + validation (mobile, age group, consent) |
| `POST /api/upload` | Optional image/PDF attachment (max 8MB) |
| `GET /api/files/{path}` | Serve an uploaded file |
| `GET /api/stats` | Live dashboard counters (baseline 5127 ideas / 412 cities + real) |
| `GET /api/recent-submissions` | Anonymised ticker feed |
| `GET /api/admin/export.csv` | Full CSV export for the launch migration campaign |

## Implemented (June 2026)
- Sticky glass nav with anchor links + persistent "Apna Idea Submit Karein" CTA; mobile menu.
- **S1 Hero:** headline, sub-line, floating phone mockup with animated Hindi AI-chat bubbles,
  dual CTAs, Bharat Project trust strip.
- **S2 Why ShuruKar:** thesis headline, 5 recurring-question icon cards, pull-quote, sub-tagline.
- **S3 Ek Mentor Jo Kabhi Busy Nahi Hota:** 4 stat chips (24×7 / 7 din / Aapki Bhasha / Free).
- **S4 What You Get:** 5-card bento grid (Business Idea + idea chips, 300+ Schemes, 1000+ Idea
  Bank, Shradha's Course, AI Tools) + full-width dark movement statement.
- **S5 Founder / The Movement:** organic-masked portrait, pull-quote, scrollable city chips.
- **S6 Bharat Project — Ab Tak Ka Safar:** 4 animated counters + 4-step milestone strip with a
  glowing "Aap yahan hain" current marker; real launch photo.
- **S7 Live Dashboard:** 3 animated counters (live from MongoDB + baseline), age-group recharts
  bar (labelled *Illustrative data* until ≥20 real submissions), auto-scrolling submission ticker.
- **S8 Idea Submission Form:** single card, chip selects, +91-locked mobile, rotating idea
  placeholder, "mujhe idea nahi hai" toggle, real file upload, required consent, inline Hinglish
  validation, full card-swap success state with confetti + WhatsApp/X/Instagram share.
- **S9 Footer:** dark closing banner + CTA, 3 link columns, socials, italic disclaimer.
- SEO title/meta/OG tags, brand logos trimmed and served locally.
- Verified end-to-end by the testing agent: 12/12 backend cases, all frontend flows, 100% pass.

## Placeholders to swap
- Final 1200×630 OG share image (`/app/frontend/public/index.html`).
- Privacy/Terms/Contact pages (currently `#`).
- Phone-mockup screens → actual app screenshots at launch.

## Done in follow-up (June 2026)
- Resend API key wired; confirmation email sends on submit when an email is provided.
- Real Shradha Sharma photo added to the Founder section (and column width fixed).
- Real social URLs wired in the footer (X / Instagram / YouTube / LinkedIn) and in the
  success-state Instagram share.

## Backlog
**P0**
- Verify `shurukar.in` domain in Resend and switch `SENDER_EMAIL` off `onboarding@resend.dev`
  (current sender has a ~1/day quota and only delivers to the account owner).
- Protect `GET /api/admin/export.csv` with an admin token (currently open).
- Rate-limit / basic bot protection on `POST /api/submit-idea`.

**P1**
- WhatsApp notification on launch day (Twilio/Gupshup) using the captured mobile numbers.
- Store `created_at` as a native datetime and query "today" with datetime objects.
- Admin dashboard view of submissions (filter by city / stage / age group).
- Privacy Policy and Terms pages.

**P2**
- Language toggle if analytics show demand for full Devanagari.
- Idea Bank teaser section with a few sample ideas.
- App Store / Play Store badges once live.

## Next tasks
1. Get the Resend API key + real founder photo and social links from the client.
2. Secure the CSV export endpoint and add submit rate-limiting.
3. Wire the launch-day WhatsApp/SMS notification campaign.
