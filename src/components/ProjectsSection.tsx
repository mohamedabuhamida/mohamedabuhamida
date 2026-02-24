"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ProjectProps } from "@/types";

// Configuration for the gallery layout
const ITEM_WIDTH = 400;
const GAP = 30;

export default function ProjectsSection({
  projects,
}: {
  projects: ProjectProps[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate the total horizontal travel distance
  // (Number of items - 1) * (width + gap)
  const totalDistance = (projects.length - 1) * (ITEM_WIDTH + GAP);
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalDistance]);

  return (
    <section className="" id="projects">
      {/* Optional Intro Heading */}
      <div className="py-5 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter">
          Selected projects
        </h2>
      </div>

      {/* The scroll container: height determines scroll duration */}
      <div ref={containerRef} className="relative h-[400vh]">
        {/* Sticky Wrapper: stays centered in viewport while scrolling */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* The centered "window" through which the gallery slides */}
          <div className="relative w-full max-w-100 h-125">
            <motion.div 
              style={{ x, gap: `${GAP}px`, display: 'flex' }}
              className="flex items-center"
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="gallery-item group"
                  style={{
                    flexShrink: 0,
                    width: `${ITEM_WIDTH}px`,
                    height: "500px",
                    borderRadius: "16px",
                    position: "relative",
                    overflow: "hidden",
                    backgroundColor: "#111",
                  }}
                >
                  {/* Background Image */}
                  <img
                    src={project.hero_image || project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient Overlay (Tokyo Nights Style) */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-80" />

                  {/* Content */}
                  <div className="absolute bottom-8 left-8 z-10">
                    <span className="text-sm font-mono text-white/50 block mb-2">
                      0{index + 1}
                    </span>
                    <h3 className="text-3xl font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded">
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
              ))}
            </motion.div>
          </div>
        </div>
      </div>


      <style jsx>{`
        .gallery-item {
            /* Fallback for browsers that don't support tailwind scale well on images */
            will-change: transform;
        }

        @media (max-width: 600px) {
            /* Adjust sizes for mobile to prevent overflow */
            .gallery-item {
                width: 280px !important;
                height: 350px !important;
            }
        }
      `}</style>
    </section>
  );
}