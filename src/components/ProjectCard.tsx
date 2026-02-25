"use client";

import { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";
import { ProjectProps } from "@/types";

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

export default function ProjectCard({
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
      className="group relative h-[500px] rounded-2xl overflow-hidden bg-neutral-900 transition-all duration-500"
      style={{
        border: `1px solid ${borderColor}88`,
        boxShadow: `0 0 40px ${borderColor}33`,
      }}
    >
      <img
        src={imageSrc}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

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