import ShowAllImages from "@/components/ShowAllImages";
import { prisma } from "@/libs/prisma";
import Form from "./Form";
import { deletePuzzleImage, getAllPuzzleImages } from "./action";

export const dynamic = "force-dynamic";

export default async function PuzzleUploadPage({
  searchParams,
}: {
  searchParams?: Promise<{ coupleId?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedCoupleId = params.coupleId;

  const allImgs = await getAllPuzzleImages(selectedCoupleId);
  const couples = await prisma.couple.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="w-full h-screen overflow-hidden overflow-y-auto bg-pink-50 px-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl mt-[50px] shadow-lg p-6 xl:p-8 w-full max-w-7xl border border-rose-100 flex flex-col">
        <h1 className="text-3xl font-semibold text-rose-500 mb-4 text-center">
          Manage Couple Puzzle Images
        </h1>

        <div className="mb-5 flex gap-2 flex-wrap justify-center">
          {couples.map((couple) => (
            <a
              key={couple.id}
              href={`/backend/puzzle?coupleId=${couple.id}`}
              className={`px-3 py-1 rounded-full border text-sm ${
                couple.id === selectedCoupleId
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white text-rose-600 border-rose-200"
              }`}
            >
              {couple.name}
            </a>
          ))}
        </div>

        <div className="flex gap-8 md:flex-row flex-col flex-1 min-h-0">
          <div className="w-full md:w-1/2 xl:w-1/3">
            <Form targetCoupleId={selectedCoupleId} />
          </div>
          <div className="w-full hidden md:inline-block md:w-1/2 xl:w-2/3 max-h-[600px] overflow-y-auto rounded-lg p-4">
            {allImgs.length ? (
              <ShowAllImages allImgs={allImgs} deleteImg={deletePuzzleImage} />
            ) : (
              <p className="text-center text-gray-500">No images uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
