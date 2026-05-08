import { MonthlyShelf, Tape } from "@/types";

// Row A=0, B=1 ... J=9 | Col 0-based
// slot = row * 30 + col
function pos(row: number, col: number) {
  return row * 30 + col;
}

const ROWS = 10;
const COLS = 30;
const ROW_LETTERS = "ABCDEFGHIJ";

function id(slot: number) {
  const r = Math.floor(slot / COLS);
  const c = slot % COLS;
  return `${ROW_LETTERS[r]}-${String(c + 1).padStart(2, "0")}`;
}

// ── Occupied tapes (matches plengma-shelf-v2.html) ────────────
const occupiedData = [
  { row: 0, col: 6,  title: "คืนที่ฝนตกหนัก",         artist: "NIRA",             genre: "DREAM POP",   duration: "04:12", listens: 2847, likes: 142, tags: ["curated","gold"], side: "A", curatorNote: "NIRA หยิบความเศร้าออกมาตั้งโต๊ย ฟังแล้วอยากฝน" },
  { row: 0, col: 14, title: "ลานจอดรถ ยุค 2089",      artist: "SYNTHKID",         genre: "CITYPOP",     duration: "04:15", listens: 1923, likes: 89,  tags: ["hot"],     side: "B" },
  { row: 0, col: 22, title: "ฤดูร้อน 96",              artist: "SUMMER.EXE",       genre: "CITYPOP",     duration: "03:12", listens: 1654, likes: 67,  tags: ["rare"],    side: "A" },
  { row: 1, col: 2,  title: "หัวใจเปียกฝน",            artist: "ROSITA",           genre: "R&B",         duration: "03:33", listens: 982,  likes: 54,  tags: ["new"],     side: "B" },
  { row: 1, col: 9,  title: "รถไฟใต้ดิน 2:14",        artist: "จอมขมังเวทย์",     genre: "LOFI",        duration: "03:21", listens: 743,  likes: 31,  tags: ["new"],     side: "A" },
  { row: 1, col: 17, title: "ดอกไม้ไฟในห้องน้ำ",      artist: "เด็กแว้น × MAYU",  genre: "PUNK",        duration: "02:47", listens: 3201, likes: 198, tags: ["hot"],     side: "A" },
  { row: 1, col: 25, title: "ใต้ทะเลสีเขียว",          artist: "TIDAL.WAVE",       genre: "AMBIENT",     duration: "05:33", listens: 542,  likes: 28,  tags: ["rare"],    side: "B" },
  { row: 2, col: 4,  title: "ตลาดเช้าวันอาทิตย์",     artist: "กล้วยไข่",          genre: "FOLK",        duration: "02:58", listens: 1234, likes: 76,  tags: ["new"],     side: "A" },
  { row: 2, col: 11, title: "หมาในซอยไม่กลับบ้าน",    artist: "วงข้าวเหนียว",      genre: "INDIE FOLK",  duration: "04:01", listens: 2104, likes: 121, tags: ["curated"], side: "B", curatorNote: "เพลงบ้านๆ ที่ทำให้รู้สึกใกล้บ้าน" },
  { row: 2, col: 19, title: "ห้องนอนของคนแปลกหน้า",  artist: "GHOSTRADIO",       genre: "DARKWAVE",    duration: "05:18", listens: 876,  likes: 43,  tags: ["new"],     side: "B" },
  { row: 2, col: 27, title: "เพลงรักจากเด็ก ม.4",     artist: "ซีโร่ฟาย",          genre: "INDIE POP",   duration: "03:48", listens: 1567, likes: 92,  tags: ["hot"],     side: "A" },
  { row: 3, col: 1,  title: "วันแรงงานสากล",           artist: "NORTHKIN",         genre: "POST-ROCK",   duration: "06:21", listens: 432,  likes: 19,  tags: [],          side: "A" },
  { row: 3, col: 7,  title: "หนีเที่ยวคนเดียว",        artist: "BACKPACKER",       genre: "INDIE",       duration: "03:15", listens: 1109, likes: 58,  tags: ["new"],     side: "B" },
  { row: 3, col: 15, title: "ของหวานเย็นในตู้",        artist: "MILK.STAND",       genre: "BEDROOM POP", duration: "02:45", listens: 1876, likes: 134, tags: ["curated"], side: "A", curatorNote: "ครื้นเครงเบาๆ ฟังตอนบ่ายสามได้เลย" },
  { row: 3, col: 23, title: "รถเมล์สาย 8",             artist: "KRUNG.THEP",       genre: "HIP-HOP",     duration: "03:33", listens: 2543, likes: 156, tags: ["hot"],     side: "A" },
  { row: 4, col: 3,  title: "เหงาก่อนนอน",             artist: "INSOMNIA.WAV",     genre: "AMBIENT",     duration: "04:22", listens: 654,  likes: 41,  tags: [],          side: "B" },
  { row: 4, col: 10, title: "แสงไฟยังเปิดอยู่",        artist: "NIGHT.LAMP",       genre: "JAZZ",        duration: "04:08", listens: 1098, likes: 72,  tags: ["curated"], side: "A" },
  { row: 4, col: 18, title: "แฟนเก่าเจอกันที่เซเว่น", artist: "7ELEV.GIRL",       genre: "CITY POP",    duration: "03:05", listens: 4231, likes: 289, tags: ["hot","curated"], side: "B", curatorNote: "เพลงที่ทุกคนรู้สึก" },
  { row: 4, col: 26, title: "ฝนตกพิมพ์งานส่งพรุ่งนี้", artist: "DEADLINE.EXE",    genre: "LOFI",        duration: "02:55", listens: 2876, likes: 167, tags: ["hot"],     side: "A" },
  { row: 5, col: 5,  title: "ท้องฟ้าสีตะวัน",          artist: "DAWNBREAK",        genre: "FOLK",        duration: "03:44", listens: 743,  likes: 38,  tags: [],          side: "B" },
  { row: 5, col: 13, title: "สวรรค์ชั้นสาม",           artist: "HEAVENLAY",        genre: "R&B",         duration: "03:52", listens: 1432, likes: 88,  tags: ["curated"], side: "A" },
  { row: 5, col: 20, title: "วันที่แมวนำทาง",          artist: "CAT.GUIDE",        genre: "AMBIENT",     duration: "04:30", listens: 987,  likes: 67,  tags: ["new"],     side: "B" },
  { row: 5, col: 28, title: "กาแฟดำเปล่า",             artist: "BITTER.CUP",       genre: "INDIE FOLK",  duration: "03:18", listens: 1123, likes: 76,  tags: ["new"],     side: "A" },
  { row: 6, col: 2,  title: "อยากเป็นฝนในวันนั้น",    artist: "RAINWISH",         genre: "DREAM POP",   duration: "04:11", listens: 1654, likes: 103, tags: ["curated"], side: "B" },
  { row: 6, col: 8,  title: "มนุษย์ต่างดาวเป็นเพื่อน", artist: "ALIEN.FRIEND",    genre: "SYNTH POP",   duration: "03:28", listens: 2109, likes: 145, tags: ["hot"],     side: "A" },
  { row: 6, col: 16, title: "ทะเลไม่มีคลื่น",          artist: "STILL.SEA",        genre: "AMBIENT",     duration: "05:40", listens: 543,  likes: 29,  tags: [],          side: "B" },
  { row: 6, col: 24, title: "หมูกระทะตอนดึก",         artist: "BBQ.NIGHTS",       genre: "FUNK",        duration: "03:07", listens: 3456, likes: 212, tags: ["hot"],     side: "A" },
  { row: 7, col: 3,  title: "ก่อนโรงเรียนเปิด",        artist: "LAST.SUMMER",      genre: "INDIE POP",   duration: "02:59", listens: 1876, likes: 123, tags: ["new"],     side: "B" },
  { row: 7, col: 10, title: "ลืมวันเกิดตัวเอง",        artist: "FORGOT.B",         genre: "ALT",         duration: "03:34", listens: 1234, likes: 89,  tags: ["new"],     side: "A" },
  { row: 7, col: 20, title: "ช้างน้อยในป่าคอนกรีต",  artist: "CITY.ELEPHANT",    genre: "FOLK",        duration: "04:05", listens: 1567, likes: 98,  tags: ["curated"], side: "B", curatorNote: "เพลงสะท้อนสังคมที่ฟังสบาย" },
  { row: 7, col: 27, title: "เพลงรอรักจากดวงดาว",     artist: "STARLOVE",         genre: "DREAM POP",   duration: "03:59", listens: 878,  likes: 54,  tags: [],          side: "A" },
  { row: 8, col: 6,  title: "ข้าวเหนียวมะม่วงในฝัน",  artist: "MANGO.WAV",        genre: "LOFI",        duration: "02:48", listens: 2345, likes: 167, tags: ["hot"],     side: "B" },
  { row: 8, col: 14, title: "แสงเทียนในบาร์เก่า",     artist: "CANDLE.BAR",       genre: "JAZZ",        duration: "04:33", listens: 765,  likes: 43,  tags: [],          side: "A" },
  { row: 8, col: 18, title: "นางเงือกลับบ้าน",         artist: "MERMAID.WAY",      genre: "INDIE",       duration: "03:27", listens: 1234, likes: 78,  tags: ["curated"], side: "B" },
  { row: 8, col: 25, title: "ความฝันของแมวจร",         artist: "STRAY.CAT",        genre: "BEDROOM",     duration: "02:54", listens: 1876, likes: 122, tags: ["hot"],     side: "A" },
  { row: 9, col: 1,  title: "เด็กหญิงแมวขาว",          artist: "KITTEN.GIRL",      genre: "CITYPOP",     duration: "03:18", listens: 2104, likes: 156, tags: ["hot"],     side: "B" },
  { row: 9, col: 9,  title: "หมากฝรั่งสตรอว์",         artist: "BUBBLE.GUM",       genre: "INDIE POP",   duration: "02:33", listens: 1654, likes: 98,  tags: ["curated"], side: "A" },
  { row: 9, col: 14, title: "จีบไม่ติดตลอดชีวิต",     artist: "FRIENDZONE.69",    genre: "POP PUNK",    duration: "03:01", listens: 3201, likes: 234, tags: ["hot"],     side: "B" },
  { row: 9, col: 22, title: "รักก่อนนอน 3 นาที",      artist: "GOODNIGHT",        genre: "LOFI",        duration: "03:12", listens: 1432, likes: 87,  tags: ["new"],     side: "A" },
];

// Retired slots
const retiredSlots: [number, number][] = [
  [0, 2], [0, 18], [1, 5], [2, 14], [3, 19], [4, 13],
  [5, 25], [6, 11], [7, 16], [8, 7], [9, 4], [9, 28],
];

// ── Build tapes array ─────────────────────────────────────────
function buildTapes(): Tape[] {
  const tapes: Tape[] = [];

  // Occupied
  for (const d of occupiedData) {
    const slot = pos(d.row, d.col);
    tapes.push({
      id: id(slot),
      slot,
      status: "occupied",
      track: {
        title: d.title,
        artistName: d.artist,
        coverUrl: "",
        genre: d.genre,
        curatorNote: d.curatorNote,
        submittedAt: "2026-05-01",
        playCount: d.listens,
        tags: d.tags,
        duration: d.duration,
        likes: d.likes,
        side: d.side,
      },
    });
  }

  // Retired
  for (const [r, c] of retiredSlots) {
    const slot = pos(r, c);
    tapes.push({ id: id(slot), slot, status: "retired" });
  }

  return tapes;
}

// ── May 2026 shelf ────────────────────────────────────────────
export const MAY_2026_SHELF: MonthlyShelf = {
  month: "2026-05",
  label: "พฤษภาคม 2569",
  totalSlots: ROWS * COLS, // 300
  tapes: buildTapes(),
};

// Stats helper
export function shelfStats(shelf: MonthlyShelf) {
  const occupied = shelf.tapes.filter((t) => t.status === "occupied").length;
  const retired  = shelf.tapes.filter((t) => t.status === "retired").length;
  const empty    = shelf.totalSlots - occupied - retired;
  const totalListens = shelf.tapes.reduce(
    (sum, t) => sum + (t.track?.playCount ?? 0),
    0
  );
  return { occupied, retired, empty, totalListens };
}
