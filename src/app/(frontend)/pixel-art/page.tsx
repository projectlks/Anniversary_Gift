import { requireViewerContext } from "@/libs/authz";
import { prisma } from "@/libs/prisma";
import PixelArtClient from "./PixelArtClient";

export default async function PixelArtPage() {
  // ၁။ User (Couple) ကို စစ်ဆေးမည်
  const viewer = await requireViewerContext();
  const coupleId = viewer.coupleId;

  if (!coupleId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDF2F8] text-gray-500">
        No couple assigned!
      </div>
    );
  }

  // ၂။ Database ထဲက ပန်းချီကား အဟောင်းကို ဆွဲထုတ်မည်
  const art = await prisma.pixelArt.findUnique({ where: { coupleId } });

  // ၃။ ကနဦး အရောင်များ သတ်မှတ်ခြင်း (24x24 = 576 ကွက်)
  const TOTAL_PIXELS = 24 * 24;
  let initialPixels = Array(TOTAL_PIXELS).fill("#ffffff");

  if (art && art.pixels) {
    try {
      const parsedPixels = JSON.parse(art.pixels);
      // 🌟 Database ထဲက အကွက်အရေအတွက်က လက်ရှိ 576 နဲ့ ကိုက်ညီမှသာ ယူသုံးမည်
      // အဟောင်း (ဥပမာ ၂၅၆ ကွက်) ဖြစ်နေပါက အသစ် (၅၇၆ ကွက်အဖြူ) အဖြစ် အလိုလို ပြောင်းသွားမည်
      if (Array.isArray(parsedPixels) && parsedPixels.length === TOTAL_PIXELS) {
        initialPixels = parsedPixels;
      }
    } catch (e) {
      console.error("Failed to parse pixel art JSON", e);
      // Error ဖြစ်ပါက အဖြူရောင် အကွက် ၅၇၆ ကွက်ကိုသာ သုံးမည်
    }
  }

  return (
    <div className="min-h-screen bg-white  py-12 px-4 flex flex-col">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          Our Pixel Art
        </h1>
        <p className="text-pink-500 font-medium mt-2">
          Let&apos;s draw our memories together 🎨
        </p>
      </div>

      {/* Client Component သို့ 576 ကွက် အတိအကျသာ ပို့ပေးမည် */}
      <PixelArtClient coupleId={coupleId} initialPixels={initialPixels} />
    </div>
  );
}

