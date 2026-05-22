// import { getAllImages } from "@/libs/action";
// import { prisma } from "@/libs/prisma";
// import { deleteImg } from "./action";
// import ImageUploadManager from "./ImageUploadManager";
// import type { GalleryImage } from "@/types/gallery-image";

// export const dynamic = "force-dynamic";

// export default async function RomanticAvatarUpload({
//   searchParams,
// }: {
//   searchParams?: Promise<{ coupleId?: string }>;
// }) {
//   const params = (await searchParams) ?? {};
//   const requestedCoupleId = params.coupleId;

//   const couples = await prisma.couple.findMany({
//     where: { isArchived: false },
//     orderBy: { createdAt: "asc" },
//     select: { id: true, name: true },
//   });

//   const selectedCouple = couples.find(
//     (couple) => couple.id === requestedCoupleId,
//   );
//   const selectedCoupleId = selectedCouple?.id ?? null;
//   const allImgs: GalleryImage[] = selectedCoupleId
//     ? (await getAllImages(selectedCoupleId)).map((image) => ({
//         ...image,
//         uploadedAt: image.uploadedAt.toISOString(),
//       }))
//     : [];

//   return (
//     <div className="flex h-screen w-full items-center justify-center overflow-hidden overflow-y-auto px-4">
//       {/* အရင် UI ပုံစံအတိုင်း Outer Card */}
//       <div className="mt-[50px] w-full max-w-7xl rounded-3xl border border-gray-200 bg-gray-50 p-2 duration-200 hover:border-blue-300 hover:bg-blue-50 md:p-4">
//         {/* အတွင်းဘက် Inner Card */}
//         <div className="flex h-full flex-col rounded-2xl border border-[#F2F4F7] bg-white p-6 shadow-sm md:p-8">
//           <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900 md:text-3xl">
//             Manage Couple Memories
//           </h1>

//           <div className="mb-8 space-y-4">
//             <div className="flex flex-wrap justify-center gap-2">
//               {couples.map((couple) => (
//                 <a
//                   key={couple.id}
//                   href={`/backend/imagesUpload?coupleId=${couple.id}`}
//                   className={`rounded-xl border px-4 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
//                     couple.id === selectedCoupleId
//                       ? "border-blue-600 bg-blue-600 text-white shadow-sm"
//                       : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
//                   }`}>
//                   {couple.name}
//                 </a>
//               ))}
//             </div>

//             {!selectedCoupleId && (
//               <p className="text-center text-sm font-medium text-gray-500">
//                 Please select a couple before uploading images.
//               </p>
//             )}
//           </div>

//           <div className="flex-1">
//             <ImageUploadManager
//               key={selectedCoupleId ?? "no-couple"}
//               initialImages={allImgs}
//               targetCoupleId={selectedCoupleId}
//               deleteImg={deleteImg}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { getAllImages } from "@/libs/action";
import { prisma } from "@/libs/prisma";
import { deleteImg } from "./action";
import ImageUploadManager from "./ImageUploadManager";
import type { GalleryImage } from "@/types/gallery-image";

export const dynamic = "force-dynamic";

export default async function RomanticAvatarUpload({
  searchParams,
}: {
  searchParams?: Promise<{ coupleId?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const requestedCoupleId = params.coupleId;

  // DB မှ Couple Data များ ဆွဲယူခြင်း
  const couples = await prisma.couple.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  const selectedCouple = couples.find(
    (couple) => couple.id === requestedCoupleId,
  );
  const selectedCoupleId = selectedCouple?.id ?? null;

  const allImgs: GalleryImage[] = selectedCoupleId
    ? (await getAllImages(selectedCoupleId)).map((image) => ({
        ...image,
        uploadedAt: image.uploadedAt.toISOString(),
      }))
    : [];

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 px-4 py-8 md:py-12">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Gallery Management
          </h1>
          <p className="mt-2 text-sm text-gray-500 md:text-base">
            Select a couple below to organize and upload their romantic
            memories.
          </p>
        </div>

        {/* Couple Selector (Navigation Pills) */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {couples.map((couple) => {
            const isSelected = couple.id === selectedCoupleId;
            return (
              <a
                key={couple.id}
                href={`/backend/imagesUpload?coupleId=${couple.id}`}
                className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-600"
                    : "bg-white text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 hover:text-blue-600"
                }`}>
                {couple.name}
              </a>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-8">
          {selectedCoupleId ? (
            // Couple ရွေးထားပြီးပါက ပြသမည့် Component
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  <span className="text-blue-600">
                    {selectedCouple?.name}&apos;s
                  </span>{" "}
                  Collection
                </h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                  {allImgs.length} Images
                </span>
              </div>
              <ImageUploadManager
                key={selectedCoupleId}
                initialImages={allImgs}
                targetCoupleId={selectedCoupleId}
                deleteImg={deleteImg}
              />
            </div>
          ) : (
            // Couple မရွေးရသေးပါက ပြသမည့် Locked/Empty State
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center transition-colors hover:border-gray-300 hover:bg-gray-50">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Action Required
              </h3>
              <p className="max-w-sm text-sm text-gray-500">
                Please select a couple from the options above to unlock the
                upload tool and view their image gallery.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}