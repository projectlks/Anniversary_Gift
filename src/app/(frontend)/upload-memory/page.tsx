"use client";

import { useState, DragEvent } from "react";
import imageCompression from "browser-image-compression";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { uploadUserImageAction } from "@/libs/action";

export default function UserUploadPage() {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelected = async (file: File) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("JPG, PNG သို့မဟုတ် WebP ပုံများကိုသာ လက်ခံပါသည်။");
      }

      const options = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);

      const savedImage = await uploadUserImageAction(formData);

      if (!savedImage) {
        setError("ပုံကို သိမ်းဆည်း၍ မရနိုင်ပါ။ ထပ်မံကြိုးစားကြည့်ပါ။");
        return;
      }

      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "တစ်ခုခုမှားယွင်းသွားပါပြီ။";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!saving && !success) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (saving || success) return;

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  return (
    // 🌟 စာမျက်နှာ အလယ်တည့်တည့် ရောက်အောင် justify-center ထည့်ထားသည်
    <div className="flex h-screen w-full items-center justify-center p-4">
      {/* 🌟 image_0.png ထဲကအတိုင်း Card Container ပုံစံ */}
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Card Header - Dropzone */}

        {/* Card Body */}
        <div className="p-6">
          {/* success view */}
          {success && (
            <div className="rounded-xl border border-dashed border-green-200 bg-green-50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                အောင်မြင်စွာ တင်ပြီးပါပြီ!
              </h3>

              {/* 🌟 နောက်ထပ်ပုံ ထပ်တင်ရန် ခလုတ် (အသစ်ထည့်ထားသည်) */}
              <button
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                }}
                className="rounded-lg mt-5 bg-green-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                နောက်ထပ်ပုံ ထပ်တင်မည်
              </button>
            </div>
          )}

          {/* saving view */}
          {saving && !success && (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500 mb-4"></div>
                <p className="text-lg font-medium text-gray-900">
                  သိမ်းဆည်းနေပါသည်...
                </p>
              </div>
            </div>
          )}

          {/* upload view */}
          {!saving && !success && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              // 🌟 image_0.png ထဲကအတိုင်း dashed border နှင့် pattern
              // isDragging ဖြစ်ရင် Pink ThemeBorder အရောင်ပြောင်းမည်
              className={`relative flex min-h-[300px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 
                ${
                  isDragging
                    ? "border-pink-300 bg-pink-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                }`}>
              {/* 🌟 image_0.png ထဲကအတိုင်း Upload Icon inside circle */}
              <div className="mb-6 rounded-full bg-white p-4 shadow-inner border border-gray-100">
                <ArrowUpTrayIcon className="h-10 w-10 text-pink-500" />
              </div>

              {/* Primary Text */}
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                Drag & Drop Files Here
              </h2>

              {/* Secondary Text */}
              <p className="mb-6 max-w-sm text-sm text-gray-500">
                Drag and drop your PNG, JPG, WebP images here or browse
              </p>

              {/* 🌟 image_0.png ထဲကအတိုင်း Browse File link style with Pink Theme */}
              <div className="relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelected(file);
                  }}
                />
                <span className="text-base font-medium text-pink-600 hover:text-pink-700 underline cursor-pointer">
                  Browse File
                </span>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 ring-1 ring-red-100">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}