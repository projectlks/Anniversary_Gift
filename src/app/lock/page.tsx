"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Cormorant_Garamond, Albert_Sans } from "next/font/google";
import { motion } from "framer-motion";
import Keyboard from "@/components/Keyboard";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";

// Premium Fonts
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const MIN_PASSCODE_LENGTH = 4;
const MAX_PASSCODE_LENGTH = 6;

export default function Lock() {
  const [number, setNumber] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  const router = useRouter();

  const checkCode = useCallback(async () => {
    const code = number.join("");

    if (
      code.length < MIN_PASSCODE_LENGTH ||
      isLoading ||
      submittedCode === code
    ) {
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setSubmittedCode(code);

    try {
      const response = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: code }),
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        setIsSuccess(true);
        // လှပစွာ ဖွင့်သွားသည့် ခံစားချက်ရရန် အနည်းငယ် Delay ပေးထားသည်
        setTimeout(() => {
          router.push(data.redirectTo ?? "/menus");
        }, 800);
      } else {
        setIsSuccess(false);
        setIsError(true); // မှားယွင်းကြောင်း Animation ပြရန်

        setTimeout(() => {
          setNumber([]);
          setSubmittedCode(null);
          setIsError(false);
        }, 800);
      }
    } catch {
      setIsLoading(false);
      setIsError(true);
      setTimeout(() => {
        setNumber([]);
        setSubmittedCode(null);
        setIsError(false);
      }, 800);
    }
  }, [isLoading, number, router, submittedCode]);

  const submitCode = useCallback(() => {
    void checkCode();
  }, [checkCode]);

  useEffect(() => {
    if (number.length !== MAX_PASSCODE_LENGTH) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void checkCode();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [number.length, checkCode]);

  return (
    <section
      className={`relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-stone-50 px-4 ${albertSans.className}`}>
      {/* === ၁။ Ambient Glowing Background === */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] top-[-5%] h-[40vh] w-[40vh] rounded-full bg-rose-200/50 blur-[100px]" />
        <div className="absolute right-[-10%] bottom-[-5%] h-[50vh] w-[50vh] rounded-full bg-rose-100/50 blur-[120px]" />
      </div>

      {/* === ၂။ Main Glassmorphism Card === */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 pt-12 pb-10 shadow-[0_20px_60px_-15px_rgba(225,29,72,0.1)] backdrop-blur-2xl sm:p-10">
        {/* Inner border for depth */}
        <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 pointer-events-none" />

        {/* Lock Icon */}
        <motion.div
          animate={isSuccess ? { scale: 1.1, color: "#10b981" } : {}}
          className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-rose-100 to-rose-50 shadow-inner ring-1 ring-rose-200/50">
          {isSuccess ? (
            // Unlocked Icon

            <LockOpenIcon className="h-10 w-10 text-emerald-500" />
          ) : (
            // Locked Icon
            <LockClosedIcon className="h-10 w-10 text-rose-400" />
          )}
        </motion.div>

        {/* Title */}
        <h1
          className={`mb-2 text-center text-3xl font-semibold text-stone-800 sm:text-4xl ${cormorant.className}`}>
          Unlock Our Memories
        </h1>
        <p className="mb-8 text-center text-sm font-medium tracking-wide text-stone-500">
          Enter your special anniversary code
        </p>

        {/* === ၃။ Elegant PIN Slots (Passcode) === */}
        {/* Error ဖြစ်ပါက ဘယ်ညာခါယမ်းမည့် Animation ထည့်သွင်းထားသည် */}
        <motion.div
          animate={isError ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="mb-10 flex w-full justify-center gap-2 sm:gap-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex h-12 w-10 sm:h-14 sm:w-12 items-center justify-center rounded-xl border text-xl font-semibold shadow-sm transition-all duration-300 ${
                number[i]
                  ? isSuccess
                    ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                    : isError
                      ? "border-red-400 bg-red-50 text-red-500"
                      : "border-rose-400 bg-rose-50 text-rose-600 scale-105"
                  : "border-stone-200 bg-white/50 text-transparent"
              }`}>
              {/* ဂဏန်းရိုက်ထည့်လိုက်ပါက အပေါ်သို့ Pop-up ဖြစ်၍ ပေါ်လာမည့် Animation */}
              {number[i] && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  {number[i]}
                </motion.span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Loading Indicator */}
        <div className="absolute top-[60%] flex h-6 items-center justify-center">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-rose-400">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-rose-400 border-t-transparent" />
              Verifying...
            </motion.div>
          )}
        </div>

        {/* === ၄။ Keyboard Container === */}
        {/* သင့်၏ မူလ Keyboard Component ကို ဤနေရာတွင် အသုံးပြုထားပါသည်။ */}
        <div className="w-full mt-2">
          <Keyboard
            setNumber={setNumber}
            number={number}
            onSubmit={submitCode}
            maxLength={MAX_PASSCODE_LENGTH}
          />
        </div>
      </motion.div>
    </section>
  );
}
