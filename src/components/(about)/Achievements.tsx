"use client";

import { motion } from "framer-motion";
import { AchievementProps } from "@/types";

export default function Achievements({
  achievements,
}: {
  achievements: AchievementProps[];
}) {
  const sortedAchievements = [...achievements].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

  return (
    // Grid container must NOT have overflow-hidden
    <div className="grid grid-cols-1 md:grid-cols-2 w-full relative">
      
      {/* LEFT COLUMN: The Cards */}
      {/* This column will be very tall (e.g., 4 cards = 400vh) */}
      <div className="relative">
        {sortedAchievements.map((item, index) => (
          <div
            key={item.id}
            // Each card takes up a full screen height and sticks to the top
            className="sticky top-0 h-screen flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ margin: "-10% 0px -10% 0px", once: false }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              // z-index ensures newer cards appear on top of older ones
              style={{ zIndex: index + 1 }}
              className="w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
              <div className="space-y-4">
                <div className="text-4xl">🏆</div>
                <h4 className="text-2xl font-bold leading-tight">{item.title}</h4>
                
                {item.organization && (
                  <p className="text-accent font-semibold">{item.organization}</p>
                )}

                {item.date && (
                  <p className="text-sm text-text/40 font-mono">
                    {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
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
                      className="text-xs font-bold text-accent border border-accent/20 px-6 py-2 rounded-full hover:bg-accent hover:text-bg transition-all inline-block"
                    >
                      VIEW CREDENTIAL ↗
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* RIGHT COLUMN: The Sticky Title */}
      <div className="hidden md:flex sticky top-0 h-screen flex-col justify-center pl-12 text-right space-y-4 pr-10">
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