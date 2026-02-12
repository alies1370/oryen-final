import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
import type { Viewport } from 'next'

export const viewport: Viewport = {
  themeColor: '#ffffff', // رنگ نوار بالای گوشی (می‌توانید کد رنگ دیگری بگذارید)
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // جلوگیری از زوم ناخواسته در موبایل
}


export const metadata: Metadata = {
  title: "بهای تمام شده اورین",
  description: "سیستم مدیریت قیمت‌گذاری",
  manifest: "/manifest.json", // این خط اتصال به فایل مرحله ۲ است
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
