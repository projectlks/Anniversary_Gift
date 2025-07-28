"use client"

import ImageUploadForm from '@/components/ImageUploadForm'
import { upload } from '@vercel/blob/client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { uploadImageFunction } from './action';

export default function Form() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
        <ImageUploadForm error={error} onDrop={onDrop} loading={loading} handleSubmit={handleSubmit} previewUrl={previewUrl} />

    )
}
