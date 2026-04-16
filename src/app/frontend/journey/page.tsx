"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Dancing_Script, Albert_Sans } from "next/font/google";
import ClickCount from "@/components/ClickCount";

const dancingScript = Dancing_Script({ subsets: ["latin"], weight: ["400", "700"] });
const albertSans = Albert_Sans({ subsets: ["latin"], weight: ["300", "600"] });

interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface JourneyEntry {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  sortOrder: number;
}

export default function RomanticJourneyMyanmar() {
  const [timeElapsed, setTimeElapsed] = useState<TimeElapsed>({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [currentMyanmarTime, setCurrentMyanmarTime] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date("2022-10-01T00:00:00+06:30"));
  const [journeyEntries, setJourneyEntries] = useState<JourneyEntry[]>([]);

  const getMyanmarTime = useCallback(() => {
    const now = new Date();
    return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Yangon" }));
  }, []);

  const calculateTimeElapsed = useCallback(() => {
    const nowMyanmar = getMyanmarTime();
    const diffInMs = nowMyanmar.getTime() - startDate.getTime();

    const totalSeconds = Math.max(0, Math.floor(diffInMs / 1000));
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const years = Math.floor(totalDays / 365.25);
    const remainingDaysAfterYears = totalDays - Math.floor(years * 365.25);
    const months = Math.floor(remainingDaysAfterYears / 30.44);
    const days = Math.floor(remainingDaysAfterYears - months * 30.44);

    return {
      years,
      months,
      days,
      hours: totalHours % 24,
      minutes: totalMinutes % 60,
      seconds: totalSeconds % 60,
    };
  }, [getMyanmarTime, startDate]);

  const formatMyanmarTime = useCallback(() => {
    const now = new Date();
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
    });
  }, []);

  const totalCounts = useMemo(() => {
    const nowMyanmar = getMyanmarTime();
    const diffInMs = nowMyanmar.getTime() - startDate.getTime();
    return {
      totalDays: Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60 * 24))),
      totalHours: Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60))),
      totalMinutes: Math.max(0, Math.floor(diffInMs / (1000 * 60))),
      totalSeconds: Math.max(0, Math.floor(diffInMs / 1000)),
    };
  }, [getMyanmarTime, startDate]);

  useEffect(() => {
    const fetchJourney = async () => {
      const response = await fetch("/api/journey");
      if (!response.ok) return;
      const data = (await response.json()) as { startDate: string | null; entries: JourneyEntry[] };
      if (data.startDate) setStartDate(new Date(data.startDate));
      setJourneyEntries(data.entries ?? []);
    };
    fetchJourney();
  }, []);

  useEffect(() => {
    const updateAllTimes = () => {
      setTimeElapsed(calculateTimeElapsed());
      setCurrentMyanmarTime(formatMyanmarTime());
    };
    updateAllTimes();
    const interval = setInterval(updateAllTimes, 1000);
    return () => clearInterval(interval);
  }, [calculateTimeElapsed, formatMyanmarTime]);

  const timeUnits = [
    { value: timeElapsed.years, label: "Years" },
    { value: timeElapsed.months, label: "Months" },
    { value: timeElapsed.days, label: "Days" },
    { value: timeElapsed.hours, label: "Hours" },
    { value: timeElapsed.minutes, label: "Minutes" },
    { value: timeElapsed.seconds, label: "Seconds" },
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50 ${albertSans.className}`}>
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1
              className={`text-3xl sm:text-4xl lg:text-6xl mt-5 font-bold bg-gradient-to-r from-[#FFC8DD] via-rose-500 to-[#FFAFCC] bg-clip-text text-transparent mb-4 leading-tight ${dancingScript.className}`}
            >
              Our Love Story
            </h1>
            <p className={`text-rose-600 text-base sm:text-lg lg:text-xl font-medium max-w-2xl mx-auto leading-relaxed ${albertSans.className}`}>
              Every moment has been magical.
            </p>
          </div>

          <ClickCount />

          <div className="text-center mb-6 sm:mb-8">
            <p className="text-rose-600 text-xs sm:text-sm font-medium mt-2 max-w-md mx-auto font-mono">
              {currentMyanmarTime}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-8 gap-3 sm:gap-4 lg:gap-6 mb-12">
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className="rounded-2xl bg-white/80 border border-rose-200 p-4 text-center shadow-sm"
              >
                <div className="text-3xl font-bold text-rose-600">
                  {unit.value.toString().padStart(2, "0")}
                </div>
                <div className={`text-sm text-rose-500 ${dancingScript.className}`}>{unit.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200/30 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Days" value={totalCounts.totalDays.toLocaleString()} />
              <StatCard label="Total Hours" value={totalCounts.totalHours.toLocaleString()} />
              <StatCard label="Total Minutes" value={totalCounts.totalMinutes.toLocaleString()} />
              <StatCard label="Total Seconds" value={totalCounts.totalSeconds.toLocaleString()} />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-rose-200 p-6 shadow-md">
            <h2 className={`text-3xl text-rose-700 mb-4 ${dancingScript.className}`}>Journey Timeline</h2>
            {journeyEntries.length === 0 ? (
              <p className="text-gray-500">No milestones added yet.</p>
            ) : (
              <div className="space-y-3">
                {journeyEntries.map((entry) => (
                  <div key={entry.id} className="border border-rose-100 rounded-xl p-4 bg-rose-50/50">
                    <p className="text-sm text-rose-500">{new Date(entry.eventDate).toLocaleDateString()}</p>
                    <h3 className="text-lg font-semibold text-rose-700">{entry.title}</h3>
                    {entry.description && <p className="text-gray-600">{entry.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-200/50 hover:shadow-lg transition-all duration-300">
      <div className="text-2xl sm:text-3xl font-bold text-rose-600 mb-2">{value}</div>
      <div className="text-rose-600 font-semibold text-sm sm:text-base">{label}</div>
    </div>
  );
}
