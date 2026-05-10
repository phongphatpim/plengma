import { may2026 } from "@/lib/data/may2026";
import type { Tape } from "@/lib/types";
import { getMay2026Shelf } from "@/lib/shelf-data";

/** Resolve tape by catalog id — prefers live shelf, then seed static rows. */
export async function getTapeByCatalogIdAsync(rawId: string): Promise<Tape | null> {
  const id = rawId.trim().toUpperCase();
  if (!id) return null;
  try {
    const shelf = await getMay2026Shelf();
    const hit = shelf.tapes.find((t) => t.id.toUpperCase() === id);
    if (hit) return hit;
  } catch {
    // fall through to static
  }
  return may2026.tapes.find((t) => t.id.toUpperCase() === id) ?? null;
}
