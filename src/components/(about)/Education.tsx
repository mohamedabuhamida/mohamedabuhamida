"use client";

import { motion } from "framer-motion";
import { EducationProps } from "@/types";

export default function Education({
  education,
}: {
  education: EducationProps[];
}) {
  const sortedEducation = [...education].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      <div className="grid grid-cols-1 gap-8">
        {sortedEducation.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/30 backdrop-blur-sm p-1 transition-all duration-500 hover:border-accent/30"
          >
            {/* Subtle Gradient Background on Hover */}
            <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex flex-col md:flex-row gap-8 p-8 lg:p-10">
              
              {/* LEFT SIDE: INSTITUTION LOGO & DATES */}
              <div className="flex flex-col items-center md:items-start md:w-1/4 shrink-0 space-y-4">
                <div className="relative p-4 bg-white rounded-2xl shadow-xl shadow-black/20 group-hover:scale-105 transition-transform duration-500">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt={item.institution}
                      className="w-20 h-20 md:w-24 md:h-24 object-contain"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-accent/10 text-accent text-4xl">
                      🎓
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                   <p className="text-xs font-mono text-text/40 uppercase tracking-widest">
                     Timeline
                   </p>
                   <p className="text-sm font-semibold text-text/80">
                     {formatDate(item.start_date)} — {formatDate(item.end_date)}
                   </p>
                </div>
              </div>

              {/* RIGHT SIDE: CONTENT */}
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-text">
                      {item.degree}
                    </h3>
                    {item.grade && (
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-tighter bg-accent text-bg rounded-md">
                        Grade: {item.grade}
                      </span>
                    )}
                  </div>
                  <p className="text-xl text-accent font-medium leading-tight">
                    {item.field_of_study}
                  </p>
                  <p className="text-lg text-text/60 font-semibold italic">
                    {item.institution}
                  </p>
                </div>

                {item.description && (
                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent/20 rounded-full" />
                    <p className="pl-6 text-text/50 leading-relaxed text-sm md:text-base italic">
                      {item.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}