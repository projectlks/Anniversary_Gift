import BackButton from "@/components/BackButton";
import CircularText from "@/components/CircularText";
import FallingPetals from "./FallingPetals";
import MagicTouch from "./MagicTouch";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      {/* Client Component ဖြစ်သော ခလုတ်ကိုသာ သီးသန့် လှမ်းခေါ်ထားပါသည် */}
      <BackButton />
      {/* 🌟 နှင်းဆီပွင့်ဖတ်လေးများ ကြွေကျမည့် နေရာ (ဒီမှာ ထည့်လိုက်ပါ) */}
      <FallingPetals />
      <MagicTouch />

      <div className="fixed bottom-5 md:block hidden right-5 z-1">
        <CircularText
          // text="FOREVER*YOU*AND*ME*"
          text="YOU*ARE*MY*EVERYTHING*"
          // text="REACT*BITS*COMPONENTS*"
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />
      </div>

      <div className="relative z-0 min-h-screen">{children}</div>
    </div>
  );
}

