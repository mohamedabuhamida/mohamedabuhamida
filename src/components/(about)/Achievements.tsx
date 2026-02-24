"use client";

import { motion } from "framer-motion";
import Carousel from "@/components/ui/Carousel";
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
    <Carousel
      title="Achievements"
      items={sortedAchievements}
      renderItem={(item) => (
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="group flex flex-col h-full p-6 rounded-2xl border border-border bg-background/70 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl hover:border-accent/40"
        >
          {/* Content */}
          <div className="flex-1 space-y-3">
            <h4 className="text-lg font-semibold leading-snug">
              🏆 {item.title}
            </h4>

            {item.organization && (
              <p className="text-accent text-sm font-medium">
                {item.organization}
              </p>
            )}

            {item.date && (
              <p className="text-xs text-muted-foreground">
                {formatDate(item.date)}
              </p>
            )}

            {item.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {item.description}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 min-h-6">
            {item.certificate_url ? (
              <a
                href={item.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                View Certificate ↗
              </a>
            ) : (
              <span className="invisible text-sm">placeholder</span>
            )}
          </div>
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