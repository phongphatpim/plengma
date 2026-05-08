# เพลงมา (PlengMa)

> แผงเทปเพลงไทย AI คัดสรร — www.plengma.com

Neo-Retro Cassette hub สำหรับเพลงไทยที่สร้างด้วย AI จัดเป็นแผงประจำเดือน 300 ช่อง

**Repository:** [github.com/phongphatpim/plengma](https://github.com/phongphatpim/plengma)

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + CSS Variables
- **Language**: TypeScript
- **Deploy**: Vercel (region: sin1 — Singapore)

## Brand

- **Concept**: Neo-Retro Cassette — เทปยุค 90 ในจินตนาการของคนยุค AI
- **Palette**: Ink Night `#0E0820` · Cassette Gold `#E9B949` · Mixtape Pink `#E85D8C` · Reel Blue `#7C8BFF`
- **Fonts**: Bricolage Grotesque · Bai Jamjuree · IBM Plex Mono · Noto Sans Thai (โหลดด้วย `next/font/google` ใน `layout.tsx`)

## Routes

| Route | Description |
|-------|-------------|
| `/` | Coming Soon placeholder |
| `/shelf` | แผงเทป Isometric ประจำเดือน |
| `/submit` | ฟอร์มส่งเพลงขึ้นแผง (4 steps) |
| `/about` | เกี่ยวกับเพลงมา |
| `/api/submissions` | API รับข้อมูลฟอร์ม submit (Phase 0: log-based) |

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

แนะนำ Node **20.19+** (หรือ 22.13+) เพื่อให้สอดคล้องกับ dependency ของ ESLint — ถ้าใช้เวอร์ชันต่ำกว่าอาจเห็นแค่ `EBADENGINE` warning

ก่อน deploy หรือเปิด PR:

```bash
npm run lint
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout + fonts
│   ├── globals.css       # Brand tokens + Tailwind
│   ├── page.tsx          # Homepage
│   ├── shelf/page.tsx    # Monthly shelf
│   ├── submit/page.tsx   # Submit form
│   ├── about/page.tsx    # About
│   └── api/submissions/route.ts  # POST รับฟอร์ม (Phase 0: log)
├── components/
│   ├── layout/
│   │   └── Navbar.tsx
│   └── tape/
│       ├── IsoShelf.tsx  # Isometric grid
│       ├── TapeSlot.tsx  # Single slot (3 states)
│       ├── TapeModal.tsx # Detail popup
│       └── SubmitForm.tsx
├── lib/
│   ├── mockData.ts       # MAY 2026 shelf data
│   ├── submission.ts     # validate + normalize payload ฟอร์ม
│   └── utils.ts          # cn(), BRAND constants
└── types/
    └── index.ts          # Tape, Track, MonthlyShelf types
```

## Deploy (Vercel)

```bash
# 1. Push to GitHub (ถ้ายังไม่มี remote)
git init && git add . && git commit -m "feat: PM-P0 initial setup"
git remote add origin https://github.com/phongphatpim/plengma.git
git push -u origin main

# 2. Import on Vercel
# vercel.com/new → import repo → deploy

# 3. Add domain
# Vercel dashboard → Settings → Domains → plengma.com
```

## Phase Roadmap

- **Phase 0** 🚧 MVP Soft Launch — Shelf, Modal, Submit API, About, Deploy
- **Phase 1** 🔜 Backend+Ops — DB, Email, Cover Upload, Review Dashboard
- **Phase 2** — Knowledge Hub, Mini Player, Archive Browser

---

*PlengMa Brand System v1.0 · 2026*
