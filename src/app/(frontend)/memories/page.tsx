import { DragCards } from "@/components/DragCards";
import { getAllImages } from "@/libs/action";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

// 🌟 ပြင်ဆင်ချက် ၁: url အစား imgUrl လို့ ပြန်ပြောင်းပေးပါမည်
interface ImageType {
  imgUrl: string;
}

export default async function Memories() {
  const rawImages = await getAllImages();

  // 🌟 ပြင်ဆင်ချက် ၂: image.url အစား image.imgUrl ကို ပြန်သုံးပါမည်
  const images = rawImages.map((image: ImageType) => ({
    src: image.imgUrl,
  }));

  if (!images || images.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-stone-900 text-stone-400">
        <p className="text-lg">No memories yet. Upload some photos!</p>
      </div>
    );
  }

  return <DragCards images={images} />;
}