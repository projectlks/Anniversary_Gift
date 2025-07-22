// export const dynamic = "force-dynamic";
import { getAllImages } from '@/libs/action';
import ImageUploadForm from './ImgUploadForm';
import ShowAllImages from './ShowAllImages';
import { Suspense } from "react";

interface UploadedImage {
  id: number;
  imgUrl: string;
  uploadedAt: Date;
  isArchived: boolean;
}

export default async function RomanticAvatarUpload() {
  const allImgs: UploadedImage[] = await getAllImages();

  if (!allImgs) return null;

  return (
    <div className="w-full h-screen overflow-hidden bg-pink-50 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-7xl border border-rose-100 flex flex-col">
        <h1 className="text-3xl font-semibold text-rose-500 mb-6 text-center">
          Upload Your Lovely Photo 💖
        </h1>
        <div className="flex gap-8 xl:flex-row flex-col flex-1 min-h-0">
          <div className="w-1/3">
            <Suspense fallback={<>Loading...</>}>

              <ImageUploadForm />
            </Suspense>
          </div>
          <div className="w-2/3 max-h-[600px] overflow-y-auto rounded-lg p-4">
            {allImgs.length ? (
              <Suspense fallback={<>Loading...</>}>

                <ShowAllImages allImgs={allImgs} />
              </Suspense>
            ) : (
              <p className="text-center text-gray-500">No images uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
