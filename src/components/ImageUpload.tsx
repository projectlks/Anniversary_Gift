"use client";

import { useRef, type ChangeEvent } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface ImageUploadProps {
  onFileSelected: (file: File) => void | Promise<void>;
  disabled?: boolean;
  buttonText?: string;
  className?: string;
}

export default function ImageUpload({
  onFileSelected,
  disabled = false,
  buttonText = "Upload Photo",
  className = "",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;
    await onFileSelected(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="sr-only"
        disabled={disabled}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className={`flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600 ${className}`}>
        <ArrowUpTrayIcon className="h-5 w-5" />
        <span>{buttonText}</span>
      </button>
    </>
  );
}
