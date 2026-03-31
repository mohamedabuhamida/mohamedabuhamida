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
    <div className="grid grid-cols-1 md:grid-cols-2 w-full relative max-w-5xl mx-auto">
      
      {/* LEFT COLUMN: The Cards */}
      <div className="relative">
        {sortedAchievements.map((item, index) => (
          <div
            key={item.id}
            className="sticky top-0 h-screen flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 100 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ margin: "-10% 0px -10% 0px", once: false }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: index + 1 }}
              // Added h-[480px] for fixed height and flex flex-col
              className="w-full max-w-sm h-120 p-8 rounded-3xl border border-white/10 bg-bg shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="text-4xl">🏆</div>
                
                <div>
                  <h4 className="text-2xl font-bold leading-tight">{item.title}</h4>
                  {item.organization && (
                    <p className="text-accent font-semibold mt-1">{item.organization}</p>
                  )}
                </div>

                {item.date && (
                  <p className="text-xs text-text/40 font-mono uppercase tracking-widest">
                    {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                  </p>
                )}

                {/* flex-1 and overflow-hidden ensures description takes available space without breaking height */}
                {item.description && (
                  <p className="text-text/60 leading-relaxed italic text-sm line-clamp-6">
                    &quot;{item.description}&quot;
                  </p>
                )}
              </div>

              {/* Pushes button to the very bottom */}
              <div className="pt-6">
                {item.certificate_url ? (
                  <a
                    href={item.certificate_url}
                    target="_blank"
                    className="text-xs font-bold text-accent border border-accent/20 px-6 py-3 rounded-full hover:bg-accent hover:text-bg transition-all inline-block w-full text-center uppercase tracking-tighter"
                  >
                    View Credential ↗
                  </a>
                ) : (
                  <div className="h-10" /> // Spacer if no link
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