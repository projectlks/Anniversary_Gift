"use client";
import Image from "next/image";
import Loading from "@/components/Loading";
import { UploadedImage } from "@prisma/client";
import { useState } from "react";




interface Props {
  allImgs: UploadedImage[];
  deleteImg: (id: number) => Promise<boolean>


}

export default function ShowAllImages({ allImgs, deleteImg }: Props) {


  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<UploadedImage[]>(allImgs);




  const handleDelete = async (id: number) => {
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
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
      {error && (
        <div className="col-span-2 text-red-500 text-center">{error}</div>
      )}
      {loading && <Loading />}

      {images.map((img) => (
        <div
          key={img.id}
          className="relative rounded-lg overflow-hidden shadow-md group"
        >
          <Image
            src={img.imgUrl}
            alt="Uploaded"
            width={300}
            height={200}
            className="object-cover w-full h-full"
          />
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm text-gray-700">
            {new Date(img.uploadedAt).toLocaleDateString()}
          </div>

          {/* Delete overlay and button */}
          <div className="absolute inset-0 hidden group-hover:flex items-center justify-center  transition-all">
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <button
              type="button"
              onClick={() => handleDelete(img.id)}
              className="bg-gray-100 hover:bg-gray-200 z-20 text-red-500 cursor-pointer rounded-full p-1 w-12 h-12 flex items-center justify-center"
              aria-label="Delete image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21
                    c.342.052.682.107 1.022.166m-1.022-.165L18.16
                    19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25
                    2.25 0 0 1-2.244-2.077L4.772
                    5.79m14.456 0a48.108 48.108 0 0
                    0-3.478-.397m-12 .562c.34-.059.68-.114
                    1.022-.165m0 0a48.11 48.11 0 0 1
                    3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                    51.964 0 0 0-3.32 0c-1.18.037-2.09
                    1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
