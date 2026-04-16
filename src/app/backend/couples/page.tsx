import { prisma } from "@/libs/prisma";
import {
  archiveCoupleAction,
  createCoupleAction,
  inviteMemberAction,
  updateLimitsAction,
  updatePasscodeAction,
} from "./action";

export const dynamic = "force-dynamic";

export default async function CouplesAdminPage() {
  const couples = await prisma.couple.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "asc" },
    include: {
      members: {
        orderBy: { invitedAt: "asc" },
      },
    },
  });

  return (
    <main className="min-h-screen bg-rose-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-rose-700">Couple Management</h1>

        <section className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-rose-700 mb-4">Create New Couple</h2>
          <form action={createCoupleAction} className="grid md:grid-cols-2 gap-4">
            <input name="name" placeholder="Couple name" className="border rounded-xl px-3 py-2" required />
            <input
              name="passcode"
              placeholder="6-digit passcode"
              className="border rounded-xl px-3 py-2"
              minLength={4}
              required
            />
            <input name="ownerEmail" type="email" placeholder="Owner email" className="border rounded-xl px-3 py-2" required />
            <input name="partnerEmail" type="email" placeholder="Partner email (optional)" className="border rounded-xl px-3 py-2" />
            <input name="startDate" type="date" className="border rounded-xl px-3 py-2" />
            <input name="maxMemories" type="number" min={1} defaultValue={120} className="border rounded-xl px-3 py-2" />
            <input name="maxPuzzleImages" type="number" min={1} defaultValue={30} className="border rounded-xl px-3 py-2" />
            <button className="md:col-span-2 bg-rose-500 text-white rounded-xl py-2 font-semibold">
              Create Couple
            </button>
          </form>
        </section>

        <section className="space-y-5">
          {couples.map((couple) => (
            <article key={couple.id} className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-xl font-semibold text-rose-700">{couple.name}</h3>
                <span className="text-sm text-gray-600">Slug: {couple.slug}</span>
              </div>

              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <form action={inviteMemberAction} className="space-y-2 border rounded-xl p-3">
                  <input type="hidden" name="coupleId" value={couple.id} />
                  <h4 className="font-semibold text-gray-700">Invite Member</h4>
                  <input name="email" type="email" placeholder="email" className="w-full border rounded-lg px-2 py-1" required />
                  <select name="role" className="w-full border rounded-lg px-2 py-1">
                    <option value="PARTNER">Partner</option>
                    <option value="OWNER">Owner</option>
                  </select>
                  <button className="w-full bg-rose-500 text-white rounded-lg py-1">Invite</button>
                </form>

                <form action={updatePasscodeAction} className="space-y-2 border rounded-xl p-3">
                  <input type="hidden" name="coupleId" value={couple.id} />
                  <h4 className="font-semibold text-gray-700">Reset Passcode</h4>
                  <input
                    name="passcode"
                    placeholder="new passcode"
                    className="w-full border rounded-lg px-2 py-1"
                    minLength={4}
                    required
                  />
                  <button className="w-full bg-rose-500 text-white rounded-lg py-1">Update Passcode</button>
                </form>

                <form action={updateLimitsAction} className="space-y-2 border rounded-xl p-3">
                  <input type="hidden" name="coupleId" value={couple.id} />
                  <h4 className="font-semibold text-gray-700">Storage Limits</h4>
                  <input
                    name="maxMemories"
                    type="number"
                    min={1}
                    defaultValue={couple.maxMemories}
                    className="w-full border rounded-lg px-2 py-1"
                  />
                  <input
                    name="maxPuzzleImages"
                    type="number"
                    min={1}
                    defaultValue={couple.maxPuzzleImages}
                    className="w-full border rounded-lg px-2 py-1"
                  />
                  <button className="w-full bg-rose-500 text-white rounded-lg py-1">Update Limits</button>
                </form>
              </div>

              <div className="mt-4 p-3 border rounded-xl">
                <h4 className="font-semibold text-gray-700 mb-2">Members</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  {couple.members.map((member) => (
                    <p key={member.id}>
                      {member.email} - {member.role} - {member.status}
                    </p>
                  ))}
                </div>
              </div>

              <form action={archiveCoupleAction} className="mt-4">
                <input type="hidden" name="coupleId" value={couple.id} />
                <button className="text-red-600 border border-red-300 rounded-lg px-4 py-1 hover:bg-red-50">
                  Archive Couple
                </button>
              </form>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

