import { may2026 } from "@/lib/data/may2026";
import { getApprovedTapesCached, getRetiredPositions } from "@/lib/sheets-reader";
import type { ShelfMonth } from "@/lib/types";

/** Live MAY 2026 shelf from Sheets when configured; on failure uses static `may2026`. */
export async function getMay2026Shelf(): Promise<ShelfMonth> {
  if (!process.env.GOOGLE_SHEETS_ID) {
    return may2026;
  }
  try {
    const tapes = await getApprovedTapesCached("MAY", 2026);
    const retiredPositions = await getRetiredPositions("MAY", 2026);
    /** ยังไม่มีแถว published ใน Sheet → โชว์ seed จาก may2026.ts */
    const mergedTapes = tapes.length > 0 ? tapes : may2026.tapes;
    return {
      month: "MAY",
      year: 2026,
      capacity: 300,
      tapes: mergedTapes,
      retiredPositions,
    };
  } catch (e) {
    console.warn("[plengma][shelf-data] Sheets error — static fallback", e);
    return may2026;
  }
}
