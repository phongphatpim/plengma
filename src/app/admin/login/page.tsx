import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/auth";
import { getAdminSessionFromCookies } from "@/lib/auth-server";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  const isValid = await verifyAdminPassword(password);
  if (!isValid) {
    redirect(`/admin/login?error=invalid&next=${encodeURIComponent(nextPath)}`);
  }

  const token = await createAdminSession();
  if (!token) {
    redirect(`/admin/login?error=config&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const isAuthed = await getAdminSessionFromCookies();
  if (isAuthed) {
    redirect("/admin");
  }

  const errorMessage =
    params.error === "invalid"
      ? "รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง"
      : params.error === "config"
        ? "ระบบผู้ดูแลยังไม่พร้อมใช้งาน กรุณาตรวจสอบ ADMIN_PASSWORD"
        : null;

  const nextPath = params.next && params.next.startsWith("/admin") ? params.next : "/admin";

  return (
    <main className="min-h-dvh bg-[#0E0820] px-6 py-16 text-[#F4EFE6]">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#E9B949]/40 bg-[#0E0820]/90 p-8 shadow-[0_0_30px_rgba(233,185,73,0.15)]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#E9B949]">PlengMa Admin</p>
        <h1 className="mt-3 font-[var(--font-bai)] text-3xl font-bold text-[#E9B949]">เข้าสู่ระบบแอดมิน</h1>
        <p className="mt-2 font-[var(--font-noto-thai)] text-sm text-[#F4EFE6]/80">
          ใส่รหัสผ่านผู้ดูแลเพื่อเข้าแดชบอร์ดจัดการเพลง
        </p>

        <form action={loginAction} className="mt-8 space-y-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="block">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[0.18em] text-[#F4EFE6]/70">
              Admin password
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-[#E9B949]/50 bg-[#120b29] px-3 py-2.5 font-mono text-sm text-[#F4EFE6] outline-none transition focus:border-[#E9B949] focus:ring-2 focus:ring-[#E9B949]/40"
            />
          </label>

          {errorMessage ? (
            <p className="rounded-lg border border-[#E85D8C]/60 bg-[#E85D8C]/10 px-3 py-2 text-sm text-[#ffd7e5]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-[#E9B949] px-4 py-2.5 font-[var(--font-bai)] text-base font-semibold text-[#0E0820] transition hover:bg-[#f0c861]"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </main>
  );
}
