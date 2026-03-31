"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import { HiCheck } from "react-icons/hi2";
import { ExperienceProps } from "@/types";

export default function Experience({
  experience,
  scrollYProgress,
}: {
  experience: ExperienceProps[];
  scrollYProgress: MotionValue<number>;
}) {
  const sortedExperience = [...experience].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

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

      <div className="relative w-full max-w-4xl">
        {/* MOBILE VIEW */}
        <div className="relative px-2 py-6 md:hidden">
          <div className="absolute left-6 top-0 h-full w-0.5 -translate-x-1/2 bg-linear-to-b from-accent/50 via-accent/20 to-transparent" />
          <div className="space-y-8">
            {sortedExperience.map((item) => (
              <ExperienceItem
                key={item.id}
                item={item}
                isLeft={false}
                isCurrent={Boolean(item.is_current)}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block relative h-[60vh] overflow-hidden">
          <motion.div style={{ y: yTranslate }} className="relative px-6 py-10">
            {/* The vertical line */}
            <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-linear-to-b from-accent/50 via-accent/20 to-transparent" />

            <div className="space-y-12">
              {sortedExperience.map((item, index) => (
                <ExperienceItem
                  key={item.id}
                  item={item}
                  isLeft={index % 2 === 0}
                  isCurrent={Boolean(item.is_current)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ExperienceItem({ item, isLeft, isCurrent }: { item: any; isLeft: boolean; isCurrent: boolean }) {
  return (
    <motion.article 
      className="relative md:grid md:grid-cols-[1fr_64px_1fr] items-center"
    >
      {/* 1. CONTENT SIDE */}
      <div
        className={`pl-14 md:pl-0 ${
          isLeft
            ? "md:col-start-1 md:text-right md:pr-8"
            : "md:col-start-3 md:text-left md:pl-8"
        }`}
      >
        <div
          className={`w-full p-5 rounded-2xl border transition-all duration-500 ${
            isCurrent ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]" : "border-white/10 bg-white/5"
          }`}
        >
          <span className="text-xs font-bold text-accent uppercase tracking-widest">
            {formatDateRange(item.start_date, item.end_date, item.is_current)}
          </span>
          <h4 className="text-lg font-bold text-text mt-1">{item.job_title}</h4>
          <p className="text-sm text-text/60 mb-3">{item.company}</p>
          <p className="text-sm leading-relaxed text-text/40">{item.description}</p>
        </div>
      </div>

      {/* 2. CENTER CIRCLE SIDE */}
      {/* 
          Using 'absolute inset-y-0' on mobile and 'static' on desktop 
          combined with flex items-center ensures the circle is always 
          vertically centered regardless of card height.
      */}
      <div className="absolute inset-y-0 left-0 w-12 md:static md:w-auto md:col-start-2 flex items-center justify-center">
        <div
          className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-bg shadow-xl transition-colors duration-500 ${
            isCurrent ? "bg-accent text-bg" : "bg-neutral-800 text-white"
          }`}
        >
          <HiCheck size={20} />
        </div>
      </div>

      {/* 3. EMPTY SIDE (Desktop Only) */}
      <div className={`hidden md:block ${isLeft ? "md:col-start-3" : "md:col-start-1"}`} />
    </motion.article>
  );
}

// Helper functions (same as before)
function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function formatDateRange(startDate?: string, endDate?: string, isCurrent?: boolean) {
  const start = formatDate(startDate);
  const end = isCurrent ? "Present" : formatDate(endDate);
  return start && end ? `${start} - ${end}` : start || end || "";
}