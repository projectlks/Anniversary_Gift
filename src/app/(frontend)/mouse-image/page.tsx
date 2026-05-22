import { getAllImages } from "@/libs/action";
import { FiMousePointer } from "react-icons/fi";
// import MouseImageTrail from "@/components/MouseImageTrail"; // 🌟 Client Component ကို လှမ်းခေါ်ပါမည်
import MouseImageTrail from "./MouseImageTrail"; // 🌟 Client Component ကို လှမ်းခေါ်ပါမည်

export default async function Page() {
  // ၁။ နောက်ကွယ် (Server) ကနေ ပုံတွေကို ဆွဲထုတ်ပါမည်
  const rawImages = await getAllImages();

  // ၂။ URL တွေကိုပဲ သီးသန့် ခွဲထုတ်ပါမည်
  const imageUrls = rawImages.map((image) => image.imgUrl);

  return (
    <MouseImageTrail
      renderImageBuffer={50}
      rotationRange={25}
      images={imageUrls} // 🌟 ရလာတဲ့ ပုံစာရင်းကို Client ဆီ လှမ်းပို့ပါမည်
    >
      <section className="grid h-screen w-full place-content-center bg-white">
        <p className="flex items-center gap-2 text-3xl font-bold uppercase text-black">
          <FiMousePointer />
          <span>Hover me</span>
        </p>
      </section>
    </MouseImageTrail>
  );
}
