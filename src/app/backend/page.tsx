"use client";

import type React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

// Heroicons
import {
  PhotoIcon,
  PuzzlePieceIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function AddMenuPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(date);
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/lock", { method: "POST" });
      await signOut({ callbackUrl: "/auth/signin" });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { 
          animation: fadeInUp 0.6s ease-out forwards; 
          opacity: 0; 
        }
      `,
        }}
      />

      <div className="min-h-screen bg-[#F8FAFC]  font-sans text-gray-500">
        {/* ================= TOP NAVBAR ================= */}
        <header className="sticky top-0 z-40 flex w-full  bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex grow items-center container justify-between py-4 px-6 md:px-10  mx-auto w-full">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Our Space
              </h1>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 border border-gray-100">
                <ClockIcon className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
                  {currentDate || "Loading..."}
                </span>
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white disabled:opacity-50">
                {isLoggingOut ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <ArrowRightOnRectangleIcon
                    className="h-4 w-4"
                    strokeWidth={2.5}
                  />
                )}
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          </div>
        </header>

        {/* ================= MAIN CONTENT ================= */}
        <main className="mx-auto  container p-4 pt-10 md:p-10 space-y-10">
          <div className="max-w-2xl animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-[40px] mb-4 tracking-tight">
              Dashboard Menu
            </h2>
            <p className="text-base md:text-lg leading-relaxed text-gray-500">
              Select an option below to manage your memories, solve puzzles, or
              configure your private space settings.
            </p>
          </div>

          {/* Menu Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ExactDesignCard
              title="Add Memory"
              description="Upload beautiful moments and photos to display in our private 3D Gallery."
              icon={<PhotoIcon className="h-12 w-12" strokeWidth={1.5} />}
              onClick={() => handleNavigate("/backend/imagesUpload")}
              delay="0.1s"
            />

            <ExactDesignCard
              title="Add Puzzle Image"
              description="Create fun and interactive puzzles using our favorite memorable photos."
              icon={<PuzzlePieceIcon className="h-12 w-12" strokeWidth={1.5} />}
              onClick={() => handleNavigate("/backend/puzzle")}
              delay="0.2s"
            />

            <ExactDesignCard
              title="Love Note"
              description="Write heartfelt messages and secret notes for each other to read anytime."
              icon={<EnvelopeIcon className="h-12 w-12" strokeWidth={1.5} />}
              onClick={() => handleNavigate("/backend/note")}
              delay="0.3s"
            />

            <ExactDesignCard
              title="Journey Timeline"
              description="Keep track of important milestones, dates, and anniversaries in our journey."
              icon={
                <CalendarDaysIcon className="h-12 w-12" strokeWidth={1.5} />
              }
              onClick={() => handleNavigate("/backend/journey")}
              delay="0.4s"
            />

            <ExactDesignCard
              title="Manage Couples"
              description="Control access, configure limits, and manage our private space settings."
              icon={<UsersIcon className="h-12 w-12" strokeWidth={1.5} />}
              onClick={() => handleNavigate("/backend/couples")}
              delay="0.5s"
            />
          </div>
        </main>
      </div>
    </>
  );
}

// ==========================================
// EXACT MATCH CARD DESIGN (From User HTML)
// ==========================================
function ExactDesignCard({
  title,
  description,
  icon,
  onClick,
  delay = "0s",
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  delay?: string;
}) {
  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="cursor-pointer focus:outline-none animate-fade-in-up group"
      style={{ animationDelay: delay, animationFillMode: "both" }}>
      {/* အတိအကျ HTML Classes: 
        rounded-3xl border border-stroke-secondary bg-gray-50 p-1 duration-200 hover:border-primary-200 hover:bg-primary-25 md:p-2 
      */}
      <div className="rounded-3xl border border-gray-200 bg-gray-50 p-1 duration-200 hover:border-blue-300 hover:bg-blue-50 md:p-2 h-full">
        {/* အတိအကျ HTML Classes:
          h-full rounded-2xl border border-[#F2F4F7] bg-white p-4 md:p-6 
        */}
        <div className="h-full rounded-2xl border border-[#F2F4F7] bg-white p-4 md:p-6">
          {/* အတိအကျ HTML Classes:
            mb-7.5 text-primary 
          */}
          <div className="mb-7.5 text-blue-600">{icon}</div>

          {/* အတိအကျ HTML Classes:
            mb-4 text-xl font-semibold text-title-color md:text-2xl lg:text-xl xl:text-2xl 
          */}
          <h3 className="mb-4 text-xl font-semibold text-gray-900 md:text-2xl lg:text-xl xl:text-2xl">
            {title}
          </h3>

          {/* အတိအကျ HTML Classes:
            text-base !leading-normal text-text-color-secondary 
          */}
          <p className="text-base leading-normal text-gray-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
