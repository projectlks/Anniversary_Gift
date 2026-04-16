'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { uploadImageFunction } from './action';
import ImageUploadForm from '@/components/ImageUploadForm';


export default function ImgUploadForm({ targetCoupleId }: { targetCoupleId?: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const router = useRouter();

  const createOptimizedImage = useCallback((file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new globalThis.Image();
      img.onload = () => {
        const maxSize = 1600;
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Cannot get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Image compression failed'));
              return;
            }
            resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
          },
          'image/jpeg',
          0.82,
        );
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  }, []);


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      try {
        const file = acceptedFiles[0];
        const optimized = await createOptimizedImage(file);
        setSelectedFile(optimized);
        setPreviewUrl(URL.createObjectURL(optimized));
      } catch (error) {
        console.error('Compression error, using original file:', error);
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  }, [createOptimizedImage]);


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

      const res = await uploadImageFunction(response.url, targetCoupleId);

      if (res) {
        const nextPath = targetCoupleId
          ? `/backend/imagesUpload?coupleId=${targetCoupleId}`
          : '/backend/imagesUpload';
        router.push(nextPath);
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
    <ImageUploadForm onDrop={onDrop} error={error} loading={loading} handleSubmit={handleSubmit} previewUrl={previewUrl} />
  );
}
