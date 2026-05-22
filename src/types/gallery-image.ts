export type GalleryImage = {
  id: number;
  coupleId: string | null;
  createdById: string | null;
  imgUrl: string;
  uploadedAt: Date | string;
  isArchived: boolean;
  isPending?: boolean;
};
