"use client";

import { Box } from "@mui/material";
import type { ReactNode } from "react";
import DynamicPhotoGalleryBreakpoint from "./DynamicPhotoGalleryBreakpoint";
import type { PhotoGalleryImage, RenderPhotoGalleryCell } from "./types";

export interface DynamicPhotoGalleryProps {
  images: PhotoGalleryImage[];
  breakpointColumnMapping: Record<string, number>;
  rowMargin: number;
  renderCell: RenderPhotoGalleryCell;
  lightbox?: ReactNode;
}

export default function DynamicPhotoGallery(props: DynamicPhotoGalleryProps) {
  const { images, breakpointColumnMapping, rowMargin, renderCell, lightbox } =
    props;

  return (
    <>
      {Object.entries(breakpointColumnMapping).map(([breakpoint, columns]) => (
        <Box
          key={breakpoint}
          sx={{
            display: {
              ...Object.entries(breakpointColumnMapping)
                .map(([bp]) => ({
                  [bp]: bp === breakpoint ? "block" : "none",
                }))
                .reduce((acc, value) => ({ ...acc, ...value }), {}),
            },
          }}
        >
          <DynamicPhotoGalleryBreakpoint
            images={images}
            columns={columns}
            rowMargin={rowMargin}
            renderCell={renderCell}
          />
        </Box>
      ))}
      {lightbox}
    </>
  );
}
