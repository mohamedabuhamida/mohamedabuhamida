"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { HiCheck } from "react-icons/hi2";
import { ExperienceProps } from "@/types";
import { useRef } from "react";

export default function Experience({
  experience,
  scrollYProgress, // We will pass this from the parent
}: {
  experience: ExperienceProps[];
  scrollYProgress: MotionValue<number>;
}) {
  const sortedExperience = [...experience].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

  // This moves the entire list upwards as the user scrolls the section
  // -50% means it will slide up halfway through its total height
  const yTranslate = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="mb-8 text-center shrink-0">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/80">
          Career Path
        </p>
        <h3 className="mt-2 text-2xl font-bold text-text md:text-3xl">
          Experience Timeline
        </h3>
      </div>

      {/* The visible viewport */}
      <div className="relative w-full max-w-4xl h-[60vh] overflow-hidden">
        {/* The moving content */}
        <motion.div 
          style={{ y: yTranslate }} 
          className="relative px-6 py-10"
        >
          {/* The Vertical Line */}
          <div className="absolute left-6 md:left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-accent/50 via-accent/20 to-transparent" />

          <div className="space-y-12">
            {sortedExperience.map((item, index) => {
              const isCurrent = Boolean(item.is_current);
              const isLeft = index % 2 === 0;

              return (
                <ExperienceItem 
                  key={item.id} 
                  item={item} 
                  isLeft={isLeft} 
                  isCurrent={isCurrent} 
                />
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ExperienceItem({ item, isLeft, isCurrent }: { item: any, isLeft: boolean, isCurrent: boolean }) {
  return (
    <motion.article
      className="relative md:grid md:grid-cols-[1fr_64px_1fr] md:items-center"
    >
      <div className={`${isLeft ? "md:col-start-1 md:text-right md:pr-8" : "md:col-start-3 md:pl-8"}`}>
        <div className={`inline-block p-5 rounded-2xl border transition-all duration-500 ${
          isCurrent ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]" : "border-white/10 "
        }`}>
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            {formatDateRange(item.start_date, item.end_date, item.is_current)}
          </span>
          <h4 className="text-lg font-bold text-text mt-1">{item.job_title}</h4>
          <p className="text-sm text-text/60 mb-3">{item.company}</p>
          <p className="text-sm leading-relaxed text-text/40">{item.description}</p>
        </div>
      </div>

      <div className="absolute left-0 md:static md:col-start-2 flex justify-center">
        <div className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-bg shadow-xl ${
          isCurrent ? "bg-accent text-bg" : "bg-primary/80 text-white"
        }`}>
          <HiCheck size={20} />
        </div>
      </div>
    </motion.article>
  );
}

// Helper formatting functions (keep your existing ones)
function formatDate(date?: string) {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}
function formatDateRange(startDate?: string, endDate?: string, isCurrent?: boolean) {
    const start = formatDate(startDate);
    const end = isCurrent ? "Present" : formatDate(endDate);
    return start && end ? `${start} — ${end}` : start || end || "";
}