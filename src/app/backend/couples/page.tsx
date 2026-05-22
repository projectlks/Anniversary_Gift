import { prisma } from "@/libs/prisma";

import CouplesTable from "./components/CouplesTable";
import CreateCoupleModal from "./components/CreateCoupleModal";
import ManageCoupleModal from "./components/ManageCoupleModal";
import type { CouplesSearchParams } from "./types";

export const dynamic = "force-dynamic";

type CouplesAdminPageProps = {
  searchParams?: Promise<CouplesSearchParams>;
};

export default async function CouplesAdminPage({
  searchParams: searchParamsPromise,
}: CouplesAdminPageProps) {
  const searchParams = await searchParamsPromise;
  const action = searchParams?.action;
  const targetId = searchParams?.id;

  const showNewModal = action === "new";
  const showManageModal = action === "manage" && typeof targetId === "string";

  // Keep route-level data loading here so child components can stay stateless and focused on UI.
  const couples = await prisma.couple.findMany({
    where: { isArchived: false },
    orderBy: { createdAt: "asc" },
    include: {
      members: {
        orderBy: { invitedAt: "asc" },
      },
    },
  });

  const activeCouple = showManageModal
    ? couples.find((couple) => couple.id === targetId)
    : null;

  return (
    <main className="min-h-screen bg-[#F9FAFB] p-4 font-sans dark:bg-gray-900 md:p-8">
      <div className="container mx-auto">
        <CouplesTable couples={couples} />
        {showNewModal && <CreateCoupleModal />}
        {showManageModal && activeCouple && (
          <ManageCoupleModal couple={activeCouple} />
        )}
      </div>
    </main>
  );
}
