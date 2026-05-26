"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Paper, { type LoveNoteView } from "./Paper";
import Seal from "./Steal";

const defaultNote: LoveNoteView = {
  dateLabel: "Our Anniversary, 2026",
  title: "A Letter to My Soulmate",
  greeting: "My Dearest Princess,",
  content:
    "Every single day with you feels like a beautiful dream. You bring so much light, laughter, and love into my world. I am incredibly grateful for your warm hugs, your endless patience, and the way you always know how to make me smile.\n\nThank you for being my safe place and my greatest adventure. No matter where life takes us, I promise to hold your hand and love you more with each passing day.",
  closing: "Yours completely and forever,",
  signature: "Your Name",
};

export default function NotePage() {
  const [note, setNote] = useState<LoveNoteView>(defaultNote);

  // Scroll ပိုမိုသက်တောင့်သက်သာ ဆွဲနိုင်ရန် Container အမြင့်ကို 300vh သို့ တိုးထားပါသည်
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ၁။ အဖုံးလှည့်ခြင်း (Scroll 0% မှ 10% အတွင်း 180 ဒီဂရီ လှန်မည်)
  const flapRotateX = useTransform(scrollYProgress, [0, 0.1], [0, 180]);
  const flapZIndex = useTransform(
    scrollYProgress,
    [0, 0.05, 0.06],
    [30, 30, 5],
  );
  const sealOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // ၂။ စာရွက် အပေါ်ထွက်လာခြင်း
  // "0%" = စာအိတ်၏ top-[20px] နေရာတွင် အသင့်ရှိနေမည်။ ဘယ်ကမှ ရုတ်တရက် ထွက်လာမည်မဟုတ်ပါ။
  // "-100%" = စာရွက်တစ်ခုလုံး အပြင်သို့ အပြည့်ထွက်လာမည်။
  const paperY = useTransform(scrollYProgress, [0.12, 0.8], ["0%", "-100%"]);

  // ၃။ စာအိတ်တစ်ခုလုံး အပေါ်ရွေ့ခြင်း (Scroll 80% မှ 100% တွင် အလုပ်လုပ်မည်)
  const envelopeY = useTransform(
    scrollYProgress,
    [0.8, 1.0],
    ["0px", "-600px"],
  );

  useEffect(() => {
    let cancelled = false;
    const fetchNote = async () => {
      try {
        const response = await fetch("/api/note");
        if (!response.ok) return;
        const data = (await response.json()) as LoveNoteView;
        if (!cancelled) setNote({ ...defaultNote, ...data });
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
    <section
      ref={containerRef}
      className="relative w-full "
      style={{ height: "300vh" }}>
      {/* Scroll Hint */}
      <div className="fixed top-8 sm:top-10 left-1/2 -translate-x-1/2 text-rose-400/80 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase animate-pulse ">
        Scroll down to view letter
      </div>

      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden p-4">
        <motion.div
          style={{ y: envelopeY }}
          className="relative aspect-[3/2] w-full max-w-[720px] bg-rose-950 perspective-[1000px] translate-y-[10vh] shadow-[0_30px_60px_-15px_rgba(225,29,72,0.3)] ">
          {/* === ၁။ အပေါ်အဖုံး === */}
          <motion.div
            className="absolute left-0 top-0 h-[60%] w-full origin-top"
            style={{
              rotateX: flapRotateX,
              zIndex: flapZIndex,
              transformStyle: "preserve-3d",
            }}>
            <div
              className="absolute inset-0 bg-rose-600 drop-shadow-[0_5px_15px_rgba(0,0,0,0.15)]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 35%, 50% 100%, 0 35%)",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-1/2 aspect-square -translate-x-1/2 translate-y-[10%] transform"
              style={{ opacity: sealOpacity, zIndex: 45 }}>
              <Seal />
            </motion.div>
          </motion.div>

          {/* === ၂။ စာရွက်နှင့် PRO MASK CONTAINER === */}
          {/* စာအိတ်၏ top-[20px] မှစတင်ပြီး အောက်ခြေ 5% တွင် အတိအကျ ဖြတ်ထားပါသည် */}
          <div
            className="absolute left-[3%] right-[3%] top-[20px] bottom-[5%] z-10 pointer-events-none"
            style={{
              // ဤ CSS သည် အပေါ်ဘက် 300vh အထိ မြင်ခွင့်ပေးပြီး ကျန်ဘက်များကို Mask လုပ်ပေးပါသည်
              clipPath: "inset(-300vh 0 0 0)",
            }}>
            <motion.div
              // paperY သည် 0% တွင် စတင်သဖြင့် ဤစာရွက်သည် top-[20px] တွင် သဘာဝကျကျ အသင့်ရှိနေမည်ဖြစ်သည်
              className="relative w-full h-auto bg-[#FFFCF9] shadow-[0_-5px_25px_rgba(0,0,0,0.08)] pointer-events-auto"
              style={{ y: paperY }}>
              {/* စာရွက် -100% အထိ အပေါ်ထွက်သွားသည့်တိုင်အောင် အောက်ခြေမှ လွတ်ထွက်မသွားစေရန် pb-[400px] ကို PRO Trick အနေဖြင့် ထည့်ထားပါသည် */}
              <div className="w-full h-full  pb-[100px]">
                <Paper note={note} />
              </div>
            </motion.div>
          </div>

          {/* === ၃။ ဘေးဘက်အဖုံးများ === */}
          <div
            className="absolute inset-0 z-20 pointer-events-none bg-rose-800"
            style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }}
          />
          <div
            className="absolute inset-0 z-20 pointer-events-none bg-rose-800"
            style={{ clipPath: "polygon(100% 0, 50% 50%, 100% 100%)" }}
          />

          {/* === ၄။ အောက်ဘက်အဖုံး === */}
          <div
            className="absolute inset-0 z-20 pointer-events-none bg-rose-700"
            style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}>
            <div className="absolute bottom-0 left-0 h-[1px] w-[50%] origin-bottom-left -rotate-[34deg] bg-rose-900/20" />
            <div className="absolute bottom-0 right-0 h-[1px] w-[50%] origin-bottom-right rotate-[34deg] bg-rose-900/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}