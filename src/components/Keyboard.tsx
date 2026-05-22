"use client";

import type React from "react";
import { JSX, useEffect } from "react";
import { Cormorant_Garamond } from "next/font/google";

// Premium Font for Numbers
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal"],
});

export default function RomanticNumberKeyboard({
  setNumber,
  number,
  onSubmit,
  maxLength = 6,
}: {
  setNumber: React.Dispatch<React.SetStateAction<string[]>>;
  number: string[];
  onSubmit?: () => void;
  maxLength?: number;
}) {
  // Keyboard မှ ဂဏန်းရိုက်ခြင်းကို လက်ခံရန်
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      if (/^\d$/.test(key) && number.length < maxLength) {
        setNumber((prev) => [...prev, key]);
      } else if (key === "Backspace") {
        setNumber((prev) => prev.slice(0, -1));
      } else if (key === "Enter") {
        onSubmit?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setNumber, number, onSubmit, maxLength]);

  const handleButtonClick = (
    value: string | { type: "delete" | "enter"; icon: JSX.Element },
  ) => {
    if (typeof value === "string") {
      if (number.length >= maxLength) return;
      setNumber((prev) => [...prev, value]);
    } else if (value.type === "delete") {
      setNumber((prev) => prev.slice(0, -1));
    } else if (value.type === "enter") {
      onSubmit?.();
    }
  };

  const numbers: (
    | string
    | { type: "delete"; icon: JSX.Element }
    | { type: "enter"; icon: JSX.Element }
  )[][] = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [
      {
        type: "delete",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 sm:h-7 sm:w-7">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9.75 14.25 12m0 0 2.25 2.25M14.25 12l2.25-2.25M14.25 12 12 14.25m-2.58 4.92-6.374-6.375a1.125 1.125 0 0 1 0-1.59L9.42 4.83c.21-.211.497-.33.795-.33H19.5a2.25 2.25 0 0 1 2.25 2.25v10.5a2.25 2.25 0 0 1-2.25 2.25h-9.284c-.298 0-.585-.119-.795-.33Z"
            />
          </svg>
        ),
      },
      "0",
      {
        type: "enter",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 sm:h-7 sm:w-7">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
        ),
      },
    ],
  ];

  const KeyButton = ({
    value,
  }: {
    value: string | { type: "delete" | "enter"; icon: JSX.Element };
  }) => {
    // Delete နှင့် Enter ခလုတ်များအတွက် အရောင်ခွဲခြားရန်
    const isActionKey = typeof value !== "string";

    return (
      <button
        onClick={() => handleButtonClick(value)}
        className={`group relative mx-auto flex aspect-[2/1] w-full items-center justify-center overflow-hidden rounded-xl border border-white/40 bg-white/30 text-2xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 ease-out sm:rounded-2xl sm:text-3xl
          hover:scale-105 hover:bg-white/60 hover:shadow-[0_8px_25px_rgba(225,29,72,0.1)]
          active:scale-95 active:bg-rose-100/50
          ${cormorant.className}
          ${isActionKey ? "text-rose-400" : "font-light text-stone-700 hover:text-rose-600"}
        `}>
        <span className="relative z-10 drop-shadow-sm transition-transform duration-200 group-active:scale-90">
          {typeof value === "string" ? value : value.icon}
        </span>

        {/* Subtle Shine Effect on Hover */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      </button>
    );
  };

  return (
    <div className="relative mx-auto w-full max-w-sm">
      {/* Key Grid */}
      <div className="relative z-10 grid grid-cols-3 gap-3 sm:gap-4">
        {numbers.flat().map((item, index) => (
          <KeyButton key={index} value={item} />
        ))}
      </div>

      {/* Elegant Footer Text */}
      <div className="mt-8 text-center">
        <p className="text-[9px] font-medium tracking-[0.2em] uppercase text-stone-400/80 sm:text-[10px]">
          Secured with Love
        </p>
      </div>
    </div>
  );
}
