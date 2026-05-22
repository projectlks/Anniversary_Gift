// "use client";
// import Image from "next/image";
// import Loading from "@/components/Loading";
// import type { GalleryImage } from "@/types/gallery-image";
// import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

// interface Props {
//   allImgs: GalleryImage[];
//   deleteImg: (id: number) => Promise<boolean>
//   onImagesChange?: Dispatch<SetStateAction<GalleryImage[]>>
// }

// export default function ShowAllImages({ allImgs, deleteImg, onImagesChange }: Props) {

//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [localImages, setLocalImages] = useState<GalleryImage[]>(allImgs);
//   const images = onImagesChange ? allImgs : localImages;
//   const setImages = onImagesChange ?? setLocalImages;

//   useEffect(() => {
//     if (!onImagesChange) {
//       setLocalImages(allImgs);
//     }
//   }, [allImgs, onImagesChange]);

//   const handleDelete = async (id: number) => {
//     if (id < 0) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const res = await deleteImg(id);
//       if (res) {
//         setImages((prev) => prev.filter((img) => img.id !== id));
//       }
//     } catch (error) {
//       setError("Failed to delete image. Please try again.");
//       console.error("Error deleting image:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
//       {error && (
//         <div className="col-span-2 text-red-500 text-center">{error}</div>
//       )}
//       {loading && <Loading />}

//       {images.map((img) => (
//         <div
//           key={img.id}
//           className="relative rounded-lg overflow-hidden shadow-md group"
//         >
//           <Image
//             src={img.imgUrl}
//             alt="Uploaded"
//             width={300}
//             height={200}
//             className="object-cover w-full h-full"
//           />
//           <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm text-gray-700">
//             {new Date(img.uploadedAt).toLocaleDateString()}
//           </div>

//           {img.isPending && (
//             <div className="absolute top-2 left-2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-rose-500">
//               Saving...
//             </div>
//           )}

//           {/* Delete overlay and button */}
//           <div className="absolute inset-0 hidden group-hover:flex items-center justify-center  transition-all">
//             <div className="absolute inset-0 bg-black opacity-50"></div>
//             <button
//               type="button"
//               onClick={() => handleDelete(img.id)}
//               disabled={loading || img.isPending}
//               className="bg-gray-100 hover:bg-gray-200 z-20 text-red-500 cursor-pointer rounded-full p-1 w-12 h-12 flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60"
//               aria-label="Delete image"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="size-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
//                     c.342.052.682.107 1.022.166m-1.022-.165L18.16
//                     19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25
//                     2.25 0 0 1-2.244-2.077L4.772
//                     5.79m14.456 0a48.108 48.108 0 0
//                     0-3.478-.397m-12 .562c.34-.059.68-.114
//                     1.022-.165m0 0a48.11 48.11 0 0 1
//                     3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
//                     51.964 0 0 0-3.32 0c-1.18.037-2.09
//                     1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

"use client";
import Image from "next/image";
import Loading from "@/components/Loading";
import type { GalleryImage } from "@/types/gallery-image";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

interface Props {
  allImgs: GalleryImage[];
  deleteImg: (id: number) => Promise<boolean>;
  onImagesChange?: Dispatch<SetStateAction<GalleryImage[]>>;
}

export default function ShowAllImages({
  allImgs,
  deleteImg,
  onImagesChange,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [localImages, setLocalImages] = useState<GalleryImage[]>(allImgs);
  const images = onImagesChange ? allImgs : localImages;
  const setImages = onImagesChange ?? setLocalImages;

  useEffect(() => {
    if (!onImagesChange) {
      setLocalImages(allImgs);
    }
  }, [allImgs, onImagesChange]);

  const handleDelete = async (id: number) => {
    if (id < 0) return;

    setLoading(true);
    setError(null);
    try {
      const res = await deleteImg(id);
      if (res) {
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    } catch (error) {
      setError("Failed to delete image. Please try again.");
      console.error("Error deleting image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 ">
      {error && (
        <div className="col-span-full rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}
      {loading && (
        <div className="col-span-full py-4 flex justify-center">
          <Loading />
        </div>
      )}

      {images.map((img) => (
        <div
          key={img.id}
          className="group relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200/50 transition-shadow hover:shadow-md">
          <Image
            src={img.imgUrl}
            alt="Couple Memory"
            width={400}
            height={300}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={img.isPending || img.imgUrl.includes("drive.google.com")}
          />

          {/* Bottom Gradient for Date Readability */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 pt-12">
            <span className="text-xs font-medium tracking-wide text-white/90 drop-shadow-sm">
              {new Date(img.uploadedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Pending Status Badge */}
          {img.isPending && (
            <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-medium tracking-wide text-blue-600 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Saving
            </div>
          )}

          {/* Elegant Delete Button (Visible on Hover) */}
          <button
            type="button"
            onClick={() => handleDelete(img.id)}
            disabled={loading || img.isPending}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 -translate-y-2 items-center justify-center rounded-full bg-white/90 text-gray-400 opacity-0 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-red-50 hover:text-red-600 group-hover:translate-y-0 group-hover:opacity-100 disabled:pointer-events-none"
            aria-label="Delete image">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
