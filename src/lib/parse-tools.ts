/** Split tools string from submit / sheet (comma, pipe, newline, Thai comma) */
export function parseToolLabels(raw?: string): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,\n|｜\u3001]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}
