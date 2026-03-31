"use client";

import { motion } from "framer-motion";
import { HiCheck } from "react-icons/hi2";
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
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/80">
            Career Path
          </p>
          <h3 className="mt-2 text-2xl font-bold text-text md:text-3xl">
            Experience Timeline
          </h3>
        </div>

        <div className="relative mx-auto max-w-4xl py-4">
          <div className="absolute left-1/2 top-0 hidden h-full w-[3px] -translate-x-1/2 rounded-full bg-[#173F78] md:block" />

          <div className="space-y-5 md:space-y-2">
            {sortedExperience.map((item, index) => {
              const isCurrent = Boolean(item.is_current);
              const isLeft = index % 2 === 0;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.08 }}
                  className="relative md:grid md:grid-cols-[1fr_64px_1fr] md:items-center"
                >
                  <div
                    className={`${
                      isLeft
                        ? "md:col-start-1 md:justify-self-end md:pr-6"
                        : "md:col-start-3 md:justify-self-start md:pl-6"
                    }`}
                  >
                    <TimelineCard item={item} isCurrent={isCurrent} />
                  </div>

                  <div className="absolute left-0 top-6 flex items-center md:static md:col-start-2 md:justify-center">
                    <div
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-[#0B1220]  ${
                        isCurrent
                          ? "bg-accent text-background"
                          : "bg-[#132949] text-white"
                      }`}
                    >
                      <HiCheck className={`${isCurrent ? "text-sm" : "text-xs"} opacity-95`} />
                    </div>
                  </div>

                  <div
                    className={`hidden md:block ${
                      isLeft ? "md:col-start-3" : "md:col-start-1"
                    }`}
                  />
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineCard({
  item,
  isCurrent,
}: {
  item: ExperienceProps;
  isCurrent: boolean;
}) {
  return (
    <div
      className={`ml-12 max-w-md rounded-2xl border px-5 py-4 transition-all duration-300 md:ml-0 ${
        isCurrent
          ? "border-accent/35 bg-[#111D30]"
          : "border-[#1B2638] bg-[#0F1726]"
      }`}
    >
      <div className="space-y-1">
        <h4 className="text-base font-semibold text-text">{item.job_title}</h4>
        <p
          className={`text-sm font-medium ${
            isCurrent ? "text-accent" : "text-muted-foreground"
          }`}
        >
          {item.company}
        </p>
      </div>

      {(item.start_date || item.end_date || item.is_current) && (
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground/80">
          {formatDateRange(item.start_date, item.end_date, item.is_current)}
        </p>
      )}

      {item.description && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {item.description}
        </p>
      )}
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
  return start || end || "";
}
