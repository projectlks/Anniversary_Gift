import { DragCards } from "@/components/DragCards";
import { getAllImages } from "@/libs/action";

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
