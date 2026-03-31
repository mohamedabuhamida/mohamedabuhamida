"use client";

import { motion, useAnimationControls } from "framer-motion";
import { SkillProps } from "@/types";
import { useEffect } from "react";

export default function Skills({ skills }: { skills: SkillProps[] }) {
  const controls = useAnimationControls();
  
  // Split skills: first 12 stay as a "cloud", the rest move in the strip
  const fixedSkills = skills.slice(0, 15); 
  const movingSkills = skills.slice(15);

  useEffect(() => {
    if (movingSkills.length > 0) {
      controls.start({
        x: ["0%", "-50%"],
        transition: { repeat: Infinity, duration: 60, ease: "linear" },
      });
    }
  }, [movingSkills, controls]);

  return (
    <div className="w-full space-y-12 max-w-6xl mx-auto flex flex-col items-center">
      
      {/* 🔹 FIXED TAG CLOUD (Replaces the Grid) */}
      <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4">
        {fixedSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, borderColor: "var(--color-accent)" }}
            className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm 
                       text-sm md:text-base font-medium text-text/90 whitespace-nowrap
                       transition-colors duration-300 shadow-sm"
          >
            {skill.name}
          </motion.div>
        ))}
      </div>

      {/* 🔹 MOVING STRIP (For extra skills) */}
      {movingSkills.length > 0 && (
        <div className="relative overflow-hidden w-full py-2">
          <motion.div 
            className="flex gap-4 w-max" 
            animate={controls}
            onMouseEnter={() => controls.stop()}
            onMouseLeave={() => controls.start({
              x: ["0%", "-50%"],
              transition: { repeat: Infinity, duration: 60, ease: "linear" },
            })}
          >
            {[...movingSkills, ...movingSkills].map((skill, index) => (
              <div
                key={index}
                className="bg-accent/5 border border-accent/20 rounded-full px-6 py-2 whitespace-nowrap shadow-inner"
              >
                <span className="text-sm font-semibold text-accent/80 italic">
                  {skill.name}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Fade edges */}
          <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-bg to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-bg to-transparent z-10 pointer-events-none" />
        </div>
      )}
    </div>
  );
}