"use client";

import {
  type MutableRefObject,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

interface DragCardsProps {
  images: { src: string }[];
}

interface CardLayout {
  top: string;
  left: string;
  rotate: string;
}

interface CardProps extends CardLayout {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  src: string;
  alt: string;
}

interface CardSize {
  width: number;
  maxHeight: number;
}

const CARD_LAYOUTS: CardLayout[] = [
  { top: "22%", left: "19%", rotate: "-10deg" },
  { top: "28%", left: "45%", rotate: "7deg" },
  { top: "21%", left: "73%", rotate: "-6deg" },
  { top: "51%", left: "27%", rotate: "9deg" },
  { top: "53%", left: "57%", rotate: "-12deg" },
  { top: "67%", left: "80%", rotate: "8deg" },
  { top: "76%", left: "39%", rotate: "-5deg" },
  { top: "73%", left: "64%", rotate: "11deg" },
];

const FALLBACK_CARD_SIZE: CardSize = {
  width: 260,
  maxHeight: 420,
};

const clampNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getCardLayout = (index: number) => CARD_LAYOUTS[index % CARD_LAYOUTS.length];
const getResponsiveCardSize = (
  ratio: number,
  container: HTMLDivElement | null,
): CardSize => {
  if (typeof window === "undefined") {
    return FALLBACK_CARD_SIZE;
  }

  const rect = container?.getBoundingClientRect();
  const viewportWidth = rect?.width || window.innerWidth;
  const viewportHeight = rect?.height || window.innerHeight;
  const safeRatio = clampNumber(Number.isFinite(ratio) ? ratio : 1, 0.5, 2.35);
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  // ၁။ အမြင့် (Height) အတွက်
  const targetHeight = clampNumber(
    viewportHeight * (isMobile ? 0.3 : isTablet ? 0.3 : 0.32), // 🌟 0.26 မှ 0.32 သို့ တိုးထားသည်
    isMobile ? 190 : isTablet ? 220 : 250, // 🌟 210 မှ 250 သို့ တိုးထားသည်
    isMobile ? 310 : isTablet ? 330 : 400, // 🌟 330 မှ 400 သို့ တိုးထားသည်
  );

  // ၂။ အသေးဆုံး Width အတွက်
  const minWidth = clampNumber(
    viewportWidth * (isMobile ? 0.42 : isTablet ? 0.2 : 0.15), // 🌟 0.10 မှ 0.15 သို့
    isMobile ? 140 : isTablet ? 160 : 180, // 🌟 150 မှ 180 သို့
    isMobile ? 210 : isTablet ? 220 : 250, // 🌟 210 မှ 250 သို့
  );

  // ၃။ အကြီးဆုံး Width အတွက်
  const maxWidth = clampNumber(
    viewportWidth * (isMobile ? 0.68 : isTablet ? 0.35 : 0.25), // 🌟 0.18 မှ 0.25 သို့
    isMobile ? 220 : isTablet ? 260 : 320, // 🌟 260 မှ 320 သို့
    isMobile ? 290 : isTablet ? 330 : 420, // 🌟 360 မှ 420 သို့ တိုးထားသည်
  );
  const width = clampNumber(targetHeight * safeRatio, minWidth, maxWidth);

  // 🌟 [Update] အမြင့်ဆုံး Limit ကိုလည်း အချိုးကျ လိုက်လျှော့ထားပါသည်
  const maxHeight = clampNumber(
    viewportHeight * (isMobile ? 0.45 : 0.55),
    isMobile ? 260 : 360,
    isMobile ? 450 : 600,
  );

  return {
    width: Math.round(width),
    maxHeight: Math.round(maxHeight),
  };
};;

export const DragCards = ({ images }: DragCardsProps) => {
  return (
    <section className="relative grid min-h-dvh w-full place-content-center overflow-hidden bg-white">
      <h2 className="relative z-0 text-[22vw] font-black text-neutral-800 md:text-[200px]">
        LOVE<span className="text-[#ffafcc]">.</span>
      </h2>
      <Cards images={images} />
    </section>
  );
};

const Cards = ({ images }: { images: { src: string }[] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cards = useMemo(
    () =>
      images.map((image, index) => ({
        ...image,
        ...getCardLayout(index),
        alt: `Image ${index + 1}`,
      })),
    [images],
  );

  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      {cards.map((card, index) => (
        <Card
          key={`${card.src}-${index}`}
          containerRef={containerRef}
          src={card.src}
          alt={card.alt}
          rotate={card.rotate}
          top={card.top}
          left={card.left}
        />
      ))}
    </div>
  );
};
// ---------- Individual Card (The Fix for Refresh Issue) ----------
const Card = ({ containerRef, src, alt, top, left, rotate }: CardProps) => {
  const [zIndex, setZIndex] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState<number>(FALLBACK_CARD_SIZE.width);
  
  // 🌟 [New Fix 1] Image ကို တိုက်ရိုက်လှမ်းစစ်ဆေးရန် ref အသစ်တစ်ခု ဆောက်ပါသည်
  const imgRef = useRef<HTMLImageElement | null>(null);

  const resizeCard = useCallback(
    (ratio: number) => {
      const size = getResponsiveCardSize(ratio, containerRef.current);
      setCardWidth(size.width);
    },
    [containerRef],
  );

  const updateZIndex = () => {
    const elements = document.querySelectorAll(".drag-elements");
    let maxZIndex = 0;

    elements.forEach((element) => {
      const currentZIndex = Number.parseInt(
        window.getComputedStyle(element).getPropertyValue("z-index"),
        10,
      );

      if (!Number.isNaN(currentZIndex) && currentZIndex > maxZIndex) {
        maxZIndex = currentZIndex;
      }
    });

    setZIndex(maxZIndex + 1);
  };

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    const nextRatio = naturalWidth / Math.max(naturalHeight, 1);
    setAspectRatio(nextRatio);
    resizeCard(nextRatio);
  };

  // 🌟 [New Fix 2] Refresh လုပ်ချိန်တွင် ပုံက Cache ထဲရောက်နေ၍ onLoad မခေါ်ခဲ့လျှင် Size ကို အတင်းပြန်တွက်ခိုင်းပါမည်
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      if (naturalWidth && naturalHeight) {
        const nextRatio = naturalWidth / Math.max(naturalHeight, 1);
        setAspectRatio(nextRatio);
        resizeCard(nextRatio);
      }
    }
  }, [resizeCard]);

  useEffect(() => {
    if (!aspectRatio) {
      return;
    }

    const handleResize = () => resizeCard(aspectRatio);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [aspectRatio, resizeCard]);

  return (
    <motion.img
      ref={imgRef} // 🌟 [New Fix 3] img element ကို ref နှင့် ချိတ်ဆက်ပါသည်
      onLoad={handleImageLoad}
      onPointerDown={updateZIndex}
      style={{
        top,
        left,
        rotate,
        zIndex,
        width: `${cardWidth}px`,
      }}
      className="drag-elements absolute h-auto  bg-white p-1.5 pb-6 object-cover shadow-2xl hover:cursor-grab active:cursor-grabbing sm:p-2 sm:pb-8 touch-none select-none"
      src={src}
      alt={alt}
      draggable={false}
      drag
      dragConstraints={containerRef}
      dragElastic={0.65}
      // 🌟 ဒီစာကြောင်းကို မဖြစ်မနေ ထည့်ပေးပါ (Google က ပိတ်မချအောင်ပါ)
      referrerPolicy="no-referrer"
    />
  );
};