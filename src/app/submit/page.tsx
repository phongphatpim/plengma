import Navbar from "@/components/layout/Navbar";
import SubmitForm from "@/components/tape/SubmitForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ส่งเพลงขึ้นแผง — เพลงมา",
  description: "ส่งเพลง AI ของคุณขึ้นแผงเดือน MAY 2026 ฟรี ไม่มีค่าใช้จ่าย",
};

export default function SubmitPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "100dvh" }}>
        <SubmitForm />
      </main>
    </>
  );
}
