# Specification

## Summary
**Goal:** Build a full professional Catholic church website for "Parishudda Japamaala Maatha Devalayamu (Holy Rosary Catholic Church)" in Nellore, with a public landing page and a protected admin dashboard backed by a Motoko canister.

**Planned changes:**

### Landing Page (Single Page)
- **Navbar:** Transparent on load, transitions to solid deep navy when scrolled > 50px; includes church name and anchor links to all sections.
- **Hero Section:** Full-width church hero image with `linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)` overlay; church name displayed prominently in white Playfair Display text.
- **Announcements Banner:** Reads from backend; shows highlight text and event date only when `active` is `true`.
- **Daily Mass Schedule:** Displays a card/table of mass timings (Day, Time, Service Type) fetched from backend; seeded with Sunday 6:30 AM Telugu Mass and Sunday 8:30 AM English Mass.
- **Daily Spiritual Message:** Card showing Title, Author, Date, and a text excerpt; "Read More" opens an animated modal with the full message text.
- **Prayer Module:** Displays prayer cards fetched from backend; language toggle (Telugu / English) filters visible prayers in real time; at least 2 sample prayers per language seeded.
- **Church Media Gallery:** Responsive grid of images and YouTube video embeds with captions, fetched from backend.
- **Online Donation CTA:** Prominent button with a subtle CSS pulse animation (CTA/link only, no payment gateway).
- **Google Map Section:** Church address in Nellore displayed with a "View on Google Maps" button opening `https://share.google/RgB7sMob1CDcBHUIp` in a new tab.
- **Footer:** Church full name, basic info.

### Visual Theme
- Primary colors: deep navy/midnight blue and warm ivory/cream.
- Gold accent `#D4AF37` on borders, headings, and highlights.
- Playfair Display (serif) for all headings; clean sans-serif for body.
- Gold borders on Priest Welcome and Feast Day cards.
- Scroll-triggered slide-up animations on every section.

### Admin Dashboard (`/admin`)
- Login page with hardcoded password `ChurchofHolyRosary@2026`; valid session stored in `localStorage`; wrong password shows an error.
- Session persists across tab switches and refreshes; logout clears session and all draft data.
- Unsaved form draft state persisted in `localStorage`; restored on return/refresh; cleared on save or logout.
- **Four management modules:**
  1. **Mass Schedule:** Add / edit / delete entries (Day, Time, Service Type).
  2. **Spiritual Message:** Form with Title, Author, Full Text, Date fields.
  3. **Media Gallery:** Single file upload, bulk folder selection (`webkitdirectory`), YouTube URL input with captions; delete existing items.
  4. **Announcements:** Highlight Text, Event Date, Active toggle.
- Each module has a Save button that calls the Motoko backend to persist data; landing page reflects updates after save.

### Motoko Backend (`backend/main.mo`)
- Single actor with stable variables for: `massTimings`, `spiritualMessage`, `mediaItems`, `announcement`.
- Query and update functions exposed for all four data types.
- Default seed data for mass schedule and prayers.

**User-visible outcome:** Visitors see a beautiful, sacred-themed church website with live mass schedules, spiritual messages, a prayer module, media gallery, donation CTA, and map. The church admin can log in at `/admin`, manage all content through four modules, and see changes reflected on the landing page immediately after saving.
