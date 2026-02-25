"use client";

import HorizontalScrollSection from "@/components/ui/HorizontalScroll";
import ProjectCard from "@/components/ProjectCard";
import { ProjectProps } from "@/types";

export default function Projects({ projects }: { projects: ProjectProps[] }) {
  return (
    <section id="projects">
      <div className="py-5 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-white uppercase">
          Selected Projects
        </h2>
      </div>

      <HorizontalScrollSection
        items={projects}
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
