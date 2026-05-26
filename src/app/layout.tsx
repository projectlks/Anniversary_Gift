import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 🌟 PWA နှင့် Favicon အတွက် Metadata အပြည့်အစုံ 🌟
export const metadata: Metadata = {
  title: "Our Space",
  description: "A private space for our beautiful memories",

  // PWA Manifest ဖိုင်ကို ချိတ်ဆက်ခြင်း
  manifest: "/manifest.json",

  // Favicon နှင့် App Icon များ ချိတ်ဆက်ခြင်း
  icons: {
    icon: "/logo.svg", // Browser Tab ပေါ်တွင် ပြသမည့် ပုံ
    apple: "/icon-192x192.png", // iPhone တွင် Add to Home Screen လုပ်လျှင် ပေါ်မည့်ပုံ
  },

  // Theme Color သတ်မှတ်ခြင်း
  themeColor: "#ffffff",

  // iPhone တွင် Native App လိုမျိုး Full Screen ပေါ်စေရန်
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Our Space",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} scrollbar-hide antialiased`}>
        <SpeedInsights />
        <Analytics /> {/* Vercel Analytics ကို ထည့်သွင်းထားပါတယ် */}
        {/* Background Image ကို အောက်ဆုံး Layer အဖြစ် (fixed, -z-50) ထားပါမည် */}
        <div className="fixed inset-0 -z-50">
          <Image
            src="/bg.jpg"
            alt="Romantic Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        {/* Content များကို အပေါ်ဆုံး Layer (z-0) တွင် ထားပါမည် */}
        <div className="relative z-0 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
