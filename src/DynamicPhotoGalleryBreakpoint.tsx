"use client";

import { Box } from "@mui/material";
import type { ImageProps } from "next/image";
import DynamicPhotoGalleryGrid from "./DynamicPhotoGalleryGrid";
import type { RenderPhotoGalleryCell } from "./types";

interface DynamicPhotoGalleryBreakpointProps {
  images: Array<
    ImageProps & {
      assetId: string;
      width: number;
      height: number;
      src: string;
    }
  >;
  columns: number;
  rowMargin: number;
  renderCell: RenderPhotoGalleryCell;
}

export default function DynamicPhotoGalleryBreakpoint(
  props: DynamicPhotoGalleryBreakpointProps,
) {
  const layout: boolean[][] = [new Array(props.columns).fill(false)];
  let lastRowWithEmptySlot = 0;
  let noOfEmptySlotInLastRow = props.columns;
  const imagesWithLayout: Array<
    ImageProps & {
      assetId: string;
      src: string;
      width: number;
      height: number;
      top: number;
      left: number;
      widthBlock: number;
      heightBlock: number;
    }
  > = [];

  const addNewRow = () => {
    lastRowWithEmptySlot = layout.findIndex((row) => !row.every((x) => x));

    if (lastRowWithEmptySlot === -1) {
      layout.push(new Array(props.columns).fill(false));
      lastRowWithEmptySlot = layout.length - 1;
      noOfEmptySlotInLastRow = props.columns;
    } else {
      noOfEmptySlotInLastRow = layout[lastRowWithEmptySlot].filter(
        (x) => !x,
      ).length;
    }
  };

  const imageQueues: Record<
    string,
    Array<
      ImageProps & {
        assetId: string;
        src: string;
        width: number;
        height: number;
        widthBlock: number;
        heightBlock: number;
        aspectRatio: number;
      }
    >
  > = {
    "21": [],
    "12": [],
    "31": [],
    "13": [],
    "11": [],
  };

  props.images.forEach((image) => {
    const originalAspectRatio = image.width / image.height;
    const aspectRatio =
      originalAspectRatio < 0.7
        ? 1 / Math.ceil(1 / Math.min(originalAspectRatio, 0.5))
        : originalAspectRatio > 1.25
          ? Math.ceil(Math.max(originalAspectRatio, 2))
          : 1;
    const width = aspectRatio > 1 && props.columns > 3 ? aspectRatio : 1;
    const height = aspectRatio < 1 && props.columns > 3 ? 1 / aspectRatio : 1;

    if (!imageQueues[`${width}${height}`]) {
      imageQueues[`${width}${height}`] = [];
    }

    imageQueues[`${width}${height}`].push({
      ...image,
      widthBlock: width,
      heightBlock: height,
      aspectRatio: props.columns > 3 ? aspectRatio : 1,
    });
  });

  const squareImageQueue = imageQueues["11"];
  Object.keys(imageQueues).forEach((key) => {
    if (imageQueues[key].length === 0) {
      delete imageQueues[key];
    }
  });
  if (Object.keys(imageQueues).length !== 1 && squareImageQueue)
    delete imageQueues["11"];

  props.images.forEach((_, i) => {
    const queue =
      imageQueues[
        Object.keys(imageQueues)[i % Object.keys(imageQueues).length]
      ];
    const image = queue.shift()!;
    if (queue.length === 0) {
      delete imageQueues[
        Object.keys(imageQueues)[i % Object.keys(imageQueues).length]
      ];

      if (
        Object.keys(imageQueues).length === 1 &&
        squareImageQueue.length > 0
      ) {
        imageQueues["11"] = squareImageQueue;
      }
    }

    const { widthBlock: width, heightBlock: height } = image;

    if (width === 1 && height === 1) {
      const indexOfFreeSlot = layout[lastRowWithEmptySlot].findIndex((x) => !x);
      layout[lastRowWithEmptySlot].fill(
        true,
        indexOfFreeSlot,
        indexOfFreeSlot + 1,
      );
      imagesWithLayout.push({
        ...image,
        top: lastRowWithEmptySlot,
        left: indexOfFreeSlot,
        widthBlock: width,
        heightBlock: height,
      });
      noOfEmptySlotInLastRow--;
      if (noOfEmptySlotInLastRow === 0) {
        addNewRow();
      }

      return;
    }

    if (width > 1) {
      let indexOfFreeSlot = -1;
      for (let j = 0; j < props.columns - width + 1; j++) {
        if (
          Array.from({ length: width }).every(
            (_, k) => !layout[lastRowWithEmptySlot][j + k],
          )
        ) {
          indexOfFreeSlot = j;
          break;
        }
      }

      if (indexOfFreeSlot === -1) {
        let rowSearchIndex = lastRowWithEmptySlot + 1;
        while (true) {
          if (!layout[rowSearchIndex]) {
            layout.push(
              new Array(props.columns).fill(true, 0, width).fill(false, width),
            );
            imagesWithLayout.push({
              ...image,
              top: rowSearchIndex,
              left: 0,
              widthBlock: width,
              heightBlock: height,
            });
            break;
          }

          for (
            let indexOfFreeSlotInner = 0;
            indexOfFreeSlotInner < props.columns - width + 1;
            indexOfFreeSlotInner++
          ) {
            if (
              Array.from({ length: width }).every(
                (_, k) => !layout[rowSearchIndex][indexOfFreeSlotInner + k],
              ) &&
              layout[rowSearchIndex - 1][indexOfFreeSlotInner]
            ) {
              layout[rowSearchIndex].fill(
                true,
                indexOfFreeSlotInner,
                indexOfFreeSlotInner + width,
              );
              imagesWithLayout.push({
                ...image,
                top: rowSearchIndex,
                left: indexOfFreeSlotInner,
                widthBlock: width,
                heightBlock: height,
              });
              return;
            }
          }

          rowSearchIndex++;
        }
      } else {
        layout[lastRowWithEmptySlot].fill(
          true,
          indexOfFreeSlot,
          indexOfFreeSlot + width,
        );
        imagesWithLayout.push({
          ...image,
          top: lastRowWithEmptySlot,
          left: indexOfFreeSlot,
          widthBlock: width,
          heightBlock: height,
        });
        noOfEmptySlotInLastRow -= width;

        if (noOfEmptySlotInLastRow === 0) {
          addNewRow();
        }
      }
    }

    if (height > 1) {
      let columnSearchIndex = layout[lastRowWithEmptySlot].findIndex((x) => !x);
      let rowSearchIndex = lastRowWithEmptySlot;
      while (true) {
        for (let j = 1; j < height; j++) {
          if (!layout[rowSearchIndex + j]) {
            layout.push(new Array(props.columns).fill(false));
          }
        }

        if (
          Array.from({ length: height }).every(
            (_, idx) => !layout[rowSearchIndex + idx][columnSearchIndex],
          )
        ) {
          Array.from({ length: height }).forEach((_, idx) => {
            layout[rowSearchIndex + idx][columnSearchIndex] = true;
          });
          imagesWithLayout.push({
            ...image,
            top: rowSearchIndex,
            left: columnSearchIndex,
            widthBlock: width,
            heightBlock: height,
          });

          if (rowSearchIndex === lastRowWithEmptySlot) {
            noOfEmptySlotInLastRow--;

            if (noOfEmptySlotInLastRow === 0) {
              addNewRow();
            }
          }

          break;
        }

        columnSearchIndex++;

        if (columnSearchIndex === props.columns) {
          columnSearchIndex = 0;
          rowSearchIndex++;
        }
      }
    }
  });

  return (
    <Box
      sx={{
        minHeight: `${(layout.length * 100) / props.columns}vw`,
        display: "grid",
        gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
        gridTemplateRows: `repeat(${layout.length}, 1fr)`,
      }}
    >
      {imagesWithLayout.map((image) => (
        <Box
          sx={{
            width: "100%",
          }}
          style={{
            gridArea: `${image.top + 1} / ${image.left + 1} / ${image.top + image.heightBlock + 1} / ${image.left + image.widthBlock + 1}`,
            aspectRatio: `${image.widthBlock} / ${image.heightBlock}`,
          }}
          key={`${image.src}-${image.top}-${image.left}`}
        >
          <Box sx={{ width: "100%", height: "100%", padding: "4px" }}>
            <DynamicPhotoGalleryGrid
              columns={props.columns}
              heightBlock={image.heightBlock}
              rowMargin={props.rowMargin}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  position: "relative",
                  borderRadius: "12px",
                  cursor: "pointer",
                }}
              >
                {props.renderCell({
                  image,
                  columns: props.columns,
                  rowMargin: props.rowMargin,
                })}
              </Box>
            </DynamicPhotoGalleryGrid>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
