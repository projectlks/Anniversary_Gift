// app/memory/page.tsx (သို့မဟုတ် သင်အသုံးပြုလိုသော နေရာ)
import { getAllImages } from "@/libs/action";
import { resolveCoupleScope } from "@/libs/authz";
import MemoryGameClient from "./MemoryGameClient";

export default async function MemoryGamePage() {
  // DB မှ Couple Data ကိုယူမည်
  const { couple } = await resolveCoupleScope();

  // DB မှ ပုံများကိုယူမည် (URL များကိုသာ သီးသန့်ထုတ်ယူမည်)
  const dbImages = await getAllImages(couple.id);
  const images = dbImages.map((image) => image.imgUrl);

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-[#FAFAF9] text-stone-800">
      {/* Ambient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] top-[-10%] h-[50vh] w-[50vh] rounded-full bg-rose-200/40 blur-[100px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[60vh] w-[60vh] rounded-full bg-emerald-100/40 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full">
        {/* 🌟 DB ကရလာတဲ့ ပုံတွေကို Prop အနေနဲ့ ထည့်ပေးလိုက်ပါပြီ */}
        <MemoryGameClient dbImages={images} />
      </div>
    </main>
  );
}
