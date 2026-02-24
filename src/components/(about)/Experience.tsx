"use client";

import { motion } from "framer-motion";
import Carousel from "@/components/ui/Carousel";
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
    <Carousel
      title="Experience"
      items={sortedExperience}
      renderItem={(item) => (
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="group flex flex-col h-full p-6 rounded-2xl border border-border bg-background/60 backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-xl hover:border-accent/40"
        >
          {/* Header */}
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <h4 className="text-lg font-semibold">
                {item.job_title}
              </h4>

              <p className="text-accent text-sm font-medium">
                {item.company}
              </p>
            </div>

            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDate(item.start_date)} —{" "}
              {item.is_current
                ? "Present"
                : formatDate(item.end_date)}
            </span>
          </div>

          {/* Description */}
          {item.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          )}
        </motion.div>
      )}
    />
  );
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}