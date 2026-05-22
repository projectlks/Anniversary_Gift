import React from "react";

export default function Seal() {
  // Name changed to Seal for clarity, you can keep Steal if it's imported that way elsewhere
  return (
    <div className="relative">
      {/* Main wax seal (Royal Blue Theme) */}
      <div className="w-[120px] aspect-square rounded-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 border-4 border-indigo-950 shadow-lg">
        {/* Wax texture overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 via-transparent to-black/40 mix-blend-overlay" />

        {/* Inner embossed area */}
        <div className="absolute inset-3 flex items-center justify-center rounded-full border-2 border-blue-900/40 bg-gradient-to-br from-blue-500/20 to-indigo-900/30 shadow-inner">
          <div className="text-center">
            {/* Heart Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-1 h-8 w-8 fill-current text-blue-100 drop-shadow-md"
              viewBox="0 0 24 24">
              <path d="M12.1 8.64l-.1.1-.11-.1C10.14 6.83 7.3 7.03 5.6 8.93c-1.53 1.73-1.44 4.34.2 5.93l5.92 5.55c.27.25.7.25.97 0l5.91-5.54c1.65-1.6 1.74-4.21.2-5.94-1.7-1.9-4.54-2.1-6.7-.29z" />
            </svg>

            {/* Embossed Text */}
            <div className="text-xs font-bold tracking-widest text-blue-100 drop-shadow-md">
              LOVE
            </div>
            <div className="mt-0.5 text-[8px] font-medium tracking-[0.2em] text-blue-200/80">
              FOREVER
            </div>
          </div>
        </div>

        {/* Wax drips */}
        <div className="absolute -bottom-1 left-1/2 h-3 w-4 -translate-x-1/2 transform rounded-b-full bg-gradient-to-b from-indigo-800 to-indigo-950" />
        <div className="absolute -bottom-0.5 left-1/3 h-2 w-2 rounded-full bg-indigo-900" />
        <div className="absolute -bottom-0.5 right-1/3 h-1.5 w-1.5 rounded-full bg-indigo-900" />

        {/* 3D highlight (Reflection) */}
        <div className="absolute left-3 top-2 h-6 w-6 rounded-full bg-gradient-to-br from-white/30 to-transparent blur-[2px]" />
      </div>
    </div>
  );
}