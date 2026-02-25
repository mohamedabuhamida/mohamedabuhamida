"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type HorizontalScrollProps<T> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemWidth?: number;
  gap?: number;
  containerHeight?: string; // ex: "400vh"
};

export default function HorizontalScroll<T>({
  items,
  renderItem,
  itemWidth = 400,
  gap = 30,
  containerHeight = "400vh",
}: HorizontalScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalDistance = (items.length - 1) * (itemWidth + gap);

  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <div ref={containerRef} className="relative" style={{ height: containerHeight }}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-250">
          <motion.div
            style={{
              x,
              display: "flex",
              gap: `${gap}px`,
            }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  flexShrink: 0,
                  width: `${itemWidth}px`,
                }}
              >
                {renderItem(item, index)}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}