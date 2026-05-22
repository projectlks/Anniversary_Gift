// import { getAllImages } from "@/libs/action";
// import MusicRoom from "./MusicRoom";

// export const dynamic = "force-dynamic";

// export default async function MusicPage() {
//   const images = (await getAllImages()).map((image, index) => ({
//     src: image.imgUrl,
//     alt: `Couple memory ${index + 1}`,
//   }));

//   return <MusicRoom images={images} />;
// }

import { getAllImages, getMusicTracks } from "@/libs/action";
import { resolveCoupleScope } from "@/libs/authz";
import MusicRoom from "./MusicRoom";

export const dynamic = "force-dynamic";

export default async function MusicPage() {
  const { couple } = await resolveCoupleScope();

  const images = (await getAllImages(couple.id)).map((image, index) => ({
    src: image.imgUrl,
    alt: `Couple memory ${index + 1}`,
  }));

  const dbTracks = await getMusicTracks(couple.id);

  const initialTracks = dbTracks.map((track) => ({
    id: track.id,
    name: track.name,
    url: track.url,
  }));

  return (
    <MusicRoom
      coupleId={couple.id}
      images={images}
      initialTracks={initialTracks}
    />
  );
}
