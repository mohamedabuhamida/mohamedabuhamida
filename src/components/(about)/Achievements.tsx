"use client";

import { motion } from "framer-motion";
import { HiOutlineTrophy } from "react-icons/hi2";
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
    <div className="w-full relative max-w-5xl mx-auto">
      <div className="md:hidden space-y-4 px-4 py-10">
        {sortedAchievements.map((item) => (
          <article
            key={item.id}
            className="w-full p-6 rounded-3xl border border-white/10 bg-bg flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <HiOutlineTrophy size={26} />
              </div>

              <div>
                <h4 className="text-xl font-bold leading-tight">{item.title}</h4>
                {item.organization && (
                  <p className="text-accent font-semibold mt-1">{item.organization}</p>
                )}
              </div>

              {item.date && (
                <p className="text-xs text-text/40 font-mono uppercase tracking-widest">
                  {new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                </p>
              )}

              {item.description && (
                <p className="text-text/60 leading-relaxed italic text-sm">
                  &quot;{item.description}&quot;
                </p>
              )}
            </div>

            {item.certificate_url ? (
              <a
                href={item.certificate_url}
                target="_blank"
                className="mt-6 text-xs font-bold text-accent border border-accent/20 px-4 py-2.5 rounded-full hover:bg-accent hover:text-bg transition-all inline-block w-full text-center uppercase tracking-tighter"
              >
                View Credential ?
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <div className="hidden md:grid md:grid-cols-2 w-full relative">
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
                className="w-full max-w-sm h-120 p-8 rounded-3xl border border-white/10 bg-bg flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                    <HiOutlineTrophy size={30} />
                  </div>

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

                  {item.description && (
                    <p className="text-text/60 leading-relaxed italic text-sm line-clamp-6">
                      &quot;{item.description}&quot;
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  {item.certificate_url ? (
                    <a
                      href={item.certificate_url}
                      target="_blank"
                      className="text-xs font-bold text-accent border border-accent/20 px-6 py-3 rounded-full hover:bg-accent hover:text-bg transition-all inline-block w-full text-center uppercase tracking-tighter"
                    >
                      View Credential ?
                    </a>
                  ) : (
                    <div className="h-10" />
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

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
    </div>
  );
}
