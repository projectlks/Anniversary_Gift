"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// 🌟 ၁။ အရန် (Default) ပုံများ ထည့်ထားပါမည်
// မှတ်ချက် - ဒီနေရာမှာ အစ်ကို့ Project ရဲ့ public folder ထဲက ယာယီပုံလင့်ခ်တွေ ထည့်လို့ရပါတယ်။
// (အခုတော့ ချက်ချင်းစမ်းလို့ရအောင် အင်တာနက်ပေါ်က Romantic ပုံလေးတွေရဲ့ Link တွေ ထည့်ပေးထားပါတယ်)
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80", // 1
  "https://images.unsplash.com/photo-1522262590532-a991489a0253?w=400&q=80", // 2
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80", // 3
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400&q=80", // 4
  "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80", // 5
  "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=400&q=80", // 6
  "https://images.unsplash.com/photo-1501901609772-df0848060b33?w=400&q=80", // 7
  "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=400&q=80", // 8
  "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?w=400&q=80", // 9
  "https://images.unsplash.com/photo-1484069560501-87d72b0c3669?w=400&q=80", // 10
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80", // 11
  "https://images.unsplash.com/photo-1473280025148-643f9b0cbac2?w=400&q=80", // 12
  "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&q=80", // 13
  "https://images.unsplash.com/photo-1510525009512-ad7fc13eefab?w=400&q=80", // 14
  "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=80", // 15
];

const LEVEL_CONFIG = {
  1: { pairs: 4, time: 30, title: "Level 1 (Novice)" },
  2: { pairs: 6, time: 45, title: "Level 2 (Easy)" },
  3: { pairs: 8, time: 60, title: "Level 3 (Medium)" },
  4: { pairs: 10, time: 75, title: "Level 4 (Hard)" },
  5: { pairs: 12, time: 90, title: "Level 5 (Expert)" },
  6: { pairs: 15, time: 110, title: "Level 6 (Master)" },
};

type GameState = "menu" | "playing" | "won" | "lost";

export default function MemoryGameClient({ dbImages }: { dbImages: string[] }) {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [cards, setCards] = useState<string[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [moves, setMoves] = useState(0);
   
const startGame = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const config = LEVEL_CONFIG[level];

  // 🌟 ၁။ Database ထဲက ပုံတွေကို အရင်ဆုံး ယူပါမည်
  let uniqueImages: string[] = [];
  if (dbImages && dbImages.length > 0) {
    uniqueImages = [...dbImages];
  }

  // 🌟 ၂။ လိုအပ်တဲ့ စုံတွဲအရေအတွက် (config.pairs) မပြည့်သေးရင် DEFAULT_IMAGES ထဲကနေ ဆွဲယူပေါင်းထည့်ပါမည်
  if (uniqueImages.length < config.pairs) {
    const neededCount = config.pairs - uniqueImages.length;
    const extraImages = DEFAULT_IMAGES.slice(0, neededCount); // လိုအပ်တဲ့ အရေအတွက်ကိုပဲ ယူမည်
    uniqueImages = [...uniqueImages, ...extraImages]; // DB ပုံများနှင့် အရန်ပုံများကို ပေါင်းစပ်မည်
  }

  // လိုအပ်တဲ့ ပုံအရေအတွက် အတိအကျကိုသာ ဖြတ်ယူပါမည် (ဥပမာ - ၁၅ စုံဆို ၁၅ ပုံ)
  const selectedImages = uniqueImages.slice(0, config.pairs);

  // ပုံစုံတွဲဖန်တီးပြီး ကျပန်းမွှေခြင်း (Shuffle)
  const deck = [...selectedImages, ...selectedImages].sort(
    () => Math.random() - 0.5,
  );

  setCards(deck);
  setCurrentLevel(level);
  setTimeLeft(config.time);
  setFlippedIndices([]);
  setMatchedIndices([]);
  setMoves(0);
  setGameState("playing");
};
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === "playing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("lost");
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleCardClick = (index: number) => {
    if (
      gameState !== "playing" ||
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      matchedIndices.includes(index)
    ) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;

      if (cards[firstIndex] === cards[secondIndex]) {
        const newMatched = [...matchedIndices, firstIndex, secondIndex];
        setMatchedIndices(newMatched);
        setFlippedIndices([]);

        if (newMatched.length === cards.length) {
          setGameState("won");
        }
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  // ================= UI ပိုင်း =================
  if (gameState === "menu") {
    // Menu UI ... (ယခင်ကုဒ်အတိုင်း ထားပါ)
    return (
      <div className="flex flex-col items-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white/70 p-8 shadow-xl backdrop-blur-xl border border-white">
          <h1 className="mb-2 text-3xl font-bold text-rose-500">
            Memory Match
          </h1>
          <p className="mb-8 text-sm text-stone-500">
            Find the matching pairs!
          </p>

          <div className="flex w-full flex-col gap-4">
            {(
              Object.keys(LEVEL_CONFIG) as unknown as (1 | 2 | 3 | 4 | 5 | 6)[]
            ).map((level) => (
              <button
                key={level}
                onClick={() => startGame(level)}
                className="rounded-xl bg-white px-4 py-3 font-medium text-rose-600 shadow-sm transition active:scale-95 hover:bg-rose-50 border border-rose-100">
                {LEVEL_CONFIG[level].title}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (gameState === "won" || gameState === "lost") {
    // Game Over UI ... (ယခင်ကုဒ်အတိုင်း ထားပါ)
    const isWon = gameState === "won";
    return (
      <div className="flex flex-col items-center p-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-xl border border-white text-center">
          <h1
            className={`mb-2 text-4xl font-bold ${isWon ? "text-emerald-500" : "text-red-500"}`}>
            {isWon ? "You Won! 🎉" : "Time's Up! 😢"}
          </h1>
          <div className="mb-8 mt-4 flex flex-col gap-2 text-stone-600">
            <p>Level: {currentLevel}</p>
            <p>
              Moves:{" "}
              <span className="font-semibold text-rose-500">{moves}</span>
            </p>
            {isWon && (
              <p>
                Time Left:{" "}
                <span className="font-semibold text-rose-500">{timeLeft}s</span>
              </p>
            )}
          </div>
          <button
            onClick={() => setGameState("menu")}
            className="w-full rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white shadow-lg transition active:scale-95 hover:bg-rose-600">
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        {/* Header (Level, Time, Moves) */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white/80 p-4 shadow-sm backdrop-blur-md border border-white">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-400">
              Level
            </p>
            <p className="text-lg sm:text-xl font-bold text-rose-500">
              {currentLevel}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-400">
              Time
            </p>
            <p
              className={`text-xl sm:text-2xl font-bold ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-stone-700"}`}>
              {timeLeft}s
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-400">
              Moves
            </p>
            <p className="text-lg sm:text-xl font-bold text-rose-500">
              {moves}
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div
          className={`grid gap-2 sm:gap-3 ${
            cards.length > 20 ? "grid-cols-5 sm:grid-cols-6" : "grid-cols-3 sm:grid-cols-4"
          }`}>
          {cards.map((imgSrc, index) => {
            const isFlipped =
              flippedIndices.includes(index) || matchedIndices.includes(index);
            const isMatched = matchedIndices.includes(index);

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className="relative aspect-square cursor-pointer"
                style={{ perspective: 1000 }}>
                <motion.div
                  className="relative h-full w-full rounded-xl sm:rounded-2xl shadow-sm"
                  style={{ transformStyle: "preserve-3d" }}
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}>
                  {/* Card Front (မှောက်ထားချိန်) */}
                  <div
                    className="absolute inset-0 flex h-full w-full items-center justify-center rounded-xl sm:rounded-2xl bg-rose-200/80 border-2 border-white/50 backdrop-blur-sm"
                    style={{ backfaceVisibility: "hidden" }}>
                    <span className="text-3xl sm:text-4xl text-white font-bold drop-shadow-md">
                      ?
                    </span>
                  </div>

                  {/* Card Back (လှန်လိုက်ချိန်) */}
                  <div
                    className={`absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl border-2 border-white shadow-md ${
                      isMatched ? "opacity-60 ring-2 ring-emerald-400" : ""
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt="memory card"
                      className="h-full w-full object-cover pointer-events-none"
                    />
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setGameState("menu")}
          className="mt-8 w-full rounded-xl py-3 font-medium text-stone-400 transition hover:text-stone-600">
          Quit to Menu
        </button>
      </div>
    </div>
  );
}
