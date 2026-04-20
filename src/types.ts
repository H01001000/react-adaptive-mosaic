import type { ImageProps } from "next/image";
import type { ReactNode } from "react";

export type PhotoGalleryImage = ImageProps & {
  assetId: string;
  src: string;
  width: number;
  height: number;
};

export type LaidOutPhotoGalleryImage = PhotoGalleryImage & {
  top: number;
  left: number;
  widthBlock: number;
  heightBlock: number;
};

export type RenderPhotoGalleryCell = (ctx: {
  image: LaidOutPhotoGalleryImage;
  columns: number;
  rowMargin: number;
}) => ReactNode;
