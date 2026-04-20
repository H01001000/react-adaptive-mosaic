"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

export default function AdaptiveMosaicGrid({
  children,
  columns,
  heightBlock,
  rowMargin,
}: {
  children: ReactNode;
  columns: number;
  heightBlock: number;
  rowMargin: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  const handleScroll = () => {
    if (!ref.current) return;
    const rowHeight = ref.current.offsetHeight / heightBlock;
    const top =
      ref.current.offsetTop + ref.current.offsetHeight >
      window.scrollY - rowMargin * rowHeight;
    const bottom =
      ref.current.offsetTop <
      window.scrollY + window.innerHeight + rowMargin * rowHeight;
    setInView(top && bottom);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    handleScroll();
  }, [ref.current, columns, heightBlock, rowMargin]);

  return (
    <div
      ref={ref}
      style={{
        visibility: inView ? "visible" : "hidden",
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
