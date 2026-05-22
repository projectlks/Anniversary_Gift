import { resolveCoupleScope } from "@/libs/authz";
import { prisma } from "@/libs/prisma";
import {
  createJourneyEntryAction,
  deleteJourneyEntryAction,
  updateJourneyEntryAction,
} from "./action";

export const dynamic = "force-dynamic";

function toDateInput(value: Date) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export default async function JourneyAdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ coupleId?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const selectedCoupleId = params.coupleId;
  const { couple } = await resolveCoupleScope(selectedCoupleId);

  const [couples, entries] = await Promise.all([
    prisma.couple.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true },
    }),
    prisma.journeyEntry.findMany({
      where: { coupleId: couple.id },
      orderBy: [{ eventDate: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return (
    <main className="min-h-screen bg-rose-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-rose-700">Manage Journey</h1>

        <div className="flex gap-2 flex-wrap">
          {couples.map((item) => (
            <a
              key={item.id}
              href={`/backend/journey?coupleId=${item.id}`}
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

        <section className="bg-white border border-rose-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-rose-700 mb-3">Add Milestone</h2>
          <form action={createJourneyEntryAction} className="grid md:grid-cols-2 gap-3">
            <input type="hidden" name="coupleId" value={couple.id} />
            <input name="title" placeholder="Title" className="border rounded-xl px-3 py-2" required />
            <input name="eventDate" type="date" className="border rounded-xl px-3 py-2" required />
            <input name="sortOrder" type="number" defaultValue={0} className="border rounded-xl px-3 py-2" />
            <textarea name="description" placeholder="Description" className="border rounded-xl px-3 py-2 md:col-span-2" />
            <button className="md:col-span-2 bg-rose-500 text-white rounded-xl py-2 font-semibold">
              Add Entry
            </button>
          </form>
        </section>

        <section className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.id} className="bg-white border border-rose-200 rounded-2xl p-4">
              <form action={updateJourneyEntryAction} className="grid md:grid-cols-2 gap-3">
                <input type="hidden" name="entryId" value={entry.id} />
                <input type="hidden" name="coupleId" value={couple.id} />
                <input name="title" defaultValue={entry.title} className="border rounded-xl px-3 py-2" required />
                <input
                  name="eventDate"
                  type="date"
                  defaultValue={toDateInput(entry.eventDate)}
                  className="border rounded-xl px-3 py-2"
                  required
                />
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={entry.sortOrder}
                  className="border rounded-xl px-3 py-2"
                />
                <textarea
                  name="description"
                  defaultValue={entry.description ?? ""}
                  className="border rounded-xl px-3 py-2 md:col-span-2"
                />
                <div className="md:col-span-2 flex gap-2">
                  <button className="bg-rose-500 text-white rounded-xl px-4 py-2">Save</button>
                </div>
              </form>

              <form action={deleteJourneyEntryAction} className="mt-2">
                <input type="hidden" name="entryId" value={entry.id} />
                <input type="hidden" name="coupleId" value={couple.id} />
                <button className="text-red-600 border border-red-300 rounded-lg px-3 py-1 hover:bg-red-50">
                  Delete
                </button>
              </form>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
