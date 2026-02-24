"use client";

import { motion } from "framer-motion";
import Carousel from "@/components/ui/Carousel";
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
    <Carousel
      title="Education"
      items={sortedEducation}
      renderItem={(item) => (
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="group flex flex-col h-full p-6 rounded-2xl border border-border bg-background/70 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/40"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-4">
            {item.logo_url && (
              <img
                src={item.logo_url}
                alt={item.institution}
                className="w-14 h-14 object-contain rounded-lg bg-white p-1"
              />
            )}

            <div>
              <h4 className="text-lg font-semibold leading-snug">
                {item.degree}
                {item.field_of_study && (
                  <span className="text-accent">
                    {" "}in {item.field_of_study}
                  </span>
                )}
              </h4>

              <p className="text-muted-foreground">
                {item.institution}
              </p>
            </div>
          </div>

          {/* Dates */}
          <p className="text-sm text-muted-foreground mb-2">
            {formatDate(item.start_date)} — {formatDate(item.end_date)}
          </p>

          {/* GPA Badge */}
          {item.grade && (
            <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-accent rounded-full mb-3 w-fit">
              🎓 {item.grade}
            </span>
          )}

          {/* Description */}
          {item.description && (
            <p className="text-muted-foreground leading-relaxed mt-auto">
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