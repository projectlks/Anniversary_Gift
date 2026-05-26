import { LockClosedIcon } from "@heroicons/react/24/outline";
import { resolveCoupleScope } from "@/libs/authz";
import SurpriseReveal from "./SurpriseReveal";

export default async function AnniversarySpecialPage() {
  const { couple } = await resolveCoupleScope();

  if (!couple.startDate) return <div>Date မရှိပါ</div>;

  // 🌟 ၁။ Database ထဲက အချိန် (Start Date) ကို ယူပါမည်
  const startDate = new Date(couple.startDate);

  // 🌟 ၂။ လက်ရှိ အချိန်နဲ့ လက်ရှိ နှစ် (Current Year) ကို ယူပါမည်
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // 🌟 ၃။ Target Date ကို "ဒီနှစ် (Current Year) ၏ Anniversary အချိန်" အဖြစ် သတ်မှတ်ပါမည်
  const targetDate = new Date(startDate);
  targetDate.setFullYear(currentYear); // ဥပမာ - ၂၀၂၀ ကို ဒီနှစ်ခုနှစ် (၂၀၂၄၊ ၂၀၂၅၊ ၂၀၂၆ စသဖြင့်) သို့ အလိုလို ပြောင်းပေးပါမည်

  // 🌟 ၄။ စက္ကန့်အထိ အတိအကျ တိုက်စစ်ပါမည်
  const isUnlocked = currentDate.getTime() >= targetDate.getTime();

  // ❌ ဒီနှစ်၏ Anniversary အချိန်အတိအကျ မရောက်သေးလျှင် (Lock မျက်နှာပြင်)
  if (!isUnlocked) {
    const unlockDateString = targetDate.toLocaleDateString("en-GB", {
      timeZone: "Asia/Yangon",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const unlockTimeString = targetDate.toLocaleTimeString("en-US", {
      timeZone: "Asia/Yangon",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-stone-900 text-white px-4 text-center">
        <LockClosedIcon className="h-16 w-16 text-stone-500 mb-6 animate-pulse" />
        <h1 className="text-2xl font-bold mb-2 tracking-wide">
          Secret Surprise 🤫
        </h1>
        <p className="text-stone-400 mt-2 leading-relaxed">
          ဒီလက်ဆောင်လေးက <br />
          <span className="text-pink-400 font-semibold">
            {unlockDateString}
          </span>{" "}
          <br />
          အချိန်{" "}
          <span className="text-pink-400 font-semibold">
            {unlockTimeString}
          </span>{" "}
          <br />
          တိတိရောက်မှ ပွင့်လာမှာပါ။
        </p>
      </div>
    );
  }

  // ✅ အချိန်ရောက်သွားလျှင် (ဒီနှစ်ကုန်အထိ အမြဲတမ်း ပွင့်နေပါမည်)
  return (
    <SurpriseReveal
      videoUrl={couple.surpriseVideoUrl}
      startDate={couple.startDate}
    />
  );
}
