import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminSessionFromCookies } from "@/lib/auth-server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (pathname.startsWith("/admin/login")) {
    return <>{children}</>;
  }

  const isAuthed = await getAdminSessionFromCookies();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
