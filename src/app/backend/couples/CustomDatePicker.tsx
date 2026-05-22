"use client";

import { useState, useRef, useEffect } from "react";

export default function CustomDatePicker({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Click Outside logic
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();
  const prevMonthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    0,
  ).getDate();

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    if (!isNaN(year) && year >= 1900 && year <= 2100) {
      setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    }
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

  const formattedDateForServer = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  const displayDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div ref={wrapperRef} className="relative w-full font-sans">
      <input type="hidden" name={name} value={formattedDateForServer} />

      {/* Input Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex px-4 py-2.5 text-sm text-gray-900 items-center justify-between rounded-sm border-[1.5px] border-[#E2E8F0] bg-white outline-none transition cursor-pointer hover:border-[#3C50E0] ${isOpen ? "border-[#3C50E0]" : ""}`}>
        <span className={selectedDate ? "text-gray-900" : "text-[#64748B]"}>
          {displayDate || "Select Anniversary Date"}
        </span>
        <svg
          className="w-5 h-5 text-[#64748B]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>

      {/* Flatpickr Exact UI */}
      {isOpen && (
        <div className="absolute top-[105%] left-0 z-999 w-90 bg-white shadow-[0_3px_13px_rgba(0,0,0,0.08)] border border-[#e6e6e6] rounded-xl p-5 animate-fadeIn">
          {/* Header (flatpickr-months) */}
          <div className="flex items-center justify-between ">
            <span
              onClick={prevMonth}
              className="p-2 hover:bg-[#e6e6e6] rounded-full cursor-pointer transition">
              <svg className="w-3.5 h-3.5" viewBox="0 0 17 17">
                <path
                  fill="#3c44b1"
                  d="M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z"></path>
              </svg>
            </span>

            <div className="flex items-center gap-1 font-medium text-[#3c44b1]">
              <span className="text-lg">
                {currentMonth.toLocaleDateString("en-US", { month: "long" })}
              </span>
              <div className="relative group flex  items-center">
                <input
                  type="number"
                  defaultValue={currentMonth.getFullYear()}
                  min="1900"
                  max="2100"
                  onChange={handleYearChange}
                  className="w-15 text-center text-xl outline-none bg-transparent hover:bg-[#e6e6e6] rounded px-1 transition appearance-none"
                />
              </div>
            </div>

            <span
              onClick={nextMonth}
              className="p-2 hover:bg-[#e6e6e6] rounded-full cursor-pointer transition">
              <svg className="w-3.5 h-3.5" viewBox="0 0 17 17">
                <path
                  fill="#3c44b1"
                  d="M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z"></path>
              </svg>
            </span>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 px-2 mt-6 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span
                key={d}
                className="text-center text-[14px] font-bold text-[#64748B] py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0 px-2 pb-3">
            {/* Previous Month Days */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <span
                key={`prev-${i}`}
                className="text-center py-2.5 text-[14px] text-[#ccc] cursor-default">
                {prevMonthDays - firstDayOfMonth + i + 1}
              </span>
            ))}

            {/* Current Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day,
              );
              const isSelected =
                selectedDate?.toDateString() === date.toDateString();
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDate(date)}
                  className={`text-center py-2.5 text-[14px] rounded-[5px] transition-colors relative
                    ${
                      isSelected
                        ? "bg-[#3C50E0] text-white font-bold"
                        : isToday
                          ? "bg-[#e6e6e6] text-[#3c44b1] font-bold after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#3C50E0] after:rounded-full"
                          : "text-[#393939] hover:bg-[#e6e6e6]"
                    }`}>
                  {day}
                </button>
              );
            })}

            {/* Next Month Days */}
            {Array.from({ length: 42 - (firstDayOfMonth + daysInMonth) }).map(
              (_, i) => (
                <span
                  key={`next-${i}`}
                  className="text-center py-2.5 text-[14px] text-[#ccc] cursor-default">
                  {i + 1}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
