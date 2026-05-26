import { resolveCoupleScope } from "@/libs/authz"; // 🌟 အစ်ကို့ရဲ့ Auth function
import { prisma } from "@/libs/prisma";
import FigJamBoard from "./FigJamBoard";


export default async function NotesPage() {
  // (၁) လက်ရှိ Login ဝင်ထားတဲ့ Couple ကို ဆွဲထုတ်ပါမည်
  const { couple } = await resolveCoupleScope();

  // (၂) ရလာတဲ့ couple.id ကိုသုံးပြီး Database ထဲက Notes တွေကို ရှာပါမည်
  const dbNotes = await prisma.shortNote.findMany({
    where: { coupleId: couple.id },
  });

  return (
    <main>
      {/* (၃) couple.id အစစ်နဲ့ dbNotes တွေကို Board ဆီ လှမ်းပို့ပေးပါမည် */}
      <FigJamBoard coupleId={couple.id} initialNotes={dbNotes} />
    </main>
  );
}