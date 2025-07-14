"use client";
import { useRef, useEffect } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import heart from "../components/animations/heart.json";
import { Dancing_Script, Albert_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';

const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ["400", "700"] });
const albertSans = Albert_Sans({ subsets: ['latin'], weight: ["300", "600"] });

export default function Page() {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const router = useRouter();

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.3);
    }
  }, []);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_#FFE3EC,_#FFD6E8,_#ffffff)] px-4 text-center overflow-hidden">

      {/* Floating heart animation */}
      {/* heart animation  */}
      <div className="h-[65%] aspect-square">
        <Lottie lottieRef={lottieRef} animationData={heart} loop={true} />
      </div>

      {/* Centered text and button */}
<div className="absolute aspect-[2/1] flex flex-col justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-6 md:w-fit p-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
        <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-950 ${dancingScript.className}`}>
          Happy 3<sup>rd</sup> Anniversary, My Love
        </h1>

        <p className={`text-base sm:text-lg md:text-xl text-rose-600 ${albertSans.className}`}>
          A little surprise wrapped in love 💝
        </p>

        {/* Button */}
        <button
          onClick={() => router.push('/lock')}
          className="mt-4 px-6 py-2 rounded-full bg-rose-300 hover:bg-rose-400 text-white text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Open Gift
        </button>
      </div>
    </section>
  );
}
