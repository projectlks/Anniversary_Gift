import React from "react";

export default function Seal() {
  return (
    <div className="relative">
      {/* ဖုန်းတွင် w-[90px] သို့ ကျုံ့ထားပါသည် */}
      <div className="w-[90px] sm:w-[110px] md:w-[130px] aspect-square rounded-full bg-gradient-to-br from-rose-500 via-rose-700 to-rose-950 border-[3px] md:border-4 border-rose-950 shadow-[0_10px_25px_rgba(159,18,57,0.5)]">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-300/30 via-transparent to-black/50 mix-blend-overlay" />

        <div className="absolute inset-2 sm:inset-3 flex items-center justify-center rounded-full border-[1.5px] sm:border-2 border-rose-900/40 bg-gradient-to-br from-rose-400/20 to-rose-950/40 shadow-inner">
          <div className="text-center">
            {/* Heart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-0.5 sm:mb-1 h-5 w-5 sm:h-7 sm:w-7 md:h-9 md:w-9 fill-current text-rose-100 drop-shadow-md"
              viewBox="0 0 24 24">
              <path d="M12.1 8.64l-.1.1-.11-.1C10.14 6.83 7.3 7.03 5.6 8.93c-1.53 1.73-1.44 4.34.2 5.93l5.92 5.55c.27.25.7.25.97 0l5.91-5.54c1.65-1.6 1.74-4.21.2-5.94-1.7-1.9-4.54-2.1-6.7-.29z" />
            </svg>

            {/* Embossed Text */}
            <div className="text-[8px] sm:text-[10px] md:text-xs font-bold tracking-widest text-rose-100 drop-shadow-md">
              LOVE
            </div>
            <div className="mt-0.5 text-[5px] sm:text-[7px] md:text-[8px] font-medium tracking-[0.2em] text-rose-200/80">
              FOREVER
            </div>
          </div>
        </div>

        {/* Wax drips */}
        <div className="absolute -bottom-1 left-1/2 h-2.5 w-3.5 sm:h-3 sm:w-4 -translate-x-1/2 transform rounded-b-full bg-gradient-to-b from-rose-800 to-rose-950" />
        <div className="absolute -bottom-0.5 left-1/3 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-rose-900" />
        <div className="absolute -bottom-0.5 right-1/3 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-rose-900" />

        {/* 3D highlight */}
        <div className="absolute left-2 top-1.5 sm:left-3 sm:top-2 h-4 w-4 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br from-white/30 to-transparent blur-[2px]" />
      </div>
    </div>
  );
}
