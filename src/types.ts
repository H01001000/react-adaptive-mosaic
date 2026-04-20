import type { JSX, ReactNode } from "react";

/** Mirrors `next/image` static import shape for typing compatibility. */
export interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

export interface StaticRequire {
  default: StaticImageData;
}

export type StaticImport = StaticRequire | StaticImageData;

export type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export type ImageLoader = (p: ImageLoaderProps) => string;

type LoadingValue = "lazy" | "eager" | undefined;

export type PlaceholderValue = "blur" | "empty" | `data:image/${string}`;

export type OnLoadingComplete = (img: HTMLImageElement) => void;

/**
 * Props for `next/image` `<Image />`, extracted so this package does not depend on `next`.
 * Aligned with Next.js `ImageProps` from `next/dist/shared/lib/get-img-props`.
 */
export type ImageProps = Omit<
  JSX.IntrinsicElements["img"],
  "src" | "srcSet" | "ref" | "alt" | "width" | "height" | "loading"
> & {
  src: string | StaticImport;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  loader?: ImageLoader;
  quality?: number | `${number}`;
  preload?: boolean;
  /**
   * @deprecated Use `preload` prop instead.
   */
  priority?: boolean;
  loading?: LoadingValue;
  placeholder?: PlaceholderValue;
  blurDataURL?: string;
  unoptimized?: boolean;
  overrideSrc?: string;
  /**
   * @deprecated Use `onLoad` instead.
   */
  onLoadingComplete?: OnLoadingComplete;
  /**
   * @deprecated Use `fill` prop instead of `layout="fill"` or change import to `next/legacy/image`.
   */
  layout?: string;
  /**
   * @deprecated Use `style` prop instead.
   */
  objectFit?: string;
  /**
   * @deprecated Use `style` prop instead.
   */
  objectPosition?: string;
  /**
   * @deprecated This prop does not do anything.
   */
  lazyBoundary?: string;
  /**
   * @deprecated This prop does not do anything.
   */
  lazyRoot?: string;
};

export type MosaicImage = ImageProps & {
  assetId: string;
  src: string;
  width: number;
  height: number;
};

export type LaidOutMosaicImage = MosaicImage & {
  top: number;
  left: number;
  widthBlock: number;
  heightBlock: number;
};

export type RenderMosaicCell = (ctx: {
  image: LaidOutMosaicImage;
  columns: number;
  rowMargin: number;
}) => ReactNode;
