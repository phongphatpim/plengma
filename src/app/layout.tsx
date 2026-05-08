import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "เพลงมา — แผงเทปเพลงไทย AI",
  description:
    "แผงเทปเพลงไทยที่สร้างด้วย AI คัดสรรเดือนต่อเดือน ส่งเพลงของคุณขึ้นแผง",
  keywords: ["เพลงไทย", "AI music", "เพลง AI", "plengma", "เพลงมา"],
  openGraph: {
    title: "เพลงมา — แผงเทปเพลงไทย AI",
    description: "แผงเทปเพลงไทยคัดสรร สร้างด้วย AI",
    url: "https://www.plengma.com",
    siteName: "เพลงมา",
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        {/* Google Fonts — loaded via <link> for reliability */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&family=IBM+Plex+Mono:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500;600;700;800&family=Bai+Jamjuree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
