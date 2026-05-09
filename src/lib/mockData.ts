import type { ShelfMonth } from "@/lib/types";
import { may2026 } from "@/lib/data/may2026";

/** @deprecated Use `may2026` from `@/lib/data/may2026` */
export const MAY_2026_SHELF: ShelfMonth = may2026;

export { may2026 };

export function shelfStats(shelf: ShelfMonth) {
  const occupied = shelf.tapes.length;
  const retired = shelf.retiredPositions.length;
  const empty = shelf.capacity - occupied - retired;
  const totalListens = shelf.tapes.reduce((sum, t) => sum + t.listens, 0);
  return { occupied, retired, empty, totalListens };
}
