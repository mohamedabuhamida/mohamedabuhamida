"use client";

import { motion } from "framer-motion";
import { ExperienceProps } from "@/types";

export default function Experience({
  experience,
}: {
  experience: ExperienceProps[];
}) {
  const sortedExperience = [...experience].sort(
    (a, b) => (b.order_index ?? 0) - (a.order_index ?? 0)
  );

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-text">
          Experience
        </h3>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-accent" />
      </div>

      <div className="relative pl-6 md:pl-10">
        <div className="absolute bottom-0 left-[11px] top-0 w-px bg-border md:left-[19px]" />

        <div className="space-y-8">
          {sortedExperience.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="relative"
            >
              <span className="absolute left-[-24px] top-8 h-5 w-5 rounded-full border-4 border-bg bg-accent shadow-[0_0_0_6px_rgba(255,255,255,0.04)] md:left-[-32px]" />

              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="group rounded-2xl border border-border bg-background/60 p-6 shadow-md backdrop-blur-md transition-all duration-300 hover:border-accent/40 hover:shadow-xl"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-lg font-semibold text-text">
                        {item.job_title}
                      </h4>
                      <p className="text-sm font-medium text-accent">
                        {item.company}
                      </p>
                    </div>

                    {(item.location || item.employment_type) && (
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {item.location && (
                          <span className="rounded-full border border-border px-3 py-1">
                            {item.location}
                          </span>
                        )}
                        {item.employment_type && (
                          <span className="rounded-full border border-border px-3 py-1">
                            {item.employment_type}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-sm whitespace-nowrap text-muted-foreground">
                    {formatDateRange(
                      item.start_date,
                      item.end_date,
                      item.is_current
                    )}
                  </span>
                </div>

                {item.description && (
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
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

function formatDateRange(
  startDate?: string,
  endDate?: string,
  isCurrent?: boolean
) {
  const start = formatDate(startDate);
  const end = isCurrent ? "Present" : formatDate(endDate);

  if (start && end) return `${start} - ${end}`;
  return start || end;
}
