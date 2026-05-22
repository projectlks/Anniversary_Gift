"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back();

    // 🌟 Real-world UX: Page ကူးသွားတာနဲ့ အပေါ်ဆုံးကို ချက်ချင်း (Instant) ရောက်နေစေမည်
    setTimeout(() => {
      window.scrollTo(0, 0);
      // မှတ်ချက်: window.scrollTo(0, 0) သည် { top: 0, behavior: "auto" } နှင့် အတူတူပင် ဖြစ်ပါသည်။
    }, 100);
  };

  return (
    <button
      onClick={handleBack}
      className="fixed top-5 left-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-stone-200/50 text-stone-700 shadow-sm backdrop-blur-md hover:bg-stone-300/50 transition"
      aria-label="Go back">
      <ArrowLeftIcon className="h-5 w-5" />
    </button>
  );
}
