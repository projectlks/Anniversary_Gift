import DomeGallery from "@/app/page/DomeGallery";
import { getAllImages } from "@/libs/action";

// ❌ အရင်က Data တွေကို အတင်း အသစ်ပြန်ဆွဲခိုင်းနေတဲ့ စာကြောင်းကို ဖြုတ်လိုက်ပါပြီ
// export const dynamic = "force-dynamic";

export default async function DomeGalleryPage() {
  // 🌟 Next.js က ဒီ Function ကို တစ်ခါပဲ Run ပြီး ရလာတဲ့ Data ကို အလိုလို မှတ်ထားပေးပါလိမ့်မယ်
  const images = (await getAllImages()).map((image, index) => ({
    src: image.imgUrl,
    alt: `Couple memory ${index + 1}`,
  }));

  return (
    <div className="relative bg-black w-full  h-screen">
      {images.length ? (
        <DomeGallery
          images={images}
          fit={0.8}
          minRadius={600}
          maxVerticalRotationDeg={0}
          segments={34}
          dragDampening={2}
          grayscale={false}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-6 text-center text-white">
          <div className="max-w-sm space-y-3">
            <h1 className="text-2xl font-semibold">No memories yet</h1>
            <p className="text-sm text-white/70">
              Upload images for this couple from the backend to fill the dome
              gallery.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
