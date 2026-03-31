"use client";

import { motion, useTransform, MotionValue } from "framer-motion";
import { AchievementProps } from "@/types";

export default function Achievements({
  achievements,
  scrollYProgress, // Received from parent
}: {
  achievements: AchievementProps[];
  scrollYProgress: MotionValue<number>;
}) {
  const sortedAchievements = [...achievements].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
      {/* LEFT COLUMN: The Cards */}
      <div className="relative h-full flex items-center justify-center">
        {sortedAchievements.map((item, index) => {
          // Calculate the scroll range for this specific card
          // Example: if 4 cards, card 0 is active from 0-0.25, card 1 from 0.25-0.5, etc.
          const start = index / sortedAchievements.length;
          const end = (index + 1) / sortedAchievements.length;

          return (
            <AchievementCard
              key={item.id}
              item={item}
              progress={scrollYProgress}
              range={[start, end]}
            />
          );
        })}
      </div>

      {/* RIGHT COLUMN: The Sticky Title */}
      <div className="hidden md:flex flex-col justify-center pl-12 text-right space-y-4">
        <p className="text-accent font-mono text-sm tracking-[0.4em] uppercase">
          Milestones
        </p>
        <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.9]">
          Recognition & <br />
          <span className="text-accent/50">Achievements</span>
        </h2>
        <p className="text-text/40 text-lg max-w-xs ml-auto">
          A collection of honors and awards earned throughout my career.
        </p>
      </div>
    </div>
  );
}

function AchievementCard({
  item,
  progress,
  range,
}: {
  item: AchievementProps;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  // Animation: Card fades in, stays solid, then fades/scales out
  const opacity = useTransform(progress, 
    [range[0], range[0] + 0.05, range[1] - 0.05, range[1]], 
    [0, 1, 1, 0]
  );
  
  const scale = useTransform(progress, 
    [range[0], range[0] + 0.05, range[1] - 0.05, range[1]], 
    [0.8, 1, 1, 0.9]
  );

  const y = useTransform(progress, 
    [range[0], range[1]], 
    [50, -50]
  );

  return (
    <motion.div
      style={{ opacity, scale, y }}
      className="absolute w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl shadow-2xl"
    >
      <div className="space-y-4">
        <div className="text-4xl">🏆</div>
        <h4 className="text-2xl font-bold leading-tight">{item.title}</h4>
        
        {item.organization && (
          <p className="text-accent font-semibold">{item.organization}</p>
        )}

        {item.date && (
          <p className="text-sm text-text/40 font-mono">{formatDate(item.date)}</p>
        )}

        {item.description && (
          <p className="text-text/60 leading-relaxed italic text-sm">
            &quot;{item.description}&quot;
          </p>
        )}

        {item.certificate_url && (
          <div className="pt-4">
            <a
              href={item.certificate_url}
              target="_blank"
              className="text-xs font-bold text-accent border border-accent/20 px-4 py-2 rounded-full hover:bg-accent hover:text-bg transition-all"
            >
              VIEW CREDENTIAL
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}