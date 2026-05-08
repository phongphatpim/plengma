# PlengMa — Claude Co-founder Notes

## Project Context
PM-P0 (Phase 0) — Pre-launch MVP
Goal: Soft Launch in 2 weeks from project start
Brand: Neo-Retro Cassette (see plengma-brief.md for full details)

## Current Phase: P0 ✅ COMPLETE
- [x] Next.js 16 + Tailwind v4 + TypeScript setup
- [x] Brand tokens (globals.css CSS variables)
- [x] Navbar component
- [x] IsoShelf — isometric 30×10 grid
- [x] TapeSlot — 3 states: occupied / empty / retired
- [x] TapeModal — animated detail overlay, keyboard nav
- [x] /shelf page — MAY 2026 shelf with mock data
- [x] SubmitForm — 4-step multi-step form with live preview
- [x] /submit page
- [x] /about page
- [x] Deploy config (vercel.json, next.config.ts)

## Architecture Decisions
- **No "use client" on pages** — only on interactive components (IsoShelf, SubmitForm, etc.)
- **CSS Variables over Tailwind classes** for brand colors — more reliable than cn() for inline styles
- **Static generation** for all Phase 0 pages — no server-side data fetching yet
- **Mock data** in lib/mockData.ts — replace with DB queries in Phase 1
- **Google Fonts via <link>** (not next/font) — avoids network errors in build environments

## Key Files
- `src/app/globals.css` — all brand tokens (--ink, --gold, --magenta, --periwinkle, --mint, --paper)
- `src/types/index.ts` — Tape, Track, MonthlyShelf, SubmitFormData
- `src/lib/mockData.ts` — MAY 2026 shelf data (40 tapes, 12 retired slots)
- `src/components/tape/TapeModal.tsx` — handles all 3 slot states in modal

## Next Phase: P1 Tasks
1. Database — Vercel Postgres or PlanetScale
   - Tables: tapes, submissions, monthly_shelves
2. Submit pipeline — real form submission → email notification → admin review
3. Email — Resend API for review results notification
4. Cover upload — Vercel Blob storage
5. Admin panel (minimal) — approve/reject submissions

## Brand Rules (Quick Reference)
- Background: #0E0820 (Ink Night)
- Primary CTA: #E9B949 (Cassette Gold)
- Accent 1: #E85D8C (Mixtape Pink)
- Accent 2: #7C8BFF (Reel Blue)
- New/Hot tag: #6FE3C8 (Neon Mint)
- Text: #F4EFE6 (Liner Cream)
- NEVER use Inter, Roboto, Arial
- NEVER say "ปฏิวัติ" "อนาคตของวงการ" "AI revolution"

## Decision Framework
ทุกฟีเจอร์ใหม่ → ถามตามลำดับ:
1. ทำให้ศิลปินอยากส่งเพลงไหม?
2. ทำให้ศิลปินอยากกลับมาส่งอีกไหม?
3. ทำให้คนฟังเจอเพลงง่ายขึ้นไหม?
4. ทำให้แบรนด์ดูพรีเมียมขึ้นไหม?
ตอบ "ไม่" ทุกข้อ → ไม่ทำ
