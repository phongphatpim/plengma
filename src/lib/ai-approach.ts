import type { AIApproach } from "@/lib/types";

export function normalizeAIApproach(raw: string): AIApproach | null {
  const s = raw.trim().toLowerCase().replace(/_/g, "-");
  if (s === "full-ai") return "full-ai";
  if (s === "ai-vocal") return "ai-vocal";
  if (s === "ai-instrumental") return "ai-instrumental";
  if (s === "hybrid") return "hybrid";
  return null;
}
