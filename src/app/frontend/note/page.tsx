"use client";

import { useEffect, useState } from "react";
import Paper from "./Paper";
import Steal from "./Steal";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // For simulating z-index animation
  const [zIndex, setZIndex] = useState(30);
  const [isReversing, setIsReversing] = useState(false);

  // Handle click
  const handleClick = () => {
    if (isFirstTime) setIsFirstTime(false);

    const reversing = isOpen; // true if we're closing
    setIsReversing(reversing);
    setIsOpen((prev) => !prev);
  };

  // ⏱ z-index switch after 80% of 2.5s (2000ms)
  useEffect(() => {
    if (isReversing) {
      setZIndex(20); // Start at 20
      const timeout = setTimeout(() => {
        setZIndex(30); // Change at 2s
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isReversing]);

  return (
    <section className="w-full h-screen flex justify-center items-center overflow-y-auto bg-[radial-gradient(circle,_#FFC8DD,_#ffffff)]">
      <div
        onClick={handleClick}
        className={`relative w-[90%] max-w-[700px] aspect-[3/2] perspective-[1000px] bg-rose-500  transition-all duration-700 ${!isFirstTime ? !isOpen ? "translate-y-0" : "translate-y-[200px]" : ""}`}
      >
        {/* Cover */}
        <div
          className={`relative transform-3d ${isReversing ? "reverse" : isOpen ? "open z-20" : "z-30"}`}
          style={{ zIndex }}
        >
          <div
            className={`w-full h-[100px] origin-top transition-all bg-rose-300 absolute top-0 border-b transform duration-700
              ${!isFirstTime ? (!isOpen ? "reverse-cover" : "cover") : ""}
            `}
          >
            {/* Triangle on cover */}
            <div className="w-full h-0 absolute -bottom-[150px] border-l-[200px] border-r-[200px] border-t-[150px] border-l-transparent border-r-transparent border-t-rose-300"></div>


            {/* circle */}

            <div className=" aspect-square rounded-full bg-rose-600 absolute -bottom-[200px]  left-1/2 transform transform-all -translate-x-1/2 ">
              <Steal />
            </div>

          </div>
        </div>

        {/* Paper */}
        <div
          className={`w-[calc(100%-20px)]   bg-white absolute left-1/2 transform -translate-x-1/2 transition-all
            ${!isFirstTime
              ? !isOpen
                ? "paperAnimationReverse z-40   "
                : "paperAnimation top-0  "
              : "h-full "
            }
          `}
        >

          <Paper />

        </div>

        {/* Decorative triangles */}
        <div className="w-0 h-0 absolute border-b-[300px] border-r-[300px] border-b-rose-400 z-20 border-r-transparent"></div>
        <div className="w-0 h-0 z-20 absolute right-0 border-b-[300px] border-l-[300px] border-b-rose-400 border-l-transparent"></div>

        {/* Bottom section */}
        <div className="w-full h-[50%] z-20 absolute bottom-0 overflow-hidden bg-rose-400">
          <div className="border-t-2 absolute bottom-0 origin-bottom-left left-0 border-rose-600 -rotate-[45deg] w-[50%] h-0"></div>
          <div className="border-t-2 absolute bottom-0 origin-bottom-right right-0 border-rose-600 rotate-[45deg] w-[50%] h-0"></div>
        </div>
      </div>
    </section>
  );
}
