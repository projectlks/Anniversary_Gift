import { resolveCoupleScope } from "@/libs/authz";
import { prisma } from "@/libs/prisma";
import { saveLoveNoteAction } from "./action";

export const dynamic = "force-dynamic";

export default async function NoteAdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ coupleId?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedCoupleId = params.coupleId;
  const { couple } = await resolveCoupleScope(selectedCoupleId);

  const [couples, note] = await Promise.all([
    prisma.couple.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
    prisma.loveNote.findUnique({ where: { coupleId: couple.id } }),
  ]);

  return (
    <main className="min-h-screen bg-rose-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-rose-700">Manage Love Note</h1>

        <div className="flex gap-2 flex-wrap">
          {couples.map((item) => (
            <a
              key={item.id}
              href={`/backend/note?coupleId=${item.id}`}
              className={`px-3 py-1 rounded-full border text-sm ${
                item.id === couple.id
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-white text-rose-600 border-rose-200"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>

        <form action={saveLoveNoteAction} className="bg-white border border-rose-200 rounded-2xl p-6 space-y-4">
          <input type="hidden" name="coupleId" value={couple.id} />

          <input
            name="dateLabel"
            defaultValue={note?.dateLabel ?? ""}
            placeholder="February 14th, 2024"
            className="w-full border rounded-xl px-3 py-2"
          />
          <input
            name="title"
            defaultValue={note?.title ?? "My Dearest Love,"}
            className="w-full border rounded-xl px-3 py-2"
            required
          />
          <input
            name="greeting"
            defaultValue={note?.greeting ?? "My Dearest Love,"}
            className="w-full border rounded-xl px-3 py-2"
            required
          />
          <textarea
            name="content"
            defaultValue={note?.content ?? ""}
            rows={10}
            className="w-full border rounded-xl px-3 py-2"
            required
          />
          <input
            name="closing"
            defaultValue={note?.closing ?? "Forever and always yours,"}
            className="w-full border rounded-xl px-3 py-2"
            required
          />
          <input
            name="signature"
            defaultValue={note?.signature ?? "Your Beloved"}
            className="w-full border rounded-xl px-3 py-2"
            required
          />

          <button className="bg-rose-500 text-white rounded-xl px-5 py-2 font-semibold">
            Save Note
          </button>
        </form>
      </div>
    </main>
  );
}
