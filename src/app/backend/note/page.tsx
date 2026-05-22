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
    <main className="min-h-screen bg-gray-50 px-4 py-8 md:py-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Manage Note
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Write or edit a special note for the selected couple.
          </p>
        </div>

        {/* Couple Selector */}
        <div className="flex flex-wrap justify-center gap-3">
          {couples.map((item) => (
            <a
              key={item.id}
              href={`/backend/note?coupleId=${item.id}`}
              className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                item.id === couple.id
                  ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                  : "bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50 hover:text-blue-600"
              }`}>
              {item.name}
            </a>
          ))}
        </div>

        {/* Note Editor Form */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
          <form action={saveLoveNoteAction} className="space-y-6">
            <input type="hidden" name="coupleId" value={couple.id} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Date Label
                </label>
                <input
                  name="dateLabel"
                  defaultValue={note?.dateLabel ?? ""}
                  placeholder="e.g. February 14th, 2024"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  name="title"
                  defaultValue={note?.title ?? "My Dearest Love,"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Greeting
              </label>
              <input
                name="greeting"
                defaultValue={note?.greeting ?? "My Dearest Love,"}
                className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Message Content
              </label>
              <textarea
                name="content"
                defaultValue={note?.content ?? ""}
                rows={8}
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Write your beautiful message here..."
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Closing
                </label>
                <input
                  name="closing"
                  defaultValue={note?.closing ?? "Forever and always yours,"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Signature
                </label>
                <input
                  name="signature"
                  defaultValue={note?.signature ?? "Your Beloved"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="pt-4 text-right">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:w-auto">
                Save Note
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
