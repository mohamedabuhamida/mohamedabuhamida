import React, { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/animation/Reveal";
import { motion } from "framer-motion";

import Tabs, { aboutTabs } from "./Tabs";

import Skills from "./Skills";
import Experience from "./Experience";
import Education from "./Education";
import Achievements from "./Achievements";
import Certifications from "./Certifications";

import {
  SkillProps,
  EducationProps,
  ExperienceProps,
  AchievementProps,
  CertificateProps,
} from "@/types";

export default function About({
  skills,
  education,
  experience,
  achievements,
  certificates,
}: {
  skills: SkillProps[];
  education: EducationProps[];
  experience: ExperienceProps[];
  achievements: AchievementProps[];
  certificates: CertificateProps[];
}) {
  const [visable, setVisable] = useState("skills");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections = useMemo(
    () => [
      {
        key: "skills",
        title: "Skills",
        content: <Skills skills={skills} />,
      },
      {
        key: "experience",
        title: "Experience",
        content: <Experience experience={experience} />,
      },
      {
        key: "education",
        title: "Education",
        content: <Education education={education} />,
      },
      {
        key: "achievements",
        title: "Achievements",
        content: <Achievements achievements={achievements} />,
      },
      {
        key: "certificates",
        title: "Certificates",
        content: <Certifications certificates={certificates} />,
      },
    ],
    [skills, experience, education, achievements, certificates]
  );

  useEffect(() => {
    const nodes = Object.values(sectionRefs.current).filter(
      (node): node is HTMLElement => Boolean(node)
    );

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const activeKey = visibleEntries[0].target.getAttribute("data-about-key");
        if (activeKey) {
          setVisable(activeKey);
        }
      },
      {
        threshold: [0.25, 0.45, 0.65],
        rootMargin: "-18% 0px -18% 0px",
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [sections]);

  const handleTabChange = (key: string) => {
    setVisable(key);
    sectionRefs.current[key]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="about"
      className="bg-bg px-6 py-20 font-sans text-text md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              About <span className="text-accent">Me</span>
            </h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-accent"></div>
          </div>
        </Reveal>

        <div className="mx-auto mb-16 max-w-4xl">
          <Reveal delay={0.2}>
            <div className="space-y-6 text-center leading-relaxed text-text-muted">
              <p>
                I'm an <span className="font-semibold text-text">AI Engineer</span>{" "}
                focused on building intelligent systems powered by
                <span className="text-accent">
                  {" "}
                  Large Language Models (LLMs)
                </span>
                , Retrieval-Augmented Generation (RAG), and modern AI pipelines.
              </p>

              <p>
                My work revolves around designing scalable AI architectures,
                integrating vector databases, and deploying real-world
                applications that transform data into actionable intelligence.
              </p>

              <p>
                Alongside engineering, I serve as an
                <span className="text-accent"> AI Instructor at Digital Knights</span>,
                mentoring students and guiding them through hands-on machine
                learning and AI system development.
              </p>

              <p>
                I believe in bridging the gap between research and production -
                turning complex AI concepts into reliable, scalable solutions.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-[88px_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex justify-center lg:block">
              <Tabs visable={visable} setVisable={handleTabChange} />
            </div>

            <div className="mt-6 hidden lg:flex lg:flex-col lg:gap-3">
              {aboutTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`text-left text-xs uppercase tracking-[0.28em] transition-colors ${
                    visable === tab.key
                      ? "text-accent"
                      : "text-muted-foreground hover:text-text"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section
                key={section.key}
                ref={(node) => {
                  sectionRefs.current[section.key] = node;
                }}
                data-about-key={section.key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.45, delay: index * 0.04 }}
                className="flex min-h-screen scroll-mt-28 items-center rounded-[32px] border border-border/70 bg-background/40 px-4 py-10 backdrop-blur-sm md:px-8"
              >
                <div className="w-full">
                  <div className="mb-8 flex items-center justify-between gap-4 border-b border-border/60 pb-4">
                    <h3 className="text-2xl font-semibold text-text md:text-3xl">
                      {section.title}
                    </h3>
                    <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {section.content}
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
