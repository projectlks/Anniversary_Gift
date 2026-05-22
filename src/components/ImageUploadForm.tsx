// 'use client';

// import React, { } from 'react';
// import { useDropzone } from 'react-dropzone';
// import Image from 'next/image';
// import Loading from '@/components/Loading';

// interface Props {
//     error: string | null
//     loading: boolean
//     previewUrl: string | null
//     onDrop: (acceptedFiles: File[]) => void | Promise<void>;
//     handleSubmit: (event: React.FormEvent) => Promise<void>
//     disabled?: boolean
//     helperText?: string | null

// }

// export default function ImgUploadForm({ error, loading, handleSubmit, previewUrl, onDrop, disabled = false, helperText = null }: Props) {

//     const { getRootProps, getInputProps, isDragActive } = useDropzone({
//         onDrop,
//         accept: { 'image/*': [] },
//         disabled,
//     });

//     return (
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">

//             {/* Dropzone with preview */}
//             <div
//                 {...getRootProps()}
//                 className={`transition border border-dashed cursor-pointer rounded-xl p-7 lg:p-10
//         ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
//         ${disabled ? 'cursor-not-allowed opacity-60' : 'hover:border-blue-500'}
//         text-center`}
//             >
//                 <input {...getInputProps()} />
//                 {previewUrl ? (
//                     <div className="flex justify-center">
//                         <Image
//                             src={previewUrl}
//                             alt="Preview"
//                             width={240}
//                             height={240}
//                             className="mt-2 rounded-xl shadow-sm max-h-60 object-contain border border-rose-200"
//                         />
//                     </div>
//                 ) : (
//                     <div className="flex flex-col items-center justify-center">
//                         <div className="mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700">
//                             <svg
//                                 width="29"
//                                 height="28"
//                                 viewBox="0 0 29 28"
//                                 fill="currentColor"
//                                 xmlns="http://www.w3.org/2000/svg"
//                             >
//                                 <path
//                                     fillRule="evenodd"
//                                     clipRule="evenodd"
//                                     d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
//                                 />
//                             </svg>
//                         </div>
//                         <h4 className="mb-3 font-semibold text-gray-800 text-xl">
//                             Drag & Drop Files Here
//                         </h4>
//                         <p className="mb-5 max-w-[290px] text-sm text-gray-700">
//                             Drag and drop your PNG, JPG, WebP, SVG images here or browse
//                         </p>
//                         <span className="font-medium underline text-blue-500 cursor-pointer">
//                             Browse File
//                         </span>
//                     </div>
//                 )}
//             </div>

//             {/* Error message */}

//             {helperText && <p className="text-center text-sm font-medium text-gray-500">{helperText}</p>}

//             {error && <p className="text-center text-red-500 font-medium">{error}</p>}

//             {loading && <Loading />}

//             {/* Submit button */}
//             <button
//                 type="submit"
//                 disabled={loading || disabled}
//                 className="bg-rose-400 hover:bg-rose-500 transition text-white py-2 rounded-xl text-lg font-medium shadow-md disabled:cursor-not-allowed disabled:opacity-60"
//             >
//                 {loading ? 'Uploading...' : 'Upload 💌'}
//             </button>
//         </form>
//     );
// }

"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import Loading from "@/components/Loading";

interface Props {
  error: string | null;
  loading: boolean;
  previewUrl: string | null;
  onDrop: (acceptedFiles: File[]) => void | Promise<void>;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  disabled?: boolean;
  helperText?: string | null;
}

export default function ImageUploadForm({
  error,
  loading,
  handleSubmit,
  previewUrl,
  onDrop,
  disabled = false,
  helperText = null,
}: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    disabled,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-5">
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-gray-50"
        }
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:border-blue-400 hover:bg-blue-50/50"
        }
        `}>
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative flex w-full flex-col items-center justify-center">
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-contain"
              />
            </div>
            {!loading && !disabled && (
              <p className="mt-4 text-xs font-medium text-blue-600 group-hover:underline">
                Click or drag to change image
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
              <svg
                width="28"
                height="28"
                viewBox="0 0 29 28"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                />
              </svg>
            </div>
            <h4 className="mb-2 text-lg font-semibold text-gray-900">
              Upload an image
            </h4>
            <p className="mb-4 max-w-[260px] text-sm leading-relaxed text-gray-500">
              Drag and drop your PNG, JPG, or WebP here, or click to browse.
            </p>
            <span className="inline-flex rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-gray-200 group-hover:bg-blue-50 group-hover:ring-blue-200">
              Browse Files
            </span>
          </div>
        )}
      </div>

      {/* Helper & Error Messages */}
      {helperText && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 p-3 text-sm font-medium text-gray-600">
          <svg
            className="h-4 w-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
          {helperText}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 ring-1 ring-red-100">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-2">
          <Loading />
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || disabled || !previewUrl}
        className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none">
        {loading ? "Uploading..." : "Upload Image"}
      </button>
    </form>
  );
}