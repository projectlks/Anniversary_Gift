'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { uploadImageFunction } from './action';
import Image from 'next/image';
import Loading from '@/components/Loading';


export default function ImgUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });





  // 



  // 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!selectedFile) {
        throw new Error('No file selected');
      }

      const uniqueName = `${Date.now()}-${selectedFile.name}`;

      const response = await upload(uniqueName, selectedFile, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      const res = await uploadImageFunction(response.url);

      if (res) {
        router.push('/memories');
      } else {
        throw new Error('Failed to save image to database.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">




      {/* Dropzone with preview */}
      <div
        {...getRootProps()}
        className={`transition border border-dashed cursor-pointer rounded-xl p-7 lg:p-10
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        hover:border-blue-500 text-center`}
      >
        <input {...getInputProps()} />
        {previewUrl ? (
          <div className="flex justify-center">
            <Image
              src={previewUrl}
              alt="Preview"
              width={240}
              height={240}
              className="mt-2 rounded-xl shadow-sm max-h-60 object-contain border border-rose-200"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700">
              <svg
                width="29"
                height="28"
                viewBox="0 0 29 28"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                />
              </svg>
            </div>
            <h4 className="mb-3 font-semibold text-gray-800 text-xl">
              Drag & Drop Files Here
            </h4>
            <p className="mb-5 max-w-[290px] text-sm text-gray-700">
              Drag and drop your PNG, JPG, WebP, SVG images here or browse
            </p>
            <span className="font-medium underline text-blue-500 cursor-pointer">
              Browse File
            </span>
          </div>
        )}
      </div>

      {/* Error message */}

      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {loading && <Loading />}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-rose-400 hover:bg-rose-500 transition text-white py-2 rounded-xl text-lg font-medium shadow-md disabled:opacity-60"
      >
        {loading ? 'Uploading...' : 'Upload 💌'}
      </button>
    </form>
  );
}
