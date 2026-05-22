// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { Dancing_Script, Playfair_Display, Inter } from "next/font/google";
// import {  motion, Variants } from "framer-motion";
// import StackGameUI from "@/components/StackGameUI";
// import { getInitialStackData } from "@/libs/action";
// import AnimatedCounter from "@/components/AnimatedCounter";

// // Fonts
// const playfair = Playfair_Display({
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
// });
// const dancingScript = Dancing_Script({
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });
// const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

// // Types
// interface TimeElapsed {
//   years: number;
//   months: number;
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }
// interface TotalCounts {
//   totalDays: number;
//   totalHours: number;
//   totalMinutes: number;
//   totalSeconds: number;
// }
// interface JourneyEntry {
//   id: string;
//   title: string;
//   description: string | null;
//   eventDate: string;
//   sortOrder: number;
// }
// interface StackData {
//   initialCount: number;
//   coupleId: string;
//   userId: string;
// }

// export default function RomanticJourneyDashboard() {
//   const [mounted, setMounted] = useState(false);
//   const [startDate, setStartDate] = useState<Date>(
//     new Date("2022-10-01T00:00:00+06:30"),
//   );

//   // 🌟 Dynamic Times (စက္ကန့်တိုင်း ပြောင်းလဲမည့် State များ)
//   const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
//     years: 0,
//     months: 0,
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });
//   const [totalCounts, setTotalCounts] = useState<TotalCounts>({
//     totalDays: 0,
//     totalHours: 0,
//     totalMinutes: 0,
//     totalSeconds: 0,
//   });
//   const [currentMyanmarTime, setCurrentMyanmarTime] = useState<string>("");

//   // Data States
//   const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([]);
//   const [stackData, setStackData] = useState<StackData | null>(null);

//   // Time Calculations
//   const getMyanmarTime = useCallback(
//     () =>
//       new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" })),
//     [],
//   );

//   const calculateTimes = useCallback(() => {
//     const nowMyanmar = getMyanmarTime();
//     const diffInMs = nowMyanmar.getTime() - startDate.getTime();

//     const totalSecs = Math.max(0, Math.floor(diffInMs / 1000));
//     const totalMins = Math.floor(totalSecs / 60);
//     const totalHrs = Math.floor(totalMins / 60);
//     const totalDys = Math.floor(totalHrs / 24);

//     const years = Math.floor(totalDys / 365.25);
//     const remainingDaysAfterYears = totalDys - Math.floor(years * 365.25);
//     const months = Math.floor(remainingDaysAfterYears / 30.44);
//     const days = Math.floor(remainingDaysAfterYears - months * 30.44);

//     return {
//       elapsed: {
//         years,
//         months,
//         days,
//         hours: totalHrs % 24,
//         minutes: totalMins % 60,
//         seconds: totalSecs % 60,
//       },
//       totals: {
//         totalDays: totalDys,
//         totalHours: totalHrs,
//         totalMinutes: totalMins,
//         totalSeconds: totalSecs,
//       },
//     };
//   }, [getMyanmarTime, startDate]);

//   // Initial Data Fetching Effect
//   useEffect(() => {
//     setMounted(true);

//     const fetchJourney = async () => {
//       try {
//         const response = await fetch("/api/journey");
//         if (!response.ok) return;
//         const data = await response.json();
//         if (data.startDate) setStartDate(new Date(data.startDate));
//         setJourneyEntries(data.entries ?? []);
//       } catch (e) {}
//     };

//     const fetchStackInfo = async () => {
//       try {
//         const data = await getInitialStackData();
//         if (data) setStackData(data);
//       } catch (e) {}
//     };

//     fetchJourney();
//     fetchStackInfo();
//   }, []);

//   // 🌟 Dynamic Clock & Counters Effect (စက္ကန့်တိုင်း အလုပ်လုပ်မည်)
//   useEffect(() => {
//     if (!mounted) return;

//     const updateAllTimes = () => {
//       const times = calculateTimes();
//       setTimeElapsed(times.elapsed);
//       setTotalCounts(times.totals); // 🌟 Total များကို စက္ကန့်တိုင်း ထည့်ပေးမည်
//       setCurrentMyanmarTime(
//         new Date().toLocaleString("en-US", {
//           timeZone: "Asia/Yangon",
//           month: "short",
//           day: "numeric",
//           hour: "2-digit",
//           minute: "2-digit",
//           hour12: true,
//         }),
//       );
//     };

//     updateAllTimes(); // ချက်ချင်း တစ်ခါပြမည်
//     const interval = setInterval(updateAllTimes, 1000); // စက္ကန့်တိုင်း run မည်

//     return () => clearInterval(interval);
//   }, [calculateTimes, mounted]);

//   // Animation Variants
//   const fadeUp: Variants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   // Hydration Loader
//   if (!mounted)
//     return (
//       <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center text-pink-300">
//         Loading your space...
//       </div>
//     );

//   return (
//     <div
//       className={`min-h-screen bg-[#FAFAFA] text-slate-800 selection:bg-pink-200 ${inter.className} pb-24 overflow-x-hidden`}>
//       {/* Soft Animated Background */}
//       <div className="fixed inset-0 -z-50 pointer-events-none">
//         <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-pink-100/40 blur-[100px]" />
//         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-rose-50/50 blur-[120px]" />
//       </div>

//       <div className="max-w-5xl mx-auto px-6 sm:px-10 pt-20">
//         {/* Hero Section */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={fadeUp}
//           className="text-center mb-20">
//           <p className="text-sm font-semibold tracking-[0.2em] text-pink-400 uppercase mb-4">
//             Our Journey
//           </p>
//           <h1
//             className={`text-5xl md:text-7xl font-bold text-slate-900 mb-6 ${playfair.className}`}>
//             Anniversary Space
//           </h1>
//           <p
//             className={`text-2xl md:text-3xl text-rose-400/80 ${dancingScript.className}`}>
//             Every moment matters.
//           </p>
//         </motion.div>

//         {/* Gamification Area (Center Stage) */}
//         <motion.div
//           initial="hidden"
//           animate="visible"
//           variants={fadeUp}
//           className="mb-24 flex justify-center">
//           <div className="w-full max-w-sm">
//             {stackData ? (
//               <StackGameUI
//                 initialCount={stackData.initialCount}
//                 coupleId={stackData.coupleId}
//                 userId={stackData.userId}
//               />
//             ) : (
//               <div className="h-[400px] rounded-[2rem] bg-white/40 animate-pulse border border-pink-50" />
//             )}
//           </div>
//         </motion.div>

//         {/* Time Elapsed Grid
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-100px" }}
//           variants={fadeUp}
//           className="mb-24">
//           <div className="flex items-center justify-between mb-8 px-2">
//             <h2 className={`text-3xl text-slate-800 ${playfair.className}`}>
//               Time Together
//             </h2>
//             <span className="text-sm font-medium text-slate-400 bg-white/50 px-4 py-1.5 rounded-full">
//               {currentMyanmarTime}
//             </span>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {[
//               { label: "Years", value: timeElapsed.years },
//               { label: "Months", value: timeElapsed.months },
//               { label: "Days", value: timeElapsed.days },
//               { label: "Hours", value: timeElapsed.hours },
//               { label: "Minutes", value: timeElapsed.minutes },
//               { label: "Seconds", value: timeElapsed.seconds },
//             ].map((unit) => (
//               <div
//                 key={unit.label}
//                 className="bg-white/70 backdrop-blur-sm border border-white p-6 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.02)] text-center">
//                 <div className="text-4xl font-light text-rose-500 mb-1">
//                   {unit.value.toString().padStart(2, "0")}
//                 </div>
//                 <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
//                   {unit.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </motion.div> */}

//         {/* Time Elapsed Grid */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, margin: "-100px" }}
//           variants={fadeUp}
//           className="mb-24">
//           <div className="flex items-center justify-between mb-8 px-2">
//             <h2 className={`text-3xl text-slate-800 ${playfair.className}`}>
//               Time Together
//             </h2>
//             <span className="text-sm font-medium text-slate-400 bg-white/50 px-4 py-1.5 rounded-full">
//               {currentMyanmarTime}
//             </span>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//             {[
//               { label: "Years", value: timeElapsed.years },
//               { label: "Months", value: timeElapsed.months },
//               { label: "Days", value: timeElapsed.days },
//               { label: "Hours", value: timeElapsed.hours },
//               { label: "Minutes", value: timeElapsed.minutes },
//               { label: "Seconds", value: timeElapsed.seconds },
//             ].map((unit) => (
//               <div
//                 key={unit.label}
//                 className="bg-white/70 backdrop-blur-sm border border-white p-6 rounded-2xl shadow-[0_4px_20px_0_rgba(0,0,0,0.02)] text-center">
//                 {/* 🌟 ဒီနေရာမှာ Odometer လေး အစားထိုးထားပါသည် */}
//                 <div className="text-4xl font-light text-rose-500 mb-1 flex justify-center items-center h-[40px] overflow-hidden">
//                   <AnimatedCounter
//                     value={unit.value}
//                     fontSize={36}
//                     // ဂဏန်း (၂) လုံးပြည့်အောင် (ဥပမာ - 03, 07, 09) အမြဲပြဖို့ places သတ်မှတ်ခြင်း
//                     places={
//                       unit.label === "Years" && unit.value > 99
//                         ? undefined
//                         : [10, 1]
//                     }
//                   />
//                 </div>

//                 <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mt-2">
//                   {unit.label}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </motion.div>

//         {/* 🌟 Dynamic Total Statistics (စက္ကန့်တိုင်း တက်နေပါမည်) */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}
//           className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-24">
//           <StatCard label="Total Days" value={totalCounts.totalDays} />
//           <StatCard label="Total Hours" value={totalCounts.totalHours} />
//           <StatCard label="Total Minutes" value={totalCounts.totalMinutes} />
//           <StatCard label="Total Seconds" value={totalCounts.totalSeconds} />
//         </motion.div>

//         {/* Minimal Timeline */}
//         <motion.div
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true }}
//           variants={fadeUp}>
//           <h2
//             className={`text-3xl text-slate-800 mb-10 px-2 ${playfair.className}`}>
//             Beautiful Memories
//           </h2>

//           {journeyEntries.length === 0 ? (
//             <div className="text-center py-16 bg-white/50 rounded-3xl border border-white text-slate-400">
//               Your story is waiting to be written.
//             </div>
//           ) : (
//             <div className="relative pl-8 md:pl-0">
//               <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-pink-100 md:-translate-x-1/2" />

//               {journeyEntries.map((entry, index) => (
//                 <div
//                   key={entry.id}
//                   className={`relative flex items-center justify-between mb-12 md:mb-16 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
//                   <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-rose-400 rounded-full md:-translate-x-1.25 ring-4 ring-white shadow-sm z-10" />
//                   <div className="hidden md:block w-5/12" />

//                   <div className="w-full md:w-5/12 pl-6 md:pl-0">
//                     <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-4xl shadow-[0_4px_25px_0_rgba(0,0,0,0.03)] border border-white hover:shadow-[0_8px_30px_0_rgba(255,192,203,0.15)] transition-all duration-300">
//                       <span className="text-sm font-semibold text-pink-400 tracking-wider uppercase mb-2 block">
//                         {new Date(entry.eventDate).toLocaleDateString("en-US", {
//                           month: "long",
//                           day: "numeric",
//                           year: "numeric",
//                         })}
//                       </span>
//                       <h3
//                         className={`text-2xl text-slate-800 mb-3 ${playfair.className}`}>
//                         {entry.title}
//                       </h3>
//                       {entry.description && (
//                         <p className="text-slate-500 leading-relaxed text-sm md:text-base">
//                           {entry.description}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }
// // 🌟 Odometer Style Count Up Animation ပါသော StatCard
// // Minimal Stat Card with Animated Counter
// function StatCard({ label, value }: { label: string; value: number }) {
//   return (
//     <div className="bg-white/40 backdrop-blur-sm border border-white p-6 rounded-[2rem] text-center flex flex-col items-center justify-center">
//       <div className="text-2xl md:text-3xl font-light text-slate-700 mb-1 flex justify-center">
//         {/* 🌟 Total များအတွက် Odometer Animation */}
//         <AnimatedCounter value={value} fontSize={28} />
//       </div>
//       <div className="text-[10px] sm:text-xs uppercase tracking-widest text-pink-400 font-semibold">{label}</div>
//     </div>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { Dancing_Script, Playfair_Display, Inter } from "next/font/google";
import { motion, Variants } from "framer-motion";
import {
  HeartIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import StackGameUI from "@/components/StackGameUI";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getInitialStackData } from "@/libs/action";

// Fonts: Premium blend of Elegant Serif and Clean Sans
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

// Types
interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
interface TotalCounts {
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}
interface JourneyEntry {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  sortOrder: number;
}
interface StackData {
  initialCount: number;
  coupleId: string;
  userId: string;
}

export default function PremiumAnniversaryDashboard() {
  const [mounted, setMounted] = useState(false);
  const [startDate, setStartDate] = useState<Date>(
    new Date("2022-10-01T00:00:00+06:30"),
  );

  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [totalCounts, setTotalCounts] = useState<TotalCounts>({
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
  });
  const [currentMyanmarTime, setCurrentMyanmarTime] = useState<string>("");

  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([]);
  const [stackData, setStackData] = useState<StackData | null>(null);

  const getMyanmarTime = useCallback(
    () =>
      new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Yangon" })),
    [],
  );

  const calculateTimes = useCallback(() => {
    const nowMyanmar = getMyanmarTime();
    const diffInMs = nowMyanmar.getTime() - startDate.getTime();

    const totalSecs = Math.max(0, Math.floor(diffInMs / 1000));
    const totalMins = Math.floor(totalSecs / 60);
    const totalHrs = Math.floor(totalMins / 60);
    const totalDys = Math.floor(totalHrs / 24);

    const years = Math.floor(totalDys / 365.25);
    const remainingDaysAfterYears = totalDys - Math.floor(years * 365.25);
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.floor(remainingDaysAfterYears - months * 30.44);

    return {
      elapsed: {
        years,
        months,
        days,
        hours: totalHrs % 24,
        minutes: totalMins % 60,
        seconds: totalSecs % 60,
      },
      totals: {
        totalDays: totalDys,
        totalHours: totalHrs,
        totalMinutes: totalMins,
        totalSeconds: totalSecs,
      },
    };
  }, [getMyanmarTime, startDate]);

  useEffect(() => {
    setMounted(true);
    const fetchJourney = async () => {
      try {
        const response = await fetch("/api/journey");
        if (!response.ok) return;
        const data = await response.json();
        if (data.startDate) setStartDate(new Date(data.startDate));
        setJourneyEntries(data.entries ?? []);
      } catch (e) {}
    };
    const fetchStackInfo = async () => {
      try {
        const data = await getInitialStackData();
        if (data) setStackData(data);
      } catch (e) {}
    };
    fetchJourney();
    fetchStackInfo();
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const updateAllTimes = () => {
      const times = calculateTimes();
      setTimeElapsed(times.elapsed);
      setTotalCounts(times.totals);
      setCurrentMyanmarTime(
        new Date().toLocaleString("en-US", {
          timeZone: "Asia/Yangon",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    updateAllTimes();
    const interval = setInterval(updateAllTimes, 1000);
    return () => clearInterval(interval);
  }, [calculateTimes, mounted]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  if (!mounted)
    return (
      <div className="min-h-screen bg-[#0a0508] flex items-center justify-center text-rose-900/50 tracking-widest text-sm uppercase">
        Awakening memories...
      </div>
    );

  return (
    // 🌟 Background ကို Pure Dark & Moody Romance ပုံစံ ပြောင်းထားပါသည်
    <div
      className={`min-h-screen bg-[#080305] text-rose-50 selection:bg-rose-500/30 ${inter.className} pb-32 overflow-x-hidden relative`}>
      {/* 🌟 Ambient Glow (နောက်ခံ အလင်းမှိန်မှိန်လေးများ) */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-rose-900/10 blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-900/10 blur-[120px] mix-blend-screen" />
        {/* Subtle noise overlay for cinematic texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-10 pt-24 md:pt-32">
        {/* 🌟 Hero Section: High-end Typography */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center mb-28 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 backdrop-blur-md mb-8">
            <SparklesIcon className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-medium tracking-[0.3em] text-rose-300 uppercase">
              Our Private Universe
            </span>
          </div>
          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-medium text-transparent bg-clip-text bg-gradient-to-b from-white to-rose-200 mb-6 leading-tight ${playfair.className}`}>
            A Lifetime <br className="md:hidden" /> With You
          </h1>
          <p
            className={`text-2xl md:text-4xl text-rose-400/80 mt-4 ${dancingScript.className}`}>
            Every second feels like a heartbeat.
          </p>
        </motion.div>

        {/* 🌟 Gamification Area */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-32 flex justify-center">
          <div className="w-full max-w-sm relative">
            {/* Soft glow behind the card */}
            <div className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full" />
            <div className="relative">
              {stackData ? (
                <StackGameUI
                  initialCount={stackData.initialCount}
                  coupleId={stackData.coupleId}
                  userId={stackData.userId}
                />
              ) : (
                <div className="h-[400px] rounded-[3rem] bg-white/5 backdrop-blur-md animate-pulse border border-white/10" />
              )}
            </div>
          </div>
        </motion.div>

        {/* 🌟 Meaningful Time Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 px-4 md:px-8">
            <div>
              <h2
                className={`text-4xl md:text-5xl text-rose-50 mb-3 ${playfair.className}`}>
                The Chapters We&apos;ve Written
              </h2>
              <p className="text-sm tracking-widest uppercase text-rose-400/60 font-medium">
                Since that beautiful day
              </p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-2 text-rose-200/50 bg-white/5 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs font-medium tracking-wider">
                {currentMyanmarTime}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-5 px-2 md:px-0">
            {[
              { label: "Years", value: timeElapsed.years },
              { label: "Months", value: timeElapsed.months },
              { label: "Days", value: timeElapsed.days },
              { label: "Hours", value: timeElapsed.hours },
              { label: "Minutes", value: timeElapsed.minutes },
              { label: "Seconds", value: timeElapsed.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 md:p-8 rounded-3xl text-center hover:bg-white/[0.06] transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-500/0 to-rose-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex justify-center items-center h-[36px] md:h-[48px] overflow-hidden mb-2 text-3xl md:text-5xl font-light text-rose-200">
                  <AnimatedCounter
                    value={unit.value}
                    fontSize={window.innerWidth < 768 ? 28 : 42}
                    places={
                      unit.label === "Years" && unit.value > 99
                        ? undefined
                        : [10, 1]
                    }
                  />
                </div>
                <div className="relative z-10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-rose-400/70 font-semibold">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 🌟 Total Statistics: Poetic Copy */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-32 px-2 md:px-0">
          <StatCard label="Days we've shared" value={totalCounts.totalDays} />
          <StatCard
            label="Hours of thinking of you"
            value={totalCounts.totalHours}
          />
          <StatCard
            label="Minutes of missing you"
            value={totalCounts.totalMinutes}
          />
          <StatCard
            label="Seconds of loving you"
            value={totalCounts.totalSeconds}
          />
        </motion.div>

        {/* 🌟 Cinematic Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <HeartIcon className="w-8 h-8 text-rose-500/50 mx-auto mb-4" />
            <h2 className={`text-4xl text-rose-50 ${playfair.className}`}>
              Moments Frozen in Time
            </h2>
          </div>

          {journeyEntries.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 text-rose-200/50 font-light">
              Our story is just beginning...
            </div>
          ) : (
            <div className="relative border-l border-rose-500/20 ml-4 md:ml-0 md:border-none space-y-12">
              {/* Desktop Center Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/0 via-rose-500/20 to-rose-500/0 -translate-x-1/2" />

              {journeyEntries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`relative flex items-center justify-between group ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  {/* Glowing Dot */}
                  <div className="absolute left-[-5px] md:left-1/2 w-3 h-3 bg-rose-400 rounded-full md:-translate-x-1.5 shadow-[0_0_15px_rgba(251,113,133,0.6)] z-10 transition-transform duration-500 group-hover:scale-150" />

                  <div className="hidden md:block w-5/12" />

                  <div className="w-full pl-8 md:pl-0 md:w-5/12">
                    <div className="bg-white/[0.03] backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-white/10 hover:bg-white/[0.08] hover:border-rose-400/30 transition-all duration-500 cursor-default">
                      <div className="flex items-center gap-2 mb-3 text-rose-400/80">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span className="text-xs font-semibold tracking-widest uppercase">
                          {new Date(entry.eventDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "2-digit", year: "numeric" },
                          )}
                        </span>
                      </div>
                      <h3
                        className={`text-2xl text-rose-100 mb-2 ${playfair.className}`}>
                        {entry.title}
                      </h3>
                      {entry.description && (
                        <p className="text-rose-100/50 leading-relaxed text-sm font-light">
                          {entry.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// 🌟 Premium Stat Card
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="relative group bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] text-center flex flex-col justify-center overflow-hidden transition-all duration-500 hover:border-rose-500/30">
      <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 text-3xl md:text-4xl font-light text-rose-100 mb-2 flex justify-center">
        {/* 🌟 Odometer Effect */}
        <AnimatedCounter value={value} fontSize={32} />
      </div>
      <div className="relative z-10 text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-rose-300/60 font-semibold">
        {label}
      </div>
    </div>
  );
}