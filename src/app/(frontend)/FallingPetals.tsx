"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  rotateDuration: number;
}

export default function FallingPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // 🌟 မျက်နှာပြင် အကျယ်ကို ကြည့်၍ ဖုန်းလား၊ ကွန်ပျူတာလား စစ်ဆေးပါမည်
    const isMobile = window.innerWidth < 768;

    // ဖုန်းဆိုလျှင် ၁၂ ပွင့်၊ ကွန်ပျူတာဆိုလျှင် ၃၅ ပွင့် (လိုသလို ပြင်နိုင်ပါသည်)
    const petalCount = isMobile ? 12 : 35;

    const newPetals = Array.from({ length: petalCount }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,

      // 🌟 ဖုန်းဆိုလျှင် ပွင့်ဖတ်အရွယ်အစားကိုပါ အနည်းငယ် သေးပေးထားပါမည်
      size: Math.random() * (isMobile ? 0.4 : 0.7) + (isMobile ? 0.3 : 0.4),

      duration: Math.random() * 12 + 10,
      delay: Math.random() * -20,
      rotateDuration: Math.random() * 4 + 3,
    }));

    setPetals(newPetals);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: "-10vh", x: 0 }}
          animate={{
            y: ["-10vh", "110vh"],
            x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
            rotateZ: [0, 180, 360],
            rotateX: [0, 180, 360],
          }}
          transition={{
            y: {
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            },
            x: {
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            },
            rotateZ: {
              duration: p.rotateDuration,
              repeat: Infinity,
              ease: "linear",
            },
            rotateX: {
              duration: p.rotateDuration * 1.5,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            width: "16px",
            height: "24px",
            background: "linear-gradient(to bottom, #fda4af, #ffe4e6)",
            borderRadius: "60% 40% 40% 60% / 60% 60% 40% 40%",
            opacity: 0.65,
            transform: `scale(${p.size})`,
            boxShadow: "0 0 15px rgba(254, 205, 211, 0.4)",
          }}
        />
      ))}
    </div>
  );
}
