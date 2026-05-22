// "use client";

// import { useState } from "react";
// import ShowAllImages from "@/components/ShowAllImages";
// import type { GalleryImage } from "@/types/gallery-image";
// import ImageUploadForm from "./Form";

// type ImageUploadManagerProps = {
//   initialImages: GalleryImage[];
//   targetCoupleId: string | null;
//   deleteImg: (id: number) => Promise<boolean>;
// };

// export default function ImageUploadManager({
//   initialImages,
//   targetCoupleId,
//   deleteImg,
// }: ImageUploadManagerProps) {
//   const [images, setImages] = useState<GalleryImage[]>(initialImages);

//   const handleImageQueued = (image: GalleryImage) => {
//     setImages((prev) => [image, ...prev]);
//   };

//   const handleImageSaved = (tempId: number, savedImage: GalleryImage | null) => {
//     setImages((prev) => {
//       if (!savedImage) {
//         return prev.filter((image) => image.id !== tempId);
//       }

//       return prev.map((image) => (image.id === tempId ? savedImage : image));
//     });
//   };

//   return (
//     <div className="flex gap-8 md:flex-row flex-col flex-1 min-h-0">
//       <div className="w-full md:w-1/2 xl:w-1/3">
//         <ImageUploadForm
//           targetCoupleId={targetCoupleId}
//           onImageQueued={handleImageQueued}
//           onImageSaved={handleImageSaved}
//         />
//       </div>

//       <div className="w-full hidden md:inline-block md:w-1/2 xl:w-2/3 max-h-[600px] overflow-y-auto rounded-lg p-4">
//         {images.length ? (
//           <ShowAllImages
//             allImgs={images}
//             deleteImg={deleteImg}
//             onImagesChange={setImages}
//           />
//         ) : targetCoupleId ? (
//           <p className="text-center text-gray-500">No images uploaded yet.</p>
//         ) : (
//           <p className="text-center text-gray-500">
//             Select a couple to view uploaded images.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import ShowAllImages from "@/components/ShowAllImages";
import type { GalleryImage } from "@/types/gallery-image";
import ImgUploadForm from "./Form";
// import ImgUploadForm from "./ImgUploadForm"; // Import path ကို သင့် project အတိုင်း ပြင်ပါ

type ImageUploadManagerProps = {
  initialImages: GalleryImage[];
  targetCoupleId: string | null;
  deleteImg: (id: number) => Promise<boolean>;
};

export default function ImageUploadManager({
  initialImages,
  targetCoupleId,
  deleteImg,
}: ImageUploadManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);

  const handleImageQueued = (image: GalleryImage) => {
    setImages((prev) => [image, ...prev]);
  };

  const handleImageSaved = (
    tempId: number,
    savedImage: GalleryImage | null,
  ) => {
    setImages((prev) => {
      if (!savedImage) {
        return prev.filter((image) => image.id !== tempId);
      }
      return prev.map((image) => (image.id === tempId ? savedImage : image));
    });
  };

  return (
    <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
      {/* Upload Form Section (Sticky on Desktop) */}
      <div className="md:sticky md:top-4 md:col-span-5 xl:col-span-4">
        <ImgUploadForm
          targetCoupleId={targetCoupleId}
          onImageQueued={handleImageQueued}
          onImageSaved={handleImageSaved}
        />
      </div>

      {/* Image Gallery Section */}
      <div className="min-h-[400px] rounded-xl bg-white md:col-span-7 xl:col-span-8">
        {images.length > 0 ? (
          <ShowAllImages
            allImgs={images}
            deleteImg={deleteImg}
            onImagesChange={setImages}
          />
        ) : (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
            <svg
              className="mb-4 h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <h3 className="text-sm font-medium text-gray-900">
              No memories yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload their first photo to start building the gallery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}