'use client';

import React, { useEffect, useState } from 'react';
import { Albert_Sans } from 'next/font/google';
import { getTotalCounts, incrementLoveClick } from '@/libs/action';

const albertSans = Albert_Sans({ subsets: ['latin'], weight: ['300', '600'] });

export default function ClickCount() {
  const [count, setCount] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    async function fetchCount() {
      const total = await getTotalCounts();
      setCount(total);
    }
    fetchCount();
  }, []);

  const handleClick = async () => {
    setIsBouncing(true); // trigger animation
    setTimeout(() => setIsBouncing(false), 500); // remove it after 0.5s

    setCount(prev => prev + 1);
    await incrementLoveClick();
  };

  return (
    <div className="flex flex-col items-center justify-center relative overflow-hidden p-4 sm:p-6">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 via-pink-200/20 to-white/10 rounded-xl blur-3xl opacity-40 -z-10" />

      {/* Floating Hearts */}
      <div className="absolute w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute text-pink-300 text-2xl left-5 top-10 float">♡</div>
        <div className="absolute select-none text-pink-200 text-xl right-5 top-20 float2">❤</div>
        <div className="absolute text-rose-300 text-3xl left-1 bottom-10 float3">💖</div>
      </div>

      {/* SVG Clip Path */}
      <svg viewBox="0 0 32 29.6" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.9 C0.2,0.7,0,0.4,0.1,0.2 C0.2,0,0.4,0,0.5,0.2 C0.6,0,0.8,0,0.9,0.2 C1,0.4,0.8,0.7,0.5,0.9Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Heart Button */}
      <div
        onClick={handleClick}
        className={`aspect-[1/1] h-[100px] cursor-pointer flex items-center justify-center p-4 sm:p-6
          bg-gradient-to-br from-rose-400 via-pink-500 to-pink-800 text-white shadow-2xl
          border border-white/30 hover:shadow-pink-500/50 hover:scale-105 duration-500
          backdrop-blur-md relative z-10 transition-all
          ${isBouncing ? 'animate-bounce' : ''}`}
        style={{ clipPath: 'url(#heartClip)' }}
      >
        ❤️
      </div>

      {/* Count */}
      <div className={`text-3xl z-50 mt-2 font-bold text-rose-600 drop-shadow-sm ${albertSans.className}`}>
        ❤️ {count.toLocaleString()} ❤️
      </div>

      {/* Label */}
      <h1 className="text-center mt-3 text-pink-600 text-lg italic font-light">
        Click the heart to count your love!
      </h1>
    </div>
  );
}
