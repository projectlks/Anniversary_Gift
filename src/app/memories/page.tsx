// export const dynamic = "force-dynamic";

import { DragCards } from "@/components/DragCards";
import { getAllImages } from "@/libs/action";
// export const revalidate = 60
export const revalidate = 0
interface ImageType {
  imgUrl: string;
}

export const runtime = "nodejs"; // ✅ ADD HERE


export default async function Memories() {
  const images = (await getAllImages()).map((image: ImageType) => ({
    src: image.imgUrl,
  }));

  return <DragCards images={images} />;
}
