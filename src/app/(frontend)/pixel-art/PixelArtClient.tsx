"use client";

import { useState, useEffect, useRef } from "react";
import Pusher from "pusher-js";
import { motion, AnimatePresence } from "framer-motion";
import { savePixelBoardAction, clearPixelArtAction } from "./action";
import { PaintBrushIcon, TrashIcon } from "@heroicons/react/24/outline";

const GRID_SIZE = 24;
const TOTAL_PIXELS = GRID_SIZE * GRID_SIZE;

const PALETTE = [
  "#ef4444",
  "#f43f5e",
  "#ec4899",
  "#d946ef",
  "#8b5cf6",
  "#3b82f6",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#171717",
  "#ffffff",
];

export default function PixelArtClient({
  coupleId,
  initialPixels,
}: {
  coupleId: string;
  initialPixels: string[];
}) {
  const [pixels, setPixels] = useState<string[]>(initialPixels);
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const hasChanges = useRef(false);
  const pixelsRef = useRef(pixels);

  useEffect(() => {
    pixelsRef.current = pixels;
  }, [pixels]);

  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });
    const channel = pusherClient.subscribe(`pixel-art-${coupleId}`);

    channel.bind("board-updated", (data: { pixels: string[] }) => {
      setPixels(data.pixels);
    });

    channel.bind("board-cleared", () => {
      setPixels(Array(TOTAL_PIXELS).fill("#ffffff"));
    });

    return () => pusherClient.unsubscribe(`pixel-art-${coupleId}`);
  }, [coupleId]);

  const colorPixelLocal = (index: number) => {
    if (pixelsRef.current[index] === selectedColor) return;
    hasChanges.current = true;

    setPixels((prev) => {
      const newPixels = [...prev];
      newPixels[index] = selectedColor;
      return newPixels;
    });
  };

  const handleStopDrawing = async () => {
    setIsDrawing(false);
    if (hasChanges.current) {
      hasChanges.current = false;
      await savePixelBoardAction(coupleId, pixelsRef.current);
    }
  };

  const handleClear = async () => {
    setPixels(Array(TOTAL_PIXELS).fill("#ffffff"));
    await clearPixelArtAction(coupleId);
    setShowClearConfirm(false);
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-2 sm:p-4 select-none touch-none"
      onPointerUp={handleStopDrawing}
      onPointerLeave={handleStopDrawing}>
      {/* Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center">
              <h3 className="text-lg font-bold mb-2">
                ပန်းချီကားကို ဖျက်မှာလား?
              </h3>
              <p className="text-gray-500 mb-6 text-sm">
                ဒီပန်းချီကားကို ဖျက်လိုက်ရင် ပြန်ယူလို့မရတော့ဘူးနော်။
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
                  မဖျက်တော့ဘူး
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition">
                  သေချာပါတယ်
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {PALETTE.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full shadow-inner border-2 transition-transform ${
                selectedColor === color
                  ? "scale-125 border-gray-400"
                  : "border-transparent hover:scale-110"
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <button
          onClick={() => setShowClearConfirm(true)}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-medium px-4 py-2 bg-red-50 rounded-xl transition">
          <TrashIcon className="w-4 h-4" /> Clear Canvas
        </button>
      </div>

      <div className="bg-white p-4  shadow-xl border border-pink-100 touch-none w-full">
        <div
          className="grid gap-[1px] bg-gray-300 border border-gray-300 w-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          }}>
          {pixels.map((color, idx) => (
            <div
              key={idx}
              className="w-full aspect-square transition-colors duration-75 cursor-pointer"
              style={{ backgroundColor: color }}
              onPointerDown={(e) => {
                e.preventDefault();
                setIsDrawing(true);
                colorPixelLocal(idx);
              }}
              onPointerEnter={(e) => {
                e.preventDefault();
                if (isDrawing) colorPixelLocal(idx);
              }}
              onTouchMove={(e) => {
                const touch = e.touches[0];
                const element = document.elementFromPoint(
                  touch.clientX,
                  touch.clientY,
                );
                if (element && element.hasAttribute("data-idx")) {
                  const targetIdx = Number(element.getAttribute("data-idx"));
                  if (isDrawing) colorPixelLocal(targetIdx);
                }
              }}
              data-idx={idx}
            />
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-sm font-medium text-gray-400 flex items-center gap-2">
        <PaintBrushIcon className="w-4 h-4" /> Draw together (Auto-saves on
        release)
      </p>
    </div>
  );
}
