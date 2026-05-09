"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import LivePreview from "@/components/submit/LivePreview";
import SubmitForm, { type SubmitPreviewState } from "@/components/submit/SubmitForm";
import type { TapeGenre } from "@/lib/types";

const initialPreview: SubmitPreviewState = {
  form: {
    youtubeUrl: "",
    title: "",
    artist: "",
    genre: "DREAM POP" as TapeGenre,
    duration: "",
    description: "",
    email: "",
    socialUrl: "",
    tools: "",
    coverPrompt: "",
    mood: "",
  },
  coverMode: "upload",
  coverPreviewUrl: null,
};

export default function SubmitPage() {
  const [preview, setPreview] = useState<SubmitPreviewState>(initialPreview);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100dvh", padding: "28px 24px 48px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Link href="/shelf" style={{ color: "rgba(244,239,230,0.8)", textDecoration: "none" }}>
            ← กลับแผง
          </Link>
          <h1 style={{ fontFamily: "var(--font-thai)", fontSize: "clamp(28px,4vw,46px)", margin: "8px 0 8px" }}>
            ส่งเพลงขึ้นแผง
          </h1>
          <p style={{ color: "rgba(244,239,230,0.75)", marginBottom: 20 }}>
            ทุกเพลงผ่านการรีวิวก่อนขึ้นแผง — คุณภาพมาก่อนเสมอ
          </p>

          <section className="submit-grid">
            <div>
              <SubmitForm onPreviewChange={setPreview} />
            </div>
            <div>
              <LivePreview data={preview} />
            </div>
          </section>
        </div>
      </main>
      <style jsx>{`
        .submit-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .submit-grid {
            grid-template-columns: 1fr;
          }
          .submit-grid > :first-child {
            order: 2;
          }
          .submit-grid > :last-child {
            order: 1;
          }
        }
      `}</style>
    </>
  );
}
