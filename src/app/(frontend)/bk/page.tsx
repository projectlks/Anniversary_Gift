// "use client";

// import { useEffect, useState } from "react";
// import Paper, { type LoveNoteView } from "./Paper";
// import Seal from "./Steal";

// const defaultNote: LoveNoteView = {
//   dateLabel: "",
//   title: "My Dearest Love,",
//   greeting: "My Dearest Love,",
//   content: "Every moment with you is a memory I treasure forever.",
//   closing: "Forever and always yours,",
//   signature: "Your Beloved",
// };

// export default function NotePage() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isFirstTime, setIsFirstTime] = useState(true);
//   const [isReversing, setIsReversing] = useState(false);
//   const [zIndex, setZIndex] = useState(30);
//   const [note, setNote] = useState<LoveNoteView>(defaultNote);

//   const handleClick = () => {
//     if (isFirstTime) setIsFirstTime(false);

//     const reversing = isOpen;
//     setZIndex(reversing ? 20 : 30);
//     setIsReversing(reversing);
//     setIsOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     if (!isReversing) return;

//     const timeout = window.setTimeout(() => {
//       setZIndex(30);
//     }, 2000);

//     return () => window.clearTimeout(timeout);
//   }, [isReversing]);

//   useEffect(() => {
//     let cancelled = false;

//     const fetchNote = async () => {
//       try {
//         const response = await fetch("/api/note");
//         if (!response.ok) return;

//         const data = (await response.json()) as LoveNoteView;
//         if (!cancelled) {
//           setNote({ ...defaultNote, ...data });
//         }
//       } catch (error) {
//         console.error("Failed to fetch note:", error);
//       }
//     };

//     void fetchNote();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   return (
//     <section className="flex h-screen w-full items-center justify-center overflow-y-auto ">
//       <div
//         onClick={handleClick}
//         className={`relative aspect-[3/2] w-[90%] max-w-[700px] bg-blue-900 transition-all duration-700 perspective-[1000px] ${
//           !isFirstTime ? (isOpen ? "translate-y-[200px]" : "translate-y-0") : ""
//         }`}
//       >
//         <div
//           className={`relative transform-3d ${
//             isReversing ? "reverse" : isOpen ? "open z-20" : "z-30"
//           }`}
//           style={{ zIndex }}
//         >
//           <div
//             className={`absolute top-0 h-[100px] w-full origin-top transform border-b bg-blue-700 transition-all duration-700 ${
//               !isFirstTime ? (isOpen ? "cover" : "reverse-cover") : ""
//             }`}
//           >
//             <div className="absolute -bottom-[150px] h-0 w-full border-l-[200px] border-r-[200px] border-t-[150px] border-l-transparent border-r-transparent border-t-blue-700" />

//             <div className="transform-all absolute -bottom-[200px] left-1/2 aspect-square -translate-x-1/2 transform rounded-full bg-blue-900">
//               <Seal />
//             </div>
//           </div>
//         </div>

//         <div
//           className={`absolute left-1/2 w-[calc(100%-20px)] -translate-x-1/2 transform bg-white transition-all ${
//             !isFirstTime
//               ? isOpen
//                 ? "paperAnimation top-0  overflow-hidden"
//                 : "paperAnimationReverse z-40"
//               : "h-full"
//           }`}
//         >
//           <Paper note={note} />
//         </div>

//         <div className="absolute z-20 h-0 w-0 border-b-[300px] border-r-[300px] border-b-blue-800 border-r-transparent" />
//         <div className="absolute right-0 z-20 h-0 w-0 border-b-[300px] border-l-[300px] border-b-blue-800 border-l-transparent" />

//         <div className="absolute bottom-0 z-20 h-[50%] w-full overflow-hidden bg-blue-800">
//           <div className="absolute bottom-0 left-0 h-0 w-[50%] origin-bottom-left -rotate-[45deg] border-t-2 border-blue-950" />
//           <div className="absolute bottom-0 right-0 h-0 w-[50%] origin-bottom-right rotate-[45deg] border-t-2 border-blue-950" />
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Paper, { type LoveNoteView } from "./Paper";
import Seal from "./Steal";

const defaultNote: LoveNoteView = {
  dateLabel: "",
  title: "My Dearest Love,",
  greeting: "My Dearest Love,",
  content: "Every moment with you is a memory I treasure forever.",
  closing: "Forever and always yours,",
  signature: "Your Beloved",
};

export default function NotePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState<LoveNoteView>(defaultNote);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    let cancelled = false;
    const fetchNote = async () => {
      try {
        const response = await fetch("/api/note");
        if (!response.ok) return;
        const data = (await response.json()) as LoveNoteView;
        if (!cancelled) {
          setNote({ ...defaultNote, ...data });
        }
      } catch (error) {
        console.error("Failed to fetch note:", error);
      }
    };
    void fetchNote();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex h-[100dvh] w-full items-center justify-center overflow-hidden bg-slate-50 p-4">
      {/* စာအိတ် Main Container: Mobile/Desktop အချိုးကျစေရန် aspect-[3/2] ကိုအသုံးပြုထားသည်။
        စာရွက် အပေါ်ထွက်လာရန် နေရာပေးသည့်အနေဖြင့် ဖွင့်ချိန်တွင် အောက်သို့ အနည်းငယ်ချပေးသည်။
      */}
      <div
        onClick={handleClick}
        className={`relative aspect-[3/2] w-full max-w-[600px] cursor-pointer bg-blue-950 shadow-2xl transition-transform duration-700 ease-in-out perspective-[1000px] ${
          isOpen ? "translate-y-[25vh] sm:translate-y-[20vh]" : "translate-y-0"
        }`}>
        {/* === ၁။ အပေါ်အဖုံး (Top Flap) === */}
        <div
          className="absolute left-0 top-0 z-40 h-[65%] w-full origin-top transition-all duration-700 ease-in-out"
          style={{
            transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            transformStyle: "preserve-3d",
            zIndex: isOpen ? 10 : 40,
            transitionDelay: isOpen ? "0ms" : "700ms", // ပိတ်လျှင် စာရွက်အောက်ဆင်းသည်အထိ စောင့်မည်
          }}>
          {/* Responsive Top Flap Shape (Rectangle + Triangle) */}
          <div
            className="absolute inset-0 bg-blue-700 drop-shadow-md"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 45%, 50% 100%, 0 45%)",
            }}
          />

          {/* Wax Seal */}
          <div
            className="absolute bottom-0 left-1/2 aspect-square -translate-x-1/2 translate-y-[20%] transform transition-opacity duration-300"
            style={{
              zIndex: 45,
              opacity: isOpen ? 0 : 1,
              transitionDelay: isOpen ? "0ms" : "700ms",
            }}>
            <Seal />
          </div>
        </div>

        {/* === ၂။ စာရွက် (The Paper) === */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-1/2 w-[94%] -translate-x-1/2 rounded-t-xl bg-white shadow-xl transition-all duration-700 ease-in-out ${
            // ဖွင့်ထားချိန်: bottom-[45%] သို့ တက်သွားသဖြင့် စာအိတ်အဖုံးများ၏ အပေါ်သို့ လုံးဝရောက်သွားမည် (စာမကွယ်တော့ပါ)
            isOpen
              ? "bottom-[45%] h-[180%] z-20 opacity-100"
              : "bottom-[5%] h-[90%] z-20 opacity-0 pointer-events-none"
          }`}
          style={{
            transitionDelay: isOpen ? "700ms" : "0ms", // ဖွင့်လျှင် အဖုံးပွင့်သည်အထိ စောင့်မည်
          }}>
          <div className="no-scrollbar h-full w-full overflow-y-auto overflow-x-hidden rounded-t-xl pb-10">
            <Paper note={note} />
          </div>
        </div>

        {/* === ၃။ ဘေးဘက်အဖုံးများ (Side Flaps) === */}
        <div
          className="absolute inset-0 z-30 pointer-events-none bg-blue-800"
          style={{ clipPath: "polygon(0 0, 50% 55%, 0 100%)" }}
        />
        <div
          className="absolute inset-0 z-30 pointer-events-none bg-blue-800"
          style={{ clipPath: "polygon(100% 0, 50% 55%, 100% 100%)" }}
        />

        {/* === ၄။ အောက်ဘက်အဖုံး (Bottom Flap) === */}
        <div
          className="absolute inset-0 z-30 pointer-events-none bg-blue-700"
          style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}>
          {/* Depth အတွက် အရိပ်မျဉ်းများ (Optional) */}
          <div className="absolute bottom-0 left-0 h-[1px] w-[50%] origin-bottom-left -rotate-[34deg] bg-blue-900/30" />
          <div className="absolute bottom-0 right-0 h-[1px] w-[50%] origin-bottom-right rotate-[34deg] bg-blue-900/30" />
        </div>
      </div>
    </section>
  );
}