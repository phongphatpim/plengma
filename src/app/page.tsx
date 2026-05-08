import { redirect } from "next/navigation";

/** Hub-first (brief): หน้าแรก = แผงเดือน — prototype เดิม `/` เป็น Coming Soon เก็บไว้ที่ branch/PR ถ้าต้องการ */
export default function HomePage() {
  redirect("/shelf");
}
