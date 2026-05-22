"use client";

import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import ReactPlayer from "react-player";
import {
  PauseIcon,
  PlayIcon,
  ForwardIcon,
  BackwardIcon,
  QueueListIcon,
  PlusIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { addMusicTrack, getYouTubeTitle, uploadMusicFile } from "@/libs/action";

type CoupleImage = {
  src: string;
  alt: string;
};

type Track = {
  id: string;
  name: string;
  url: string;
};

const SAMPLE_TRACK: Track = {
  id: "sample-1",
  name: "Ed Sheeran - Perfect (Sample)",
  url: "https://www.youtube.com/watch?v=2Vv-BfVoq4g",
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

const getRotation = (index: number) => {
  const rotations = [
    "-rotate-2",
    "rotate-3",
    "-rotate-1",
    "rotate-2",
    "-rotate-3",
    "rotate-1",
    "rotate-4",
    "-rotate-4",
  ];
  return rotations[index % rotations.length];
};

// 🌟 ပုံများကို အရွယ်အစား အမျိုးမျိုး ဖြစ်စေရန် Width များကို အလှည့်ကျ ထုတ်ပေးမည့် Function
const getCardWidth = (index: number) => {
  const widths = [
    "w-[260px] sm:w-[300px] lg:w-[340px]", // Size 1 (Medium)
    "w-[280px] sm:w-[320px] lg:w-[380px]", // Size 2 (Large)
    "w-[240px] sm:w-[280px] lg:w-[320px]", // Size 3 (Small)
    "w-[300px] sm:w-[340px] lg:w-[400px]", // Size 4 (Extra Large)
    "w-[270px] sm:w-[310px] lg:w-[360px]", // Size 5 (Regular)
  ];
  return widths[index % widths.length];
};

export default function MusicRoom({
  coupleId,
  images,
  initialTracks,
}: {
  coupleId: string;
  images: CoupleImage[];
  initialTracks: Track[];
}) {
  const playerRef = useRef<HTMLVideoElement>(null);

  const [playlist, setPlaylist] = useState<Track[]>(
    initialTracks.length > 0 ? initialTracks : [SAMPLE_TRACK],
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [isUploadingMusic, setIsUploadingMusic] = useState(false);

  const currentTrack = playlist[currentIndex];

  const safelyPlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    const playRequest = player.play();
    if (playRequest) {
      void playRequest.catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        console.error("Playback failed", error);
        setIsPlaying(false);
      });
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      safelyPlay();
      return;
    }

    playerRef.current?.pause();
  }, [currentTrack?.url, isPlaying, safelyPlay]);

  const resetPlaybackProgress = () => {
    setCurrentTime(0);
    setDuration(0);
  };

  const handleNext = () => {
    resetPlaybackProgress();

    if (currentIndex < playlist.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    resetPlaybackProgress();

    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(playlist.length - 1);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);

    if (playerRef.current) {
      playerRef.current.currentTime = newTime;
    }
  };

  const handleAddYouTube = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const trackUrl = newUrl.trim();
    // 🌟 Playlist ထဲမှာ ဒီ Link ရှိပြီးသားလားဆိုတာကို UI မှာပါ ကြိုစစ်ပါမည်
    const isDuplicate = playlist.some((track) => track.url === trackUrl);
    
    if (isDuplicate) {
      alert("This song is already in your playlist! (ဒီသီချင်းက Playlist ထဲမှာ ရှိပြီးသားပါ)");
      setNewUrl(""); // Input box ကို ပြန်ရှင်းပေးမည်
      return; // အောက်က Code များကို ဆက်မ Run တော့ဘဲ ရပ်လိုက်မည်
    }

    setNewUrl("");

    const realTitle = await getYouTubeTitle(trackUrl);
    const trackName = realTitle || `YouTube Track ${playlist.length + 1}`;

    const newTrack: Track = {
      id: `yt-${Date.now()}`,
      name: trackName,
      url: trackUrl,
    };

    setPlaylist((prev) => [...prev, newTrack]);

    if (!isPlaying && playlist.length === 0) {
      setCurrentIndex(0);
      setIsPlaying(true);
    }

    try {
      await addMusicTrack(trackName, trackUrl, coupleId);
    } catch (error) {
      console.error("Failed to save track to DB", error);
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = Array.from(input.files || []);
    input.value = "";

    if (files.length === 0) return;

    const audioFiles = files.filter(
      (file) =>
        file.type.startsWith("audio/") ||
        /\.(aac|flac|m4a|mp3|oga|ogg|wav|webm)$/i.test(file.name),
    );
    if (audioFiles.length === 0) return;

    setIsUploadingMusic(true);

    try {
      const uploadedTracks: Track[] = [];

      for (const file of audioFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const savedTrack = await uploadMusicFile(formData, coupleId);
        uploadedTracks.push(savedTrack);
      }

      if (uploadedTracks.length === 0) return;

      setPlaylist((prev) => [...prev, ...uploadedTracks]);

      if (!isPlaying && playlist.length === 0) {
        setCurrentIndex(0);
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Failed to upload local music", error);
      alert(error instanceof Error ? error.message : "Failed to upload music.");
    } finally {
      setIsUploadingMusic(false);
    }
  };

  // const playSpecificTrack = (index: number) => {
  //   resetPlaybackProgress();
  //   setCurrentIndex(index);
  //   setIsPlaying(true);
  // };

  const playSpecificTrack = (index: number) => {
    // 🌟 (၁) လက်ရှိဖွင့်နေတဲ့ သီချင်းကိုပဲ ထပ်နှိပ်မိရင်
    if (index === currentIndex) {
      if (!isPlaying) setIsPlaying(true); // Pause ဖြစ်နေခဲ့ရင် ပြန်ဖွင့်ပေးမည်
      return; // အောက်က Code တွေကို ဆက်မ Run တော့ဘဲ ရပ်လိုက်မည် (UI လုံးဝ မကြောင်တော့ပါ)
    }

    // 🌟 (၂) တခြားသီချင်း အသစ်ကို ပြောင်းနှိပ်မှသာ အောက်ကအတိုင်း အလုပ်လုပ်ပါမည်
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  return (
    <main
      className="min-h-screen font-sans text-stone-900 selection:bg-stone-200 relative pb-40 md:pb-48 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/wall.jpg')" }}>
      {currentTrack && (
        <div className="pointer-events-none fixed -left-2499.75 top-0 h-px w-px overflow-hidden opacity-0">
          {/* 🌟 100% Type-Safe ဖြစ်သွားသော Player Component */}
          <ReactPlayer
            ref={playerRef}
            src={currentTrack.url}
            controls={false}
            width={1}
            height={1}
            preload="metadata"
            onReady={() => {
              if (isPlaying) safelyPlay();
            }}
            onLoadedMetadata={(event) => {
              setDuration(event.currentTarget.duration || 0);
            }}
            onDurationChange={(event) => {
              setDuration(event.currentTarget.duration || 0);
            }}
            onTimeUpdate={(event) => {
              if (isPlaying) {
                setCurrentTime(event.currentTarget.currentTime);
              }
            }}
            onEnded={handleNext}
          />
        </div>
      )}

      <div className="max-w-400 mx-auto px-6 pt-16 md:pt-24 flex flex-col items-center">
        <header className="text-center w-full max-w-2xl mb-20 md:mb-28">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font tracking-tight text-stone-950">
            Our Shared Melody
          </h1>
          <p className="mt-5 text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto">
            Every picture holds a feeling. Listen to our song while reminiscing
            these beautiful moments.
          </p>
        </header>

        <section className="w-full flex flex-wrap justify-center items-start gap-x-6 gap-y-12 sm:gap-x-10 sm:gap-y-16 md:gap-x-14 md:gap-y-20">
          {images.map((image, index) => (
            <div
              key={index}
              // className={`relative flex-none w-75 sm:w-[320px] lg:w-90 xl:w-100 bg-white p-2.5 pb-10 sm:p-3 sm:pb-12 md:p-4 md:pb-16 shadow-md z-10 ${getRotation(
              //   index,
              // )}`}>

              className={`relative flex-none bg-white p-2.5 pb-10 sm:p-3 sm:pb-12 md:p-4 md:pb-16 shadow-md z-10 ${getRotation(
                index,
              )} ${getCardWidth(index)}`}>
              <div
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 sm:w-20 md:w-24 lg:w-28 h-4.5 sm:h-5 xl:h-8 bg-stone-200/70 backdrop-blur-sm border border-stone-300/80 shadow-[0_2px_4px_rgba(0,0,0,0.05)] z-20"
                style={{
                  transform: `translateX(-50%) rotate(${
                    index % 2 === 0 ? -2 : 2
                  }deg)`,
                }}
              />
              <div className="relative w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={0}
                  height={0}
                  loading={index < 6 ? "eager" : "lazy"}
                  preload={index === 0}
                  unoptimized
                  sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, (max-width: 1024px) 360px, 400px"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}

          {!images.length && (
            <div className="w-full text-center py-24 text-stone-400 font-serif italic font-light">
              Upload your photos to display here.
            </div>
          )}
        </section>
      </div>

      <div className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-110 z-[999]">
        {isPlaylistOpen && (
          <div className="mb-4 bg-white/95 backdrop-blur-2xl border border-stone-200 shadow-2xl rounded-4xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900">Your Playlist</h3>
              <button
                onClick={() => setIsPlaylistOpen(false)}
                className="text-stone-400 hover:text-stone-700">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <form onSubmit={handleAddYouTube} className="flex-1 flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="Paste YouTube Link..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-stone-900 outline-none w-full"
                />
                <button
                  type="submit"
                  className="bg-stone-900 text-white rounded-xl px-4 py-2.5 hover:bg-stone-800 transition active:scale-95 shrink-0">
                  <PlusIcon className="h-5 w-5" />
                </button>
              </form>

              <label
                className={`shrink-0 rounded-xl px-4 py-2.5 text-stone-700 transition active:scale-95 flex items-center justify-center ${
                  isUploadingMusic
                    ? "cursor-not-allowed bg-stone-200/40 opacity-60"
                    : "cursor-pointer bg-stone-200/60 hover:bg-stone-200"
                }`}>
                <ArrowUpTrayIcon className={`h-5 w-5 ${isUploadingMusic ? "animate-pulse" : ""}`} />
                <input
                  type="file"
                  multiple
                  accept="audio/*"
                  className="sr-only"
                  disabled={isUploadingMusic}
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <div className="max-h-[30vh] overflow-y-auto pr-2 space-y-1">
              {playlist.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-4">
                  No tracks added yet.
                </p>
              ) : (
                playlist.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => playSpecificTrack(index)}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl transition ${
                      currentIndex === index
                        ? "bg-stone-900 text-white font-medium"
                        : "hover:bg-stone-100 text-stone-700"
                    }`}>
                    <span className="truncate text-sm pr-4">{track.name}</span>
                    {currentIndex === index && isPlaying && (
                      <div className="flex gap-0.5 h-3 shrink-0">
                        <div className="w-1 bg-white animate-pulse" />
                        <div className="w-1 bg-white animate-pulse delay-75" />
                        <div className="w-1 bg-white animate-pulse delay-150" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-2xl border z- border-stone-200/50 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.12)] rounded-[2.5rem] p-4 sm:p-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={handlePrev}
                className="p-2 text-stone-600 hover:text-stone-900 transition active:scale-90">
                <BackwardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying((playing) => !playing)}
                disabled={playlist.length === 0}
                className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-stone-950 text-white transition hover:bg-stone-800 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed">
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6 sm:h-7 sm:w-7" />
                ) : (
                  <PlayIcon className="h-6 w-6 sm:h-7 sm:w-7 pl-1" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 text-stone-600 hover:text-stone-900 transition active:scale-90">
                <ForwardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className="text-sm sm:text-base font-medium text-stone-900 truncate">
                  {currentTrack?.name || "No track"}
                </p>

                <button
                  onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                  className={`shrink-0 transition active:scale-90 p-1 rounded-full ${
                    isPlaylistOpen
                      ? "text-stone-900 bg-stone-200"
                      : "text-stone-400 hover:text-stone-700"
                  }`}>
                  <QueueListIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium text-stone-400 tabular-nums">
                  {formatTime(currentTime)}
                </span>

                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step="any"
                  value={currentTime || 0}
                  onChange={handleSeek}
                  disabled={!currentTrack}
                  className="h-1.5 w-full cursor-pointer rounded-full bg-stone-200 accent-stone-900 disabled:opacity-50"
                />

                <span className="text-[10px] font-medium text-stone-400 tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
