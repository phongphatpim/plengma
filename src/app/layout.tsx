import type { Metadata, Viewport } from "next";
import {
  Bai_Jamjuree,
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Noto_Sans_Thai,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-bricolage",
  display: "swap",
});

const baiJamjuree = Bai_Jamjuree({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bai",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-thai",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-mono",
  display: "swap",
});

const fontVars = [
  bricolage.variable,
  baiJamjuree.variable,
  notoSansThai.variable,
  ibmPlexMono.variable,
].join(" ");

/** สอดคล้องกับ prototype ใน Doc/Design/*.html */
export const viewport: Viewport = {
  themeColor: "#0E0820",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "เพลงมา — แผงเทปยุคใหม่ของเพลงไทยสร้างสรรค์",
  description:
    "ฟัง ค้น และส่งเพลงไทยสร้างสรรค์จาก AI ที่คัดสรรแล้ว แผง 300 ช่อง อัปเดตทุกเดือน",
  keywords: ["เพลงไทย AI", "เพลง AI", "Thai AI Music", "PlengMa", "เพลงมา"],
  openGraph: {
    title: "เพลงมา — แผงเทปยุคใหม่",
    description: "ฟัง ค้น และส่งเพลงไทยสร้างสรรค์จาก AI ที่คัดสรรแล้ว",
    url: "https://plengma.com",
    siteName: "เพลงมา",
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "เพลงมา — แผงเทปยุคใหม่",
    description: "ฟัง ค้น และส่งเพลงไทยสร้างสรรค์จาก AI ที่คัดสรรแล้ว",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={fontVars}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
