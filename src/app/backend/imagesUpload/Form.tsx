// 'use client';

// import { useState } from 'react';
// import { uploadImageFunction } from './action';
// import ImageUpload from '@/components/ImageUpload';
// import type { GalleryImage } from '@/types/gallery-image';

// type ImgUploadFormProps = {
//   targetCoupleId: string | null;
//   onImageQueued: (image: GalleryImage) => void;
//   onImageSaved: (tempId: number, savedImage: GalleryImage | null) => void;
// };

// export default function ImgUploadForm({
//   targetCoupleId,
//   onImageQueued,
//   onImageSaved,
// }: ImgUploadFormProps) {
//   const [error, setError] = useState<string | null>(null);
//   const [saving, setSaving] = useState(false);

//   const handleFileSelected = async (file: File) => {
//     setSaving(true);
//     setError(null);
//     let previewUrl: string | null = null;

//     try {
//       if (!targetCoupleId) {
//         throw new Error('Please select a couple before uploading.');
//       }

//       previewUrl = URL.createObjectURL(file);
//       const tempId = -Date.now();
//       onImageQueued({
//         id: tempId,
//         coupleId: targetCoupleId,
//         createdById: null,
//         imgUrl: previewUrl,
//         uploadedAt: new Date().toISOString(),
//         isArchived: false,
//         isPending: true,
//       });

//       const formData = new FormData();
//       formData.append('file', file);

//       const savedImage = await uploadImageFunction(formData, targetCoupleId);

//       if (!savedImage) {
//         onImageSaved(tempId, null);
//         setError('Failed to save image to database.');
//         return;
//       }

//       onImageSaved(tempId, savedImage);
//     } catch (err) {
//       const message = err instanceof Error ? err.message : 'Something went wrong.';
//       setError(message);
//     } finally {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
//       <div>
//         <h3 className="text-base font-semibold text-gray-900">Upload memory photo</h3>
//         <p className="mt-1 text-sm text-gray-500">
//           Choose a couple first, then upload a JPG, PNG, or WebP photo.
//         </p>
//       </div>

//       <ImageUpload
//         onFileSelected={handleFileSelected}
//         disabled={!targetCoupleId || saving}
//         buttonText={saving ? 'Saving...' : 'Upload Photo'}
//         className="w-full justify-center"
//       />

//       {!targetCoupleId && (
//         <p className="rounded-lg bg-gray-100 p-3 text-center text-sm font-medium text-gray-600">
//           Choose a couple first to enable image upload.
//         </p>
//       )}

//       {error && (
//         <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 ring-1 ring-red-100">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { uploadImageFunction } from "./action";
import ImageUpload from "@/components/ImageUpload";
import type { GalleryImage } from "@/types/gallery-image";
// 🌟 Package ကို Import လုပ်ထားပါသည်
import imageCompression from "browser-image-compression";

type ImgUploadFormProps = {
  targetCoupleId: string | null;
  onImageQueued: (image: GalleryImage) => void;
  onImageSaved: (tempId: number, savedImage: GalleryImage | null) => void;
};

export default function ImgUploadForm({
  targetCoupleId,
  onImageQueued,
  onImageSaved,
}: ImgUploadFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileSelected = async (file: File) => {
    setSaving(true);
    setError(null);
    let previewUrl: string | null = null;

    try {
      if (!targetCoupleId) {
        throw new Error("Please select a couple before uploading.");
      }

      // 🌟 ၁။ ပုံအရွယ်အစားကို Quality မကျဘဲ ချုံ့ပါမည် (Compression)
      const options = {
        maxSizeMB: 1.5, // 1.5 MB အောက်သို့ ချုံ့မည်
        maxWidthOrHeight: 1920, // Full HD အရည်အသွေး
        useWebWorker: true, // Browser မလေးစေရန် WebWorker သုံးမည်
      };

      const compressedFile = await imageCompression(file, options);

      // 🌟 ၂။ ချုံ့ပြီးသား ပုံလေးဖြင့် Preview ပြမည်
      previewUrl = URL.createObjectURL(compressedFile);
      const tempId = -Date.now();
      onImageQueued({
        id: tempId,
        coupleId: targetCoupleId,
        createdById: null,
        imgUrl: previewUrl,
        uploadedAt: new Date().toISOString(),
        isArchived: false,
        isPending: true,
      });

      // 🌟 ၃။ ချုံ့ပြီးသား ပုံလေးကိုမှ Backend သို့ ပို့ပါမည်
      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);

      const savedImage = await uploadImageFunction(formData, targetCoupleId);

      if (!savedImage) {
        onImageSaved(tempId, null);
        setError("Failed to save image to database.");
        return;
      }

      onImageSaved(tempId, savedImage);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-base font-semibold text-gray-900">
          Upload memory photo
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose a couple first, then upload a JPG, PNG, or WebP photo.
        </p>
      </div>

      <ImageUpload
        onFileSelected={handleFileSelected}
        disabled={!targetCoupleId || saving}
        buttonText={saving ? "Compressing & Saving..." : "Upload Photo"}
        className="w-full justify-center"
      />

      {!targetCoupleId && (
        <p className="rounded-lg bg-gray-100 p-3 text-center text-sm font-medium text-gray-600">
          Choose a couple first to enable image upload.
        </p>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600 ring-1 ring-red-100">
          {error}
        </p>
      )}
    </div>
  );
}