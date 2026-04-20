"use client";

import type { ReactNode } from "react";
import { useId, useMemo } from "react";
import AdaptiveMosaicBreakpoint from "./AdaptiveMosaicBreakpoint";
import { buildBreakpointVisibilityCss } from "./breakpointVisibilityCss";
import type { MosaicImage, RenderMosaicCell } from "./types";

export interface AdaptiveMosaicProps {
  images: MosaicImage[];
  breakpointColumnMapping: Record<string, number>;
  rowMargin: number;
  renderCell: RenderMosaicCell;
  lightbox?: ReactNode;
}

export default function AdaptiveMosaic(props: AdaptiveMosaicProps) {
  const { images, breakpointColumnMapping, rowMargin, renderCell, lightbox } =
    props;

  const scopeId = useId().replace(/:/g, "");
  const breakpointKeys = Object.keys(breakpointColumnMapping);
  const visibilityCss = useMemo(
    () => buildBreakpointVisibilityCss(scopeId, breakpointKeys),
    [scopeId, breakpointKeys.join("|")],
  );

  return (
    <>
      {visibilityCss ? <style>{visibilityCss}</style> : null}
      {Object.entries(breakpointColumnMapping).map(([breakpoint, columns]) => (
        <div
          key={breakpoint}
          className="adaptive-mosaic-bp"
          data-adaptive-mosaic={scopeId}
          data-mosaic-bp={breakpoint}
        >
          <AdaptiveMosaicBreakpoint
            images={images}
            columns={columns}
            rowMargin={rowMargin}
            renderCell={renderCell}
          />
        </div>
      ))}
      {lightbox}
    </>
  );
}
