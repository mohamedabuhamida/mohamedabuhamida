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
    <section className="w-full bg-bg text-text">
      {/* 2-Column Grid: Left for Cards, Right for Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 px-6 md:px-12">
        
        {/* LEFT COLUMN: The Cards that stick and stack */}
        <div className="relative space-y-0">
          {sortedAchievements.map((item, index) => (
            <figure
              key={item.id}
              className="sticky top-0 h-screen flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ margin: "-20%" }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-neutral-900/80 backdrop-blur-xl shadow-2xl"
              >
                <div className="space-y-4">
                  <div className="text-4xl">🏆</div>
                  <h4 className="text-2xl font-bold leading-tight">
                    {item.title}
                  </h4>

                  {item.organization && (
                    <p className="text-accent font-semibold tracking-wide">
                      {item.organization}
                    </p>
                  )}

                  {item.date && (
                    <p className="text-sm text-text/40 font-mono">
                      {formatDate(item.date)}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-text/60 leading-relaxed italic">
                      &quot;{item.description}&quot;
                    </p>
                  )}

                  {item.certificate_url && (
                    <div className="pt-4">
                      <a
                        href={item.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:gap-3 transition-all"
                      >
                        VIEW CREDENTIAL <span>→</span>
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </figure>
          ))}
        </div>

        {/* RIGHT COLUMN: The Fixed Title */}
        <div className="hidden md:flex sticky top-0 h-screen items-center justify-center pl-12">
          <div className="text-right space-y-4">
            <p className="text-accent font-mono text-sm tracking-[0.4em] uppercase">
              Milestones
            </p>
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.9]">
              Recognition & <br /> 
              <span className="text-accent/50">Achievements</span>
            </h2>
            <p className="text-text/40 text-lg max-w-xs ml-auto">
              A collection of awards and certifications earned throughout my career in AI and Software Engineering.
            </p>
          </div>
        </div>

        {/* MOBILE TITLE: Shows only on small screens at the top */}
        <div className="md:hidden pt-20 pb-10 text-center">
            <h2 className="text-4xl font-bold">Achievements</h2>
        </div>
      </div>
    </section>
  );
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}