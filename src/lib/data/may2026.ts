import type { ShelfMonth, Tape } from "@/lib/types";

const ISO = "2026-05-01T00:00:00.000Z";

/** Five sample tapes spread across rows A–J (PM-P1 seed). */
const sampleTapes: Tape[] = [
  {
    id: "PLG-001",
    position: { row: 0, col: 6 },
    title: "คืนที่ฝนตกหนัก",
    artist: "NIRA",
    genre: "DREAM POP",
    duration: "04:12",
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    coverBg: 1,
    side: "A",
    tags: ["curated"],
    listens: 2847,
    likes: 142,
    curatorNote: "NIRA หยิบความเศร้าออกมาตั้งโต๊ะ ฟังแล้วอยากฝน",
    submittedAt: ISO,
    publishedAt: ISO,
  },
  {
    id: "PLG-002",
    position: { row: 3, col: 14 },
    title: "ของหวานเย็นในตู้",
    artist: "MILK.STAND",
    genre: "BEDROOM POP",
    duration: "02:45",
    youtubeUrl: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    coverBg: 5,
    side: "A",
    tags: ["curated", "hot"],
    listens: 1876,
    likes: 134,
    curatorNote: "ครื้นเครงเบาๆ ฟังตอนบ่ายสามได้เลย",
    submittedAt: ISO,
    publishedAt: ISO,
  },
  {
    id: "PLG-003",
    position: { row: 6, col: 2 },
    title: "อยากเป็นฝนในวันนั้น",
    artist: "RAINWISH",
    genre: "DREAM POP",
    duration: "04:11",
    youtubeUrl: "https://www.youtube.com/watch?v=OPf0YbXqDm0",
    coverBg: 11,
    side: "B",
    tags: ["curated"],
    listens: 1654,
    likes: 103,
    submittedAt: ISO,
    publishedAt: ISO,
  },
  {
    id: "PLG-004",
    position: { row: 9, col: 27 },
    title: "รักก่อนนอน 3 นาที",
    artist: "GOODNIGHT",
    genre: "LOFI",
    duration: "03:12",
    youtubeUrl: "https://www.youtube.com/watch?v=RgKAFK5djSk",
    coverBg: 4,
    side: "A",
    tags: ["new"],
    listens: 1432,
    likes: 87,
    submittedAt: ISO,
    publishedAt: ISO,
  },
  {
    id: "PLG-005",
    position: { row: 1, col: 21 },
    title: "ใต้ทะเลสีเขียว",
    artist: "TIDAL.WAVE",
    genre: "AMBIENT",
    duration: "05:33",
    youtubeUrl: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    coverBg: 8,
    side: "B",
    tags: ["rare"],
    listens: 542,
    likes: 28,
    submittedAt: ISO,
    publishedAt: ISO,
  },
];

/** Retired cells — diagonal pattern on shelf */
const retiredPositions = [
  { row: 2, col: 9 },
  { row: 4, col: 19 },
  { row: 7, col: 10 },
];

/**
 * MAY 2026 shelf: 5 tapes + 3 retired; remaining cells render as empty (292 slots).
 */
export const may2026: ShelfMonth = {
  month: "MAY",
  year: 2026,
  capacity: 300,
  tapes: sampleTapes,
  retiredPositions,
};
