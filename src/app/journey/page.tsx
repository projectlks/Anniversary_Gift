"use client"

import { useState, useEffect } from "react"

interface TimeElapsed {
  years: number
  months: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function RomanticJourneyMyanmar() {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [currentMyanmarTime, setCurrentMyanmarTime] = useState<string>("")

  // Get current Myanmar time (UTC+6:30)
  const getMyanmarTime = () => {
    const now = new Date()
    // Convert to Myanmar time (UTC+6:30)
    return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Yangon" }))
  }

  // Start date in Myanmar time
  const getStartDateMyanmar = () => {
    // October 1, 2022 at 00:00:00 Myanmar time
    return new Date("2022-10-01T00:00:00+06:30")
  }

  const calculateTimeElapsed = () => {
    const nowMyanmar = getMyanmarTime()
    const startMyanmar = getStartDateMyanmar()
    const diffInMs = nowMyanmar.getTime() - startMyanmar.getTime()

    // Calculate time units
    const totalSeconds = Math.floor(diffInMs / 1000)
    const totalMinutes = Math.floor(totalSeconds / 60)
    const totalHours = Math.floor(totalMinutes / 60)
    const totalDays = Math.floor(totalHours / 24)

    // Calculate years (accounting for leap years)
    const years = Math.floor(totalDays / 365.25)
    const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25)

    // Calculate months (approximate)
    const months = Math.floor(remainingDaysAfterYears / 30.44)
    const days = Math.floor(remainingDaysAfterYears - months * 30.44)

    // Calculate remaining hours, minutes, seconds
    const hours = totalHours % 24
    const minutes = totalMinutes % 60
    const seconds = totalSeconds % 60

    return { years, months, days, hours, minutes, seconds }
  }

  const formatMyanmarTime = () => {
    const now = new Date()
    return now.toLocaleString("en-US", {
      timeZone: "Asia/Yangon",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  // Get total counts in Myanmar time
  const getTotalCounts = () => {
    const nowMyanmar = getMyanmarTime()
    const startMyanmar = getStartDateMyanmar()
    const diffInMs = nowMyanmar.getTime() - startMyanmar.getTime()

    return {
      totalDays: Math.floor(diffInMs / (1000 * 60 * 60 * 24)),
      totalHours: Math.floor(diffInMs / (1000 * 60 * 60)),
      totalMinutes: Math.floor(diffInMs / (1000 * 60)),
      totalSeconds: Math.floor(diffInMs / 1000),
    }
  }

  useEffect(() => {
    const updateAllTimes = () => {
      setTimeElapsed(calculateTimeElapsed())
      setCurrentMyanmarTime(formatMyanmarTime())
    }

    // Update immediately
    updateAllTimes()

    // Update every second
    const interval = setInterval(updateAllTimes, 1000)
    return () => clearInterval(interval)
  }, [])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="group relative w-40 h-40">
      {/* SVG heart clip path definition */}
      <svg viewBox="0 0 32 29.6" className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path
              d="M0.5,0.9
            C0.2,0.7,0,0.4,0.1,0.2
            C0.2,0,0.4,0,0.5,0.2
            C0.6,0,0.8,0,0.9,0.2
            C1,0.4,0.8,0.7,0.5,0.9Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Centered ping animation */}
      <span
        style={{ clipPath: 'url(#heartClip)' }}
        className="absolute w-[80%] h-[80%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping bg-rose-400 opacity-50 z-0"
      ></span>

      {/* Main heart card with gradient & shadow */}
      <div
        className="w-full h-full flex items-center justify-center  animate-pulse-scale p-4 sm:p-6 bg-gradient-to-br from-rose-400 via-pink-500 to-pink-800 text-white shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 backdrop-blur-md relative z-10"
        style={{ clipPath: 'url(#heartClip)' }}
      >
        {/* Floating heart icon */}
        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <span className="text-white/70 text-xs animate-bounce">♡</span>
        </div>

        {/* Main content */}
        <div className="text-center">
          <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white drop-shadow animate-pulse">
            {value.toString().padStart(2, '0')}
          </div>
          <div className="mt-1 text-xs sm:text-sm font-semibold tracking-wide  text-white/90">
            {label}
          </div>
        </div>
      </div>
    </div>




  )

  const timeUnits = [
    { value: timeElapsed.years, label: "Years" },
    { value: timeElapsed.months, label: "Months" },
    { value: timeElapsed.days, label: "Days" },
    { value: timeElapsed.hours, label: "Hours" },
    { value: timeElapsed.minutes, label: "Minutes" },
    { value: timeElapsed.seconds, label: "Seconds" },
  ]

  const totalCounts = getTotalCounts()

  return (
    <div className="min-h-screen 0 bg-gradient-to-br from-pink-50 via-rose-25 to-purple-50 relative overflow-hidden">
      {/* Floating romantic elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 text-pink-300 text-2xl animate-float opacity-30">♡</div>
        <div
          className="absolute top-32 right-20 text-rose-300 text-xl animate-bounce opacity-40"
          style={{ animationDelay: "1s" }}
        >
          💕
        </div>
        <div
          className="absolute bottom-40 left-16 text-purple-300 text-lg animate-pulse opacity-35"
          style={{ animationDelay: "2s" }}
        >
          ✨
        </div>
        <div
          className="absolute bottom-20 right-10 text-pink-400 text-xl animate-float opacity-30"
          style={{ animationDelay: "3s" }}
        >
          🌹
        </div>
        <div
          className="absolute top-1/2 left-8 text-rose-300 text-sm animate-bounce opacity-25"
          style={{ animationDelay: "4s" }}
        >
          💖
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Romantic Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="mb-4">
              <span className="text-4xl sm:text-5xl p-4 rounded-full border border-rose-600 lg:text-6xl">💕</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-[#FFC8DD] via-rose-500 to-[#FFAFCC] bg-clip-text text-transparent mb-4 leading-tight">
              Our Love Story
            </h1>
            <p className="text-rose-600 text-base sm:text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Every moment since October 1st, 2022 has been magical ✨
            </p>
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 mx-auto mt-4 sm:mt-6 rounded-full"></div>
          </div>

          {/* Myanmar Time Display - Updates Every Second */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-amber-200/50 shadow-lg backdrop-blur-sm">
              <span className="text-lg">🇲🇲</span>
              <span className="text-sm sm:text-base font-semibold">Myanmar Time (Live)</span>
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-rose-600 text-xs sm:text-sm font-medium mt-2 max-w-md mx-auto font-mono">
              {currentMyanmarTime}
            </p>
          </div>

          {/* Responsive Time Display Grid - Updates Every Second */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12 lg:mb-16">
            {timeUnits.map((unit, index) => (
              <TimeUnit key={index} value={unit.value} label={unit.label} />
            ))}
          </div>

          {/* Romantic Milestones Section - Updates Every Second */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 lg:p-12 shadow-2xl border border-pink-200/30 mb-8">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Love Milestones 💖
              </h2>
              <p className="text-rose-500 text-sm sm:text-base font-medium">
                All counts in Myanmar Time (UTC+6:30) - Live Updates
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-pink-600 mb-2 font-mono">
                  {totalCounts.totalDays.toLocaleString()}
                </div>
                <div className="text-rose-600 font-semibold text-sm sm:text-base flex items-center justify-center gap-1">
                  <span>🌹</span> Total Days <span>🌹</span>
                </div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl border border-rose-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-600 mb-2 font-mono">
                  {totalCounts.totalHours.toLocaleString()}
                </div>
                <div className="text-purple-600 font-semibold text-sm sm:text-base flex items-center justify-center gap-1">
                  <span>💕</span> Total Hours <span>💕</span>
                </div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2 font-mono">
                  {totalCounts.totalMinutes.toLocaleString()}
                </div>
                <div className="text-pink-600 font-semibold text-sm sm:text-base flex items-center justify-center gap-1">
                  <span>✨</span> Total Minutes <span>✨</span>
                </div>
              </div>

              <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200/50 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-rose-600 mb-2 font-mono">
                  {totalCounts.totalSeconds.toLocaleString()}
                </div>
                <div className="text-rose-600 font-semibold text-sm sm:text-base flex items-center justify-center gap-1">
                  <span>💖</span> Total Seconds <span>💖</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Status & Love Quote */}
          <div className="text-center space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-rose-700 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-pink-200/50 shadow-lg backdrop-blur-sm">
              <div className="w-2 h-2 bg-[#A2D2FF]  rounded-full animate-pulse"></div>
              <span className="text-sm sm:text-base font-semibold">Live Love Counter 💖</span>
              {/* <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-mono">🇲🇲 UTC+6:30</span> */}
            </div>

            <div className="max-w-2xl mx-auto">
              <p className="text-rose-600 text-sm sm:text-base lg:text-lg font-medium italic leading-relaxed">
                &quot;Every second with you feels like a beautiful eternity. Our love grows stronger with each passing moment
                in Myanmar time.&quot; 💕
              </p>
            </div>



          </div>
        </div>
      </div>

      {/* Custom CSS for floating animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
