'use client';

import React, { useCallback, useState, useEffect } from 'react';
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

    // Revoke preview URL when component unmounts or previewUrl changes
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    function createSquareImage(file: File): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const img = new globalThis.Image();
            img.onload = () => {
                const size = Math.max(img.width, img.height);
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject('Cannot get canvas context');
                    return;
                }
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, size, size);
                const x = (size - img.width) / 2;
                const y = (size - img.height) / 2;
                ctx.drawImage(img, x, y);
                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject('Canvas toBlob failed');
                    },
                    'image/jpeg',
                    0.9,
                );
            };
            img.onerror = () => reject('Image load error');
            img.src = URL.createObjectURL(file);
        });
    }

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            try {
                const file = acceptedFiles[0];
                const squareBlob = await createSquareImage(file);
                const squareFile = new File([squareBlob], file.name, { type: 'image/jpeg' });
                setSelectedFile(squareFile);
                setPreviewUrl(URL.createObjectURL(squareFile));
            } catch (error) {
                console.error('Error creating square image:', error);
                const file = acceptedFiles[0];
                setSelectedFile(file);
                setPreviewUrl(URL.createObjectURL(file));
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
    });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!selectedFile) throw new Error('No file selected');

            const uniqueName = `${Date.now()}-${selectedFile.name}`;

            const response = await upload(uniqueName, selectedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });



            const res = await uploadImageFunction(response.url);

            if (res) {
                router.push('/puzzle');
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
            <div
                {...getRootProps()}
                className={`transition border border-dashed cursor-pointer rounded-xl p-7 lg:p-10
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          hover:border-blue-500 text-center`}
                aria-label="File upload area"
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
                        {/* ... your drag and drop placeholder content ... */}
                    </div>
                )}
            </div>

            {error && <p className="text-center text-red-500 font-medium">{error}</p>}

            {loading && <Loading />}

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
