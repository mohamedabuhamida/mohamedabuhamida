"use client";

import { motion } from "framer-motion";
import { HiBriefcase } from "react-icons/hi2";
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
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 flex items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/80">
              Career Path
            </p>
            <h3 className="mt-2 text-2xl font-bold text-text md:text-3xl">
              Experience Timeline
            </h3>
          </div>

          <div className="hidden rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-sm text-muted-foreground md:block">
            {sortedExperience.length} roles
          </div>
        </div>

        <div className="space-y-6">
          {sortedExperience.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="grid gap-4 md:grid-cols-[170px_32px_minmax(0,1fr)] md:gap-6"
            >
              <div className="md:pt-5">
                <div className="inline-flex rounded-2xl border border-border bg-primary/10 px-4 py-3 text-sm font-medium text-muted-foreground">
                  {formatDateRange(item.start_date, item.end_date, item.is_current)}
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute bottom-[-28px] left-1/2 top-0 w-px -translate-x-1/2 bg-border" />
                <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-accent/30 bg-bg shadow-[0_0_0_6px_rgba(78,168,222,0.08)]">
                  <HiBriefcase className="text-sm text-accent" />
                </div>
              </div>

              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
                className="relative overflow-hidden rounded-[28px] border border-border/80 bg-linear-to-br from-background via-background to-primary/10 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.14)]"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-accent via-accent/70 to-transparent" />

                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-xl font-semibold text-text">
                        {item.job_title}
                      </h4>
                      <p className="text-base font-medium text-accent">
                        {item.company}
                      </p>
                    </div>

                    {(item.location || item.employment_type) && (
                      <div className="flex flex-wrap gap-2">
                        {item.location && (
                          <span className="rounded-full border border-border bg-bg/70 px-3 py-1 text-xs text-muted-foreground">
                            {item.location}
                          </span>
                        )}
                        {item.employment_type && (
                          <span className="rounded-full border border-border bg-bg/70 px-3 py-1 text-xs text-muted-foreground">
                            {item.employment_type}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {item.is_current && (
                    <span className="rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      Current
                    </span>
                  )}
                </div>

                {item.description && (
                  <p className="max-w-3xl leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                )}
              </motion.div>
            </motion.article>
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
  return start || end || "Timeline entry";
}
