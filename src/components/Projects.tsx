"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FastAverageColor } from "fast-average-color";
import { ProjectProps } from "@/types";

// Configuration for the gallery layout
const ITEM_WIDTH = 400;
const GAP = 30;

/* ---------------------------------- */
/* 🎨 Custom Hook to Get Image Color */
/* ---------------------------------- */
function useDominantColor(imageSrc: string) {
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;

    const fac = new FastAverageColor();

    img.onload = async () => {
      try {
        const result = await fac.getColorAsync(img);
        setColor(result.hex);
      } catch {
        setColor("#ffffff");
      }
    };

    return () => {
      fac.destroy();
    };
  }, [imageSrc]);

  return color;
}

/* ---------------------------------- */
/* 🧩 Project Card Component */
/* ---------------------------------- */
function ProjectCard({
  project,
  index,
}: {
  project: ProjectProps;
  index: number;
}) {
  const imageSrc = project.hero_image || project.image;
  const borderColor = useDominantColor(imageSrc);

  return (
    <div
      className="gallery-item group"
      style={{
        flexShrink: 0,
        width: `${ITEM_WIDTH}px`,
        height: "500px",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#111",
        border: `1px solid ${borderColor}88`,
        boxShadow: `0 0 40px ${borderColor}33`,
        transition: "all 0.4s ease",
      }}
    >
      {/* Background Image */}
      <img
        src={imageSrc}
        alt={project.title}
        crossOrigin="anonymous"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/30 to-transparent opacity-90" />

      {/* Content */}
      <div className="absolute bottom-8 left-8 z-10">
        <span className="text-sm font-mono text-white/50 block mb-2">
          0{index + 1}
        </span>

        <h3 className="text-2xl font-semibold text-white mb-2">
          {project.title}
        </h3>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] uppercase tracking-widest text-white/70 border border-white/20 px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            className="inline-block text-xs font-bold text-white border-b border-white pb-1 hover:text-white/70 hover:border-white/70 transition"
          >
            VIEW PROJECT ↗
          </a>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* 🖼️ Projects Section */
/* ---------------------------------- */
export default function Projects({
  projects,
}: {
  projects: ProjectProps[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const totalDistance = (projects.length - 1) * (ITEM_WIDTH + GAP);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <section id="projects">
      {/* Heading */}
      <div className="py-5 text-center">
        <h2 className="text-4xl md:text-5xl font-semibold text-white uppercase">
          Selected Projects
        </h2>
      </div>

      {/* Scroll Container */}
      <div ref={containerRef} className="relative h-[400vh]">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="relative w-full max-w-[1000px] h-[520px]">
            <motion.div
              style={{
                x,
                display: "flex",
                gap: `${GAP}px`,
              }}
            >
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Responsive Fix */}
      <style jsx>{`
        @media (max-width: 600px) {
          .gallery-item {
            width: 280px !important;
            height: 350px !important;
          }
        }
      `}</style>
    </section>
  );
}