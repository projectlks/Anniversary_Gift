// import type { Metadata, Viewport } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Image from "next/image";
// import { Analytics } from "@vercel/analytics/next";
// import { SpeedInsights } from "@vercel/speed-insights/next";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Our Space",
//   description: "A private space for our beautiful memories",
//   manifest: "/manifest.json",
//   // icons: {
//   //   icon: "/192.png",
//   //   apple: "/192.png",
//   // },
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: "Our Space",
//   },
// };

// export const viewport: Viewport = {
//   themeColor: "#ffffff",
// };

// {/* <meta name="google-site-verification" content="jZ6XJ3EYMBBWCKib3H4OF2hinVvATPYgevj7Arob0Hs" /> */}
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} scrollbar-hide antialiased`}>
//         <SpeedInsights />
//         <Analytics />
//         <div className="fixed inset-0 -z-50">
//           <Image
//             src="/bg.jpg"
//             alt="Romantic Background"
//             fill
//             className="object-cover"
//             priority
//           />
//         </div>
//         <div className="relative z-0 min-h-screen">{children}</div>
//       </body>
//     </html>
//   );
// }

import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: "Our Space",
  description: "A private space for our beautiful memories",
  manifest: "/manifest.json",
  // icons: {
  //   icon: "/192.png",
  //   apple: "/192.png",
  // },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Our Space",
  },
  verification: {
    google: "jZ6XJ3EYMBBWCKib3H4OF2hinVvATPYgevj7Arob0Hs",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
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
        <Analytics />
        <div className="fixed inset-0 -z-50">
          <Image
            src="/bg.jpg"
            alt="Romantic Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative z-0 min-h-screen">{children}</div>
      </body>
    </html>
  );
}