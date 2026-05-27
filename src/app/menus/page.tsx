// "use client";

// import type React from "react";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { signOut } from "next-auth/react";
// import Image from "next/image";
// import {
//   ArrowRightOnRectangleIcon,
//   CalendarDaysIcon,
//   ClockIcon,
//   CloudArrowUpIcon,
//   EnvelopeOpenIcon, // 🌟 3D စာအိတ်အတွက်
//   PencilSquareIcon, // 🌟 Sticky Note Board အတွက်

//   MusicalNoteIcon,
//   PhotoIcon,
//   PuzzlePieceIcon,
//   Squares2X2Icon,
//   SparklesIcon,
//   GiftIcon,
// } from "@heroicons/react/24/outline";

// type MenuCard = {
//   title: string;
//   description: string;
//   href: string;
//   icon: React.ReactNode;
//   delay: string;
// };

// // 🌟 Note (၂) မျိုးလုံး ပါဝင်အောင် အသစ်ပြန်စီထားသော စာရင်း
// const menuCards: MenuCard[] = [
//   {
//     title: "Anniversary Special",
//     description: "A secret surprise carefully prepared for our special day.",
//     href: "/special",
//     icon: <GiftIcon className="h-12 w-12 text-pink-600" strokeWidth={1.5} />,
//     delay: "0.1s",
//   },
//   {
//     title: "Secret Love Letter",
//     description: "A sealed envelope holding my deepest feelings for you.",
//     href: "/letter", // 🌟 3D စာအိတ် (Love Note) ရဲ့ လမ်းကြောင်းကို ဒီမှာထည့်ပါ
//     icon: (
//       <EnvelopeOpenIcon className="h-12 w-12 text-rose-500" strokeWidth={1.5} />
//     ),
//     delay: "0.2s",
//   },
//   {
//     title: "Sticky Love Board",
//     description:
//       "Our real-time interactive board to leave sticky notes and sweet emojis.",
//     href: "/board", // 🌟 မနေ့ကရေးခဲ့တဲ့ FigJam Board ရဲ့ လမ်းကြောင်းကို ဒီမှာထည့်ပါ
//     icon: (
//       <PencilSquareIcon className="h-12 w-12 text-blue-500" strokeWidth={1.5} />
//     ),
//     delay: "0.3s",
//   },
//   {
//     title: "Anniversary Gallery",
//     description:
//       "Open the private photo space filled with your shared memories.",
//     href: "/memories",
//     icon: <PhotoIcon className="h-12 w-12 text-purple-500" strokeWidth={1.5} />,
//     delay: "0.4s",
//   },
//   {
//     title: "Journey Timeline",
//     description:
//       "Follow the milestones, dates, and sweet moments in your story.",
//     href: "/journey",
//     icon: (
//       <CalendarDaysIcon className="h-12 w-12 text-teal-500" strokeWidth={1.5} />
//     ),
//     delay: "0.5s",
//   },
//   {
//     title: "Love Puzzle",
//     description: "Play through a puzzle made from one of your favorite photos.",
//     href: "/puzzle",
//     icon: (
//       <PuzzlePieceIcon
//         className="h-12 w-12 text-orange-500"
//         strokeWidth={1.5}
//       />
//     ),
//     delay: "0.6s",
//   },
//   {
//     title: "Dome Gallery",
//     description:
//       "Step into a 360-degree dome filled with your private couple memories.",
//     href: "/dome-gallary",
//     icon: (
//       <Squares2X2Icon className="h-12 w-12 text-indigo-500" strokeWidth={1.5} />
//     ),
//     delay: "0.7s",
//   },
//   {
//     title: "Music Room",
//     description:
//       "Play a favorite song with lyrics, cover art, and a spinning record.",
//     href: "/music",
//     icon: (
//       <MusicalNoteIcon className="h-12 w-12 text-red-500" strokeWidth={1.5} />
//     ),
//     delay: "0.8s",
//   },
//   {
//     title: "Magic Trail",
//     description:
//       "Watch your favorite photos follow your cursor in a magical trail.",
//     href: "/mouse-image",
//     icon: (
//       <SparklesIcon className="h-12 w-12 text-amber-500" strokeWidth={1.5} />
//     ),
//     delay: "0.9s",
//   },
//   {
//     title: "Upload Memories",
//     description: "Add new photos to your shared space securely.",
//     href: "/upload-memory",
//     icon: (
//       <CloudArrowUpIcon className="h-12 w-12 text-cyan-600" strokeWidth={1.5} />
//     ),
//     delay: "1.0s", // 🌟 Delay များကို 1.0s အထိ သေချာ ပြန်စီထားပါသည်
//   },
// ];

// export default function Menus() {
//   const router = useRouter();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const [currentDate, setCurrentDate] = useState("");
//   const [loadingRoute, setLoadingRoute] = useState<string | null>(null);

//   useEffect(() => {
//     const date = new Date().toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//     setCurrentDate(date);
//   }, []);

//   const handleLogout = async () => {
//     setIsLoggingOut(true);
//     try {
//       await fetch("/api/lock", { method: "POST" });
//       await signOut({ callbackUrl: "/auth/signin" });
//     } finally {
//       setIsLoggingOut(false);
//     }
//   };

//   const handleNavigation = (href: string) => {
//     setLoadingRoute(href);
//     router.push(href);
//   };

//   return (
//     <>
//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//             @keyframes frontendMenuFadeInUp {
//               from { opacity: 0; transform: translateY(20px); }
//               to { opacity: 1; transform: translateY(0); }
//             }
//             .frontend-menu-fade-in-up {
//               animation: frontendMenuFadeInUp 0.6s ease-out forwards;
//               opacity: 0;
//             }
//           `,
//         }}
//       />

//       {loadingRoute && (
//         <div
//           className="fixed inset-0 z-[100] cursor-wait bg-transparent"
//           aria-hidden="true"
//         />
//       )}

//       <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-500">
//         <header className="sticky top-0 z-40 flex w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
//           <div className="container mx-auto flex w-full grow items-center justify-between px-6 py-4 md:px-10">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-pink-600">
//                 {/* <HeartIcon className="h-5 w-5" strokeWidth={2.5} /> */}

//                 <Image src="/192.png" alt="Heart Icon" width={20} height={20} />
//               </div>
//               <h1 className="text-xl font-bold tracking-tight text-gray-900">
//                 Our Space
//               </h1>
//             </div>

//             <div className="flex items-center gap-4 md:gap-6">
//               <div className="hidden items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 sm:flex">
//                 <ClockIcon className="h-4 w-4 text-pink-500" />
//                 <span className="text-xs font-semibold uppercase tracking-wide text-gray-600">
//                   {currentDate || "Loading..."}
//                 </span>
//               </div>

//               <button
//                 type="button"
//                 onClick={handleLogout}
//                 disabled={isLoggingOut || !!loadingRoute}
//                 className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
//                 {isLoggingOut ? (
//                   <svg
//                     className="h-4 w-4 animate-spin"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true">
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                 ) : (
//                   <ArrowRightOnRectangleIcon
//                     className="h-4 w-4"
//                     strokeWidth={2.5}
//                   />
//                 )}
//                 <span className="hidden sm:inline">
//                   {isLoggingOut ? "Logging out" : "Log out"}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </header>

//         <main className="container mx-auto space-y-10 p-4 pt-10 md:p-10">
//           <div className="frontend-menu-fade-in-up max-w-2xl">
//             <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
//               Private
//             </p>
//             <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[40px]">
//               Menu of Our Love
//             </h2>
//             <p className="text-base leading-relaxed text-gray-500 md:text-lg">
//               Explore our special memories, leave a sticky note, or open the
//               secret love letter.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
//             {menuCards.map((card) => (
//               <MenuDashboardCard
//                 key={card.href}
//                 title={card.title}
//                 description={card.description}
//                 icon={card.icon}
//                 delay={card.delay}
//                 href={card.href}
//                 isLoading={loadingRoute === card.href}
//                 isGlobalLoading={!!loadingRoute}
//                 onClick={() => handleNavigation(card.href)}
//               />
//             ))}
//           </div>
//         </main>
//       </div>
//     </>
//   );
// }

// function MenuDashboardCard({
//   title,
//   description,
//   icon,
//   onClick,
//   isLoading,
//   isGlobalLoading,
//   delay = "0s",
//   href,
// }: {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   onClick: () => void;
//   isLoading?: boolean;
//   isGlobalLoading?: boolean;
//   delay?: string;
//   href: string;
// }) {
//   const router = useRouter();

//   useEffect(() => {
//     router.prefetch(href);
//   }, [router, href]);

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={isGlobalLoading}
//       className={`frontend-menu-fade-in-up group h-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 ${
//         isLoading
//           ? "cursor-wait"
//           : isGlobalLoading
//             ? "cursor-not-allowed opacity-80"
//             : "cursor-pointer"
//       }`}
//       style={{ animationDelay: delay, animationFillMode: "both" }}>
//       <div
//         className={`h-full rounded-3xl border border-gray-200 bg-gray-50 p-1 duration-200 ${!isGlobalLoading && "group-hover:border-pink-300 group-hover:bg-pink-50"} md:p-2`}>
//         <div className="relative flex h-full min-h-[260px] flex-col rounded-2xl border border-[#F2F4F7] bg-white p-4 md:p-6 overflow-hidden">
//           {isLoading && (
//             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] rounded-2xl transition-all">
//               <svg
//                 className="h-8 w-8 animate-spin text-pink-500 mb-3"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24">
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               <span className="text-sm font-bold text-pink-600 animate-pulse tracking-wide">
//                 Opening...
//               </span>
//             </div>
//           )}

//           <div className="mb-7">{icon}</div>
//           <h3 className="mb-4 text-xl font-semibold text-gray-900 md:text-2xl xl:text-xl">
//             {title}
//           </h3>
//           <p className="text-base leading-normal text-gray-500">
//             {description}
//           </p>
//         </div>
//       </div>
//     </button>
//   );
// }

// src/app/menus/page.tsx (or wherever your page is located)

import Image from "next/image";
import { HeaderControls, Grid } from "./MenuClient";

export default function MenusPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-500">
      <header className="sticky top-0 z-40 flex w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex w-full grow items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-100 bg-pink-50 text-pink-600">
              <Image src="/192.png" alt="Heart Icon" width={20} height={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Our Space
            </h1>
          </div>

          {/* Client-side interactions (date & logout) */}
          <HeaderControls />
        </div>
      </header>

      <main className="container mx-auto space-y-10 p-4 pt-10 md:p-10">
        <div className="frontend-menu-fade-in-up max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
            Private
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-[40px]">
            Menu of Our Love
          </h2>
          <p className="text-base leading-relaxed text-gray-500 md:text-lg">
            Explore our special memories, leave a sticky note, or open the
            secret love letter.
          </p>
        </div>

        {/* Client-side interactions (menu grid) */}
        <Grid />
      </main>
    </div>
  );
}