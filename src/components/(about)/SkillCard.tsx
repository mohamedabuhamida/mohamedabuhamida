"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function SkillCard({ skill, index }: any) {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [moveX, setMoveX] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const textWidth = textRef.current?.scrollWidth || 0;
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const distance = textWidth - containerWidth;

    if (distance > 0) {
      setMoveX(-distance);
      setDuration(distance / 60);
    } else {
      setMoveX(0);
    }
  }, [skill.name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(78,168,222,0.4)",
        transition: { duration: 0.15 },
      }}
      className="bg-primary/10 border border-border rounded-xl px-5 py-3 text-center overflow-hidden"
    >
      <div ref={containerRef} className="overflow-hidden">
        <motion.div
          ref={textRef}
          className="whitespace-nowrap font-semibold text-text select-none"
          whileHover={
            moveX !== 0
              ? {
                  x: moveX,
                }
              : {}
          }
          transition={{
            duration: duration,
            ease: "linear",
          }}
        >
          {skill.name}
        </motion.div>
      </div>
    </motion.div>
  );
}
