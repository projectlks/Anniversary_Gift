"use client"

import { useRouter } from "next/navigation"
import type React from "react"

type BoxProps = {
  title?: string
  description?: string
  icon1?: React.ReactNode
  bgColor?: string
  circleColor?: string
  textColor?: string
  goTo: string
}

export function Box({
  title = "Our Memories",
  description = "Every precious moment we've shared together",
  icon1,
  bgColor = "#CDB4DB",
  circleColor = "#FFC8DD",
  textColor = "#4A4A4A",
  goTo,
}: BoxProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(goTo)}
      className="group w-full aspect-[2/1] relative overflow-hidden cursor-pointer transform transition-all duration-700 hover:scale-110"
    >
      {/* Unique card shape with cut corners */}
      <div
        className="absolute inset-0 transform rotate-1 group-hover:rotate-0 transition-transform duration-500"
        style={{
          background: `linear-gradient(45deg, ${bgColor}20 0%, ${bgColor}40 50%, ${bgColor}60 100%)`,
          clipPath: "polygon(0 10%, 10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%)",
        }}
      ></div>

      {/* Main card */}
      <div
        className="absolute inset-2 backdrop-blur-sm border-2 border-white/30 group-hover:border-white/60 transition-all duration-500 shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${bgColor}80, ${circleColor}60, ${bgColor}90)`,
          clipPath: "polygon(0 8%, 8% 0%, 92% 0%, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0% 92%)",
        }}
      >
        {/* Decorative corner elements */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-white/40"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-white/40"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-white/40"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-white/40"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center space-y-4 p-6">
          {/* Hexagonal sticker container */}
          <div className="relative">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500"
              style={{
                background: `linear-gradient(60deg, ${circleColor}, ${circleColor}80, ${circleColor})`,
                clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                boxShadow: `0 8px 25px ${circleColor}60`,
              }}
            >
              {/* Inner hexagon */}
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center"
                style={{
                  background: `linear-gradient(120deg, ${circleColor}90, white, ${circleColor}70)`,
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                }}
              >
                {icon1}
              </div>
            </div>
          </div>

          {/* Title with unique styling */}
          <div className="text-center space-y-2">
            <h1
              className="text-xl sm:text-2xl font-bold tracking-wider drop-shadow-lg font-sans transform group-hover:scale-105 transition-transform duration-300"
              style={{
                color: textColor,
                textShadow: `2px 2px 4px ${bgColor}40`,
              }}
            >
              {title}
            </h1>

            {/* Unique divider */}
            <div className="flex items-center justify-center gap-1">
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
              <div className="w-6 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-center text-xs sm:text-sm font-medium leading-relaxed max-w-xs opacity-90"
            style={{ color: textColor }}
          >
            {description}
          </p>

          {/* Bottom accent */}
          <div className="flex items-center gap-2 opacity-70">
            <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" style={{ animationDelay: "1s" }}></div>
          </div>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
          <div
            className="absolute top-8 right-6 w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-4 right-4 w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{ animationDelay: "3s" }}
          ></div>
        </div>
      </div>
    </div>
  )
}