"use client";

import { motion, useAnimationControls } from "framer-motion";
import { SkillProps } from "@/types";
import { useRef, useEffect, useState } from "react";
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
  }, []);

  return (
    <div className="w-full space-y-8 lg:max-w-4xl">
      {/* 🔹 Fixed Grid (4 Rows Default) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center w-full">
        {fixedSkills.map((skill, index) => (
          <SkillCard key={skill.name} skill={skill} index={index} />
        ))}
      </div>

      {/* 🔹 Moving Strip */}
      {movingSkills.length > 0 && (
        <div
          className="relative overflow-hidden"
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
          <motion.div className="flex gap-4 w-max" animate={controls}>
            {[...movingSkills, ...movingSkills].map((skill, index) => (
              <div
                key={index}
                className="bg-primary/10 border border-border rounded-xl px-5 py-3 whitespace-nowrap"
              >
                <span className="font-semibold text-text">{skill.name}</span>
              </div>
            ))}
          </motion.div>

          {/* Fade edges effect */}
          <div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-bg via-bg/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-bg via-bg/80 to-transparent pointer-events-none" />
        </div>
      )}
    </div>
  );
}
