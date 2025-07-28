'use client';

import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { uploadImageFunction } from './action';
import ImageUploadForm from '@/components/ImageUploadForm';


export default function ImgUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);


  const router = useRouter();


  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }, []);


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
    <ImageUploadForm onDrop={onDrop} error={error} loading={loading} handleSubmit={handleSubmit} previewUrl={previewUrl} />
  );
}
