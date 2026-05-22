"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface Burst {
  id: number;
  x: number;
  y: number;
}

export default function MagicTouch() {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    // Mouse နှိပ်လိုက်တိုင်း (သို့) ဖုန်း မျက်နှာပြင်ကို ထိလိုက်တိုင်း အလုပ်လုပ်မည့် Function
    const handleTouch = (e: MouseEvent | TouchEvent) => {
      let x, y;

      if ("touches" in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }

      const newId = Date.now();

      // နေရာသစ်မှာ Burst တစ်ခု ထည့်မည်
      setBursts((prev) => [...prev, { id: newId, x, y }]);

      // Animation ပြီးသွားရင် (1 second) Memory မစားအောင် ပြန်ဖျက်ပစ်မည်
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== newId));
      }, 1000);
    };

    window.addEventListener("mousedown", handleTouch);
    window.addEventListener("touchstart", handleTouch);

    return () => {
      window.removeEventListener("mousedown", handleTouch);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    // 🌟 အခြားခလုတ်များကို နှိပ်လို့ရအောင် pointer-events-none သုံးထားပါသည်
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="absolute"
            style={{ left: burst.x, top: burst.y }}>
            {/* တစ်ကြိမ်ထိလိုက်တိုင်း အမှုန် (၆) ခု ထွက်လာပါမည် */}
            {Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 60 * Math.PI) / 180; // စက်ဝိုင်းပုံစံ အဘက်ဘက်သို့ ဖြာထွက်ရန်
              const distance = Math.random() * 40 + 40; // အကွာအဝေး Random

              return (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance - 20, // အပေါ်ကို နည်းနည်း ပိုတက်သွားစေရန်
                    scale: Math.random() * 0.5 + 0.5,
                    opacity: 0,
                    rotate: Math.random() * 90 - 45, // နည်းနည်းလေး စောင်းသွားရန်
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-md">
                  {/* မဂ္ဂဇင်းစတိုင်: နှလုံးသားနဲ့ ကြယ်မှုန်လေးတွေ ရောပြပါမည် */}
                  {i % 2 === 0 ? (
                    <HeartIcon className="w-5 h-5 text-rose-400" />
                  ) : (
                    <SparklesIcon className="w-6 h-6 text-pink-300" />
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
