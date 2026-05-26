"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import {
  HeartIcon,
  PlayIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

// Browser APIs for Fullscreen (Type Safety)
interface FullScreenDivElement extends HTMLDivElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface CustomWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

interface SurpriseRevealProps {
  videoUrl?: string | null;
  startDate?: Date | string | null;
  secretNote?: string | null;
}

export default function SurpriseReveal({
  videoUrl,
  startDate,
  secretNote,
}: SurpriseRevealProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);

  const [clock, setClock] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const containerRef = useRef<FullScreenDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const MESSAGE = `Happy Anniversary ပါနော်! ❤️\n\nကိုယ်တို့ အတူတူဖြတ်သန်းခဲ့တဲ့ အချိန်တွေ၊ အမှတ်တရတွေ အားလုံးအတွက် ကျေးဇူးတင်ပါတယ်။ ရှေ့ဆက်ပြီးတော့လည်း လက်တွဲမဖြုတ်ဘဲ အတူတူ ဆက်သွားကြမယ်နော်...`;

  useEffect(() => {
    const playClickSound = () => {
      try {
        const currentWindow = window as unknown as CustomWindow;
        const AudioContextClass =
          window.AudioContext || currentWindow.webkitAudioContext;
        if (!AudioContextClass) return;

        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (err) {
        console.log("Audio API issue:", err);
      }
    };

    let i = 0;
    const typingInterval: ReturnType<typeof setInterval> = setInterval(() => {
      if (i < MESSAGE.length) {
        setDisplayedText(MESSAGE.substring(0, i + 1));
        if (MESSAGE[i] !== " " && MESSAGE[i] !== "\n") playClickSound();
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
        triggerConfetti();
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    if (!startDate) return;
    const startMs = new Date(startDate).getTime();

    const timer: ReturnType<typeof setInterval> = setInterval(() => {
      const nowMs = new Date().getTime();
      const diff = nowMs - startMs;
      if (diff > 0) {
        setClock({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };
  const handlePlayClick = () => {
    setIsPlaying(true);
    const container = containerRef.current;
    if (container) {
      if (container.requestFullscreen) container.requestFullscreen();
      else if (container.webkitRequestFullscreen)
        container.webkitRequestFullscreen();
      else if (container.mozRequestFullScreen) container.mozRequestFullScreen();
      else if (container.msRequestFullscreen) container.msRequestFullscreen();
    }
    if (videoRef.current) videoRef.current.play();

    // 🌟 Drive/YouTube အတွက် Play နှိပ်ပြီး "စက္ကန့် ၃၀" အကြာမှ ခလုတ်ပေါ်လာစေရန် (30000 = 30 seconds)
    // အစ်ကို့ Video အတို/အရှည်ပေါ် မူတည်ပြီး ဒီအချိန်ကို ပြင်နိုင်ပါတယ် (ဥပမာ ၁ မိနစ်ဆိုရင် 60000 ပါ)
    setTimeout(() => {
      setShowDoneButton(true);
    }, 30000);
  };
  const getGoogleDriveEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1])
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return null;
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = url.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}?autoplay=${isPlaying ? 1 : 0}&rel=0`;
      }
    }
    return null;
  };

  const driveEmbedUrl = videoUrl ? getGoogleDriveEmbedUrl(videoUrl) : null;
  const youtubeEmbedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  const finalSecretNote =
    secretNote ||
    "P.S - နောက်ထပ် အမှတ်တရပေါင်းများစွာကိုလည်း အတူတူ ဆက်ပြီး ဖန်တီးသွားကြမယ်နော်... အရမ်းချစ်တယ် ❤️";

  return (
    // 🎨 Light Theme: Creamy White Background
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFDFB] p-6 selection:bg-pink-100">
      <div className="max-w-2xl text-center mb-8 min-h-[100px]">
        {/* 🎨 Text Color: Soft Charcoal for better readability */}
        <p className="text-xl md:text-2xl font-serif leading-relaxed whitespace-pre-line text-[#2D2D2D]">
          {displayedText}
          {!isTypingComplete && (
            <span className="animate-pulse text-pink-500">|</span>
          )}
        </p>
      </div>

      {isTypingComplete && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-pink-100 flex flex-col items-center justify-center bg-white aspect-video relative group">
          {videoUrl ? (
            <>
              {/* Play Button Overlay (Soft White Blur) */}
              {!isPlaying && (
                <div
                  onClick={handlePlayClick}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 cursor-pointer hover:bg-white/40 transition-all backdrop-blur-sm">
                  <div className="w-20 h-20 bg-pink-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <PlayIcon className="w-10 h-10 text-white ml-2" />
                  </div>
                  <p className="text-pink-600 mt-6 font-medium tracking-widest text-lg font-serif">
                    💌 Surprise ကို ဖွင့်ကြည့်ပါ
                  </p>
                </div>
              )}

              {/* Grand Finale (Post-Credit) - Glassmorphism Light Style */}
              {isVideoEnded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/90 p-8 backdrop-blur-xl text-center">
                  <p className="text-xl md:text-3xl font-serif italic leading-relaxed text-[#1A1A1A] mb-10 max-w-2xl">
                    {finalSecretNote}
                  </p>

                  {startDate && (
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-pink-700 font-mono text-base md:text-lg bg-pink-50 py-4 px-8 rounded-full border border-pink-100 shadow-sm">
                      ကိုယ်တို့ အတူရှိခဲ့တာ... <br className="md:hidden" />
                      <span className="font-bold text-pink-900 text-xl md:text-2xl mx-1">
                        {clock.days}
                      </span>{" "}
                      ရက်၊
                      <span className="font-bold text-pink-900 text-xl md:text-2xl mx-1">
                        {clock.hours}
                      </span>{" "}
                      နာရီ၊
                      <span className="font-bold text-pink-900 text-xl md:text-2xl mx-1">
                        {clock.minutes}
                      </span>{" "}
                      မိနစ်၊
                      <span className="font-bold text-pink-900 text-xl md:text-2xl mx-1">
                        {clock.seconds}
                      </span>{" "}
                      စက္ကန့် ⏱️
                    </motion.div>
                  )}

                  <button
                    onClick={() => setIsVideoEnded(false)}
                    className="mt-10 text-sm text-stone-400 hover:text-pink-600 underline tracking-widest transition-colors font-serif">
                    ဗီဒီယိုကို ပြန်ကြည့်မည်
                  </button>
                </motion.div>
              )}

              {/* 🌟 ချက်ချင်းမပေါ်တော့ဘဲ အချိန်ကိုက်မှ ပေါ်လာမည့် ခလုတ်အသစ် */}
              {isPlaying &&
                (youtubeEmbedUrl || driveEmbedUrl) &&
                showDoneButton &&
                !isVideoEnded && (
                  <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    onClick={() => setIsVideoEnded(true)}
                    className="absolute top-6 right-6 z-40 bg-pink-500/90 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full flex items-center gap-2 backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(236,72,153,0.3)] border border-pink-200">
                    <span className="text-sm font-medium font-serif tracking-wide">
                      ဗီဒီယို ကြည့်ပြီးရင် ဒီကိုနှိပ်ပါနော် 💌
                    </span>
                  </motion.button>
                )}
              {/* Players */}
              {youtubeEmbedUrl ? (
                <iframe
                  src={youtubeEmbedUrl}
                  className="w-full h-full object-cover border-none rounded-2xl"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen></iframe>
              ) : driveEmbedUrl ? (
                <iframe
                  src={driveEmbedUrl}
                  className="w-full h-full object-cover border-none rounded-2xl"
                  allow="autoplay; fullscreen"
                  allowFullScreen></iframe>
              ) : (
                <video
                  ref={videoRef}
                  controls={isPlaying}
                  playsInline
                  className="w-full h-full object-cover rounded-2xl"
                  src={videoUrl}
                  onEnded={() => setIsVideoEnded(true)}
                />
              )}
            </>
          ) : (
            <div className="text-center p-8">
              <HeartIcon className="w-16 h-16 text-pink-200 mx-auto mb-4 animate-pulse" />
              <p className="text-stone-300 text-lg">
                Surprise Video တင်ထားခြင်း မရှိသေးပါ။
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
