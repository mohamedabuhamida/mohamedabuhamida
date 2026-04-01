"use client";

import { useMemo } from "react";
import HorizontalScrollSection from "@/components/ui/HorizontalScroll";
import ProjectCard from "@/components/ProjectCard";
import { ProjectProps } from "@/types";

export default function Projects({ projects }: { projects: ProjectProps[] }) {
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const featuredDiff = Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured));
      if (featuredDiff !== 0) return featuredDiff;

      const orderDiff =
        (b.display_order ?? b.order_index ?? 0) - (a.display_order ?? a.order_index ?? 0);
      if (orderDiff !== 0) return orderDiff;

      const createdAtDiff =
        new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime();
      if (createdAtDiff !== 0) return createdAtDiff;

      return a.title.localeCompare(b.title);
    });
  }, [projects]);

  return (
    <section id="projects">
      <div className="py-5 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-white uppercase">
          Selected Projects
        </h2>
      </div>

      <HorizontalScrollSection
        items={sortedProjects}
        itemWidth={400}
        gap={30}
        containerHeight="400vh"
        renderItem={(project, index) => (
          <ProjectCard project={project} index={index} />
        )}
      />
    </section>
  );
}
