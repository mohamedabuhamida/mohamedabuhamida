"use client";

import { motion, useAnimationControls } from "framer-motion";
import { SkillProps } from "@/types";
import { useEffect } from "react";
import SkillCard from "./SkillCard";

export default function Skills({ skills }: { skills: SkillProps[] }) {
  const controls = useAnimationControls();
  const fixedSkills = skills.slice(0, 12); // 4 rows * 3 cols
  const movingSkills = skills.slice(12);

  useEffect(() => {
    controls.start({
      x: ["0%", "-50%"],
      transition: {
        repeat: Infinity,
        duration: 70,
        ease: "linear",
      },
    });
  }, [controls]);

  return (
    // Added mx-auto and flex items-center to center the whole block
    <div className="w-full space-y-12 lg:max-w-5xl mx-auto flex flex-col items-center">
      
      {/* 🔹 Fixed Grid (4 Rows Default) */}
      {/* Added justify-items-center to keep cards centered in their columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 items-center w-full justify-items-center">
        {fixedSkills.map((skill, index) => (
          <SkillCard key={skill.name} skill={skill} index={index} />
        ))}
      </div>

      {/* 🔹 Moving Strip */}
      {movingSkills.length > 0 && (
        <div
          className="relative overflow-hidden w-full max-w-4xl"
          onMouseEnter={() => controls.stop()}
          onMouseLeave={() =>
            controls.start({
              x: ["0%", "-50%"],
              transition: {
                repeat: Infinity,
                duration: 70,
                ease: "linear",
              },
            })
          }
        >
          <motion.div className="flex gap-6 w-max py-4" animate={controls}>
            {[...movingSkills, ...movingSkills].map((skill, index) => (
              <div
                key={index}
                className="bg-primary/5 border border-white/5 hover:border-accent/30 transition-colors rounded-2xl px-6 py-4 whitespace-nowrap"
              >
                <span className="font-bold text-text/80 tracking-wide">
                  {skill.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Fade edges effect - Adjusted to match the dark bg */}
          <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-bg via-bg/40 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-bg via-bg/40 to-transparent pointer-events-none z-10" />
        </div>
      )}
    </div>
  );
}