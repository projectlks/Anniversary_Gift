"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { motion } from "framer-motion";
import { Cormorant_Garamond, Albert_Sans, Great_Vibes } from "next/font/google";
import heart from "../components/animations/heart.json";

// Premium Serif Font (ခေါင်းစဉ်များအတွက်)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Clean Sans Font (စာသားများအတွက်)
const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

// Elegant Signature Font (အလှဆင် စာသားများအတွက်)
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

export default function LandingPage() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const router = useRouter();

  useEffect(() => {
    if (lottieRef.current) {
      // Animation ကို အနည်းငယ် နှေးစေပြီး ပိုမို Romantic ဆန်စေရန်
      lottieRef.current.setSpeed(0.5);
    }
  }, []);

  return (
    <section
      className={`relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#FAFAF9] px-4 sm:px-6 ${albertSans.className}`}>
      {/* === ၁။ Ambient Glowing Background (Premium Feel) === */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] top-[-10%] h-[50vh] w-[50vh] rounded-full bg-rose-200/40 blur-[100px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[60vh] w-[60vh] rounded-full bg-orange-100/40 blur-[120px]" />
      </div>

      {/* === ၂။ Main Glassmorphism Card === */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 pt-10 pb-12 shadow-[0_20px_60px_-15px_rgba(225,29,72,0.15)] backdrop-blur-2xl sm:p-14">
        {/* Subtle inner border for realism */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 pointer-events-none" />

        {/* Lottie Animation (Placed elegantly at the top) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative mb-4 h-28 w-28 sm:h-32 sm:w-32 drop-shadow-md">
          <Lottie lottieRef={lottieRef} animationData={heart} loop={true} />
        </motion.div>

        {/* Text Content */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="tracking-[0.3em] text-[10px] sm:text-xs font-semibold uppercase text-rose-400/80">
            A Timeless Memory
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className={`text-4xl sm:text-5xl md:text-6xl text-stone-800 leading-tight ${cormorant.className}`}>
            Happy <span className="italic text-rose-900/80">Anniversary</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className={`text-3xl sm:text-4xl text-rose-500/90 ${greatVibes.className}`}>
            My Dearest Love
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="pt-2 text-sm sm:text-base font-light text-stone-500">
            A little surprise wrapped in love, just for you.
          </motion.p>
        </div>

        {/* === ၃။ Premium Call-to-Action Button === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="mt-10 w-full sm:w-auto">
          <motion.button
            onClick={() => router.push("/lock")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative flex w-full items-center justify-center gap-3 rounded-full bg-linear-to-tr from-rose-400 to-rose-500 px-8 py-3.5 sm:px-10 sm:py-4 text-sm sm:text-base font-medium tracking-wide text-white shadow-[0_8px_25px_rgba(244,63,94,0.3)] transition-shadow hover:shadow-[0_12px_35px_rgba(244,63,94,0.4)]">
            <span>Unlock Our Gift</span>
            {/* Elegant Arrow Icon */}
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}
