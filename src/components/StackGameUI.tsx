// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { HeartIcon } from "@heroicons/react/24/solid";
// import { processStackClickAction } from "@/libs/action";
// // import { processStackClickAction } from "@/app/(frontend)/journey/‌action";
// // import { processStackClickAction } from "@/libs/action"; // 🌟 Action အသစ်ကို ချိတ်ဆက်ထားသည်

// // 🌟 [အသစ်ထည့်ရန်] Props Type များကို သေချာ ကြေညာပါမည်
// interface StackGameUIProps {
//   initialCount: number;

// }

// // 🌟 [ဒီနေရာကို ပြင်ပါမည်] Props (၃) ခုလုံးကို လက်ခံပါမည်
// export default function StackGameUI({ initialCount }: StackGameUIProps) {
//   const [count, setCount] = useState(initialCount);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [statusMsg, setStatusMsg] = useState("Tap to send love today! 💖"); // 🌟 Message ပြရန်

//   const getStageStyle = (currentCount: number) => {
//     if (currentCount >= 500)
//       return {
//         color: "text-purple-500",
//         bg: "bg-purple-100 border-purple-300",
//         scale: 1.3,
//       };
//     if (currentCount >= 100)
//       return {
//         color: "text-orange-500",
//         bg: "bg-orange-100 border-orange-300",
//         scale: 1.15,
//       };
//     if (currentCount >= 50)
//       return {
//         color: "text-pink-500",
//         bg: "bg-pink-100 border-pink-300",
//         scale: 1.05,
//       };
//     return {
//       color: "text-rose-400",
//       bg: "bg-rose-50 border-rose-200",
//       scale: 1,
//     };
//   };

//   const currentStage = getStageStyle(count);

//   const handleStackClick = async () => {
//     if (isLoading) return; // Loading ဖြစ်နေရင် ထပ်နှိပ်မရအောင် တားထားမည်

//     setIsLoading(true);
//     setStatusMsg("Processing... ⏳");

//     // Server သို့ လှမ်းမေးမည်
//     const res = await processStackClickAction();

//     if (res) {
//       setCount(res.currentStack);
//       setStatusMsg(res.message); // Server က ပေးတဲ့ Message ကို ပြမည်

//       // နှစ်ယောက်လုံး ပြည့်လို့ တကယ် Stack တက်သွားမှသာ Animation လုပ်မည်
//       if (res.isLevelUp) {
//         setIsAnimating(true);
//         setTimeout(() => setIsAnimating(false), 1200);
//       }
//     } else {
//       setStatusMsg("Connection error 😢");
//     }

//     setIsLoading(false);
//   };

//   return (
//     <div
//       className={`p-6 md:p-8 rounded-3xl border-2 shadow-lg flex flex-col items-center justify-center transition-all duration-500 ${currentStage.bg}`}>
//       {/* 🌟 Dynamic Title (Server Message) */}
//       <motion.h3
//         key={statusMsg} // စာသားပြောင်းတိုင်း Animation ပြန်စရန်
//         initial={{ y: -5, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         className={`text-lg md:text-xl text-center font-bold mb-6 min-h-[3rem] ${currentStage.color}`}>
//         {statusMsg}
//       </motion.h3>

//       {/* Interactive Button */}
//       <motion.button
//         onClick={handleStackClick}
//         whileHover={!isLoading ? { scale: 1.05 } : {}}
//         whileTap={!isLoading ? { scale: 0.9 } : {}}
//         className={`relative group focus:outline-none ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}>
//         <motion.div
//           animate={{
//             scale: isAnimating ? currentStage.scale + 0.2 : currentStage.scale,
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 15 }}
//           className="relative z-10">
//           <HeartIcon
//             className={`w-24 h-24 md:w-32 md:h-32 drop-shadow-xl ${currentStage.color} transition-colors duration-500`}
//           />
//         </motion.div>

//         {/* 🌟 Level Up ဖြစ်မှသာ +1 လေးတွေ လွင့်ထွက်လာမည် */}
//         <AnimatePresence>
//           {isAnimating && (
//             <motion.div
//               initial={{ opacity: 1, y: 0, scale: 0.5 }}
//               animate={{ opacity: 0, y: -80, scale: 2 }}
//               exit={{ opacity: 0 }}
//               className={`absolute top-0 left-1/2 -translate-x-1/2 text-3xl font-black ${currentStage.color}`}>
//               +1
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.button>

//       {/* Score Counter */}
//       <div className="mt-8 text-center">
//         <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
//           Mutual Stacks
//         </p>
//         <motion.p
//           key={count}
//           initial={{ scale: 1.5, color: "#f43f5e" }}
//           animate={{ scale: 1, color: "#1f2937" }}
//           className="text-4xl md:text-5xl font-black text-gray-800">
//           {count.toLocaleString()}
//         </motion.p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon } from "@heroicons/react/24/solid";
import { processStackClickAction } from "@/libs/action";

// 🌟 [Type Safety] Props များကို အတိအကျ သတ်မှတ်ထားပါသည်
interface StackGameUIProps {
  initialCount: number;
  coupleId: string;
  userId: string;
}

export default function StackGameUI({
  initialCount,
  coupleId,
  userId,
}: StackGameUIProps) {
  const [count, setCount] = useState(initialCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState(
    "Tap the heart to send love today ✨",
  );

  // Premium Romantic Colors
  const getStageStyle = (currentCount: number) => {
    if (currentCount >= 500)
      return {
        color: "text-purple-500",
        shadow: "drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]",
        scale: 1.15,
      };
    if (currentCount >= 100)
      return {
        color: "text-orange-400",
        shadow: "drop-shadow-[0_0_25px_rgba(251,146,60,0.5)]",
        scale: 1.1,
      };
    if (currentCount >= 50)
      return {
        color: "text-rose-500",
        shadow: "drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]",
        scale: 1.05,
      };
    return {
      color: "text-pink-400",
      shadow: "drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]",
      scale: 1,
    };
  };

  const currentStage = getStageStyle(count);

  const handleStackClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setStatusMsg("Whispering to the stars... ✨");

    try {
      const res = await processStackClickAction();
      if (res) {
        setCount(res.currentStack);
        setStatusMsg(res.message);
        if (res.isLevelUp) {
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1500);
        }
      }
    } catch (error) {
      setStatusMsg("A tiny error occurred. Try again 💖");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-[2rem] border border-white p-8 shadow-[0_8px_32px_0_rgba(255,192,203,0.2)] flex flex-col items-center justify-center relative overflow-hidden">
      <p className="text-sm font-semibold tracking-widest text-pink-400 uppercase mb-2">
        Mutual Connection
      </p>

      <motion.div
        key={count}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-6xl font-black text-slate-800 tracking-tighter mb-8">
        {count.toLocaleString()}
      </motion.div>

      <motion.button
        onClick={handleStackClick}
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.05 } : {}}
        whileTap={!isLoading ? { scale: 0.95 } : {}}
        className="relative group focus:outline-none mb-8">
        <motion.div
          animate={{
            scale: isAnimating ? currentStage.scale + 0.1 : currentStage.scale,
          }}
          transition={{ type: "spring" }}>
          <HeartIcon
            className={`w-28 h-28 ${currentStage.color} ${currentStage.shadow} transition-all duration-700 ease-out`}
          />
        </motion.div>

        <AnimatePresence>
          {isAnimating && (
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 0.5 }}
              animate={{ opacity: 0, y: -100, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-black ${currentStage.color} pointer-events-none`}>
              +1
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.p
        key={statusMsg}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-slate-500 font-medium text-center h-12 flex items-center justify-center">
        {statusMsg}
      </motion.p>
    </div>
  );
}