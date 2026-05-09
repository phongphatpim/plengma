"use client";

import { useEffect, useState } from "react";

function daysUntilMay31_2026(now: Date): number {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(2026, 4, 31);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(ms / 86400000));
}

/** Client-only countdown avoids SSR/client `Date` mismatch on `/shelf`. */
export default function ShelfDaysLeft() {
  const [label, setLabel] = useState("…");

  useEffect(() => {
    setLabel(`${daysUntilMay31_2026(new Date())} วัน`);
  }, []);

  return <>{label}</>;
}
