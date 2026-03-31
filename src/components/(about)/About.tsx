"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "@/components/animation/Reveal";
import { motion } from "framer-motion";

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
  const [activeSection, setActiveSection] = useState("skills");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections = useMemo(
    () => [
      {
        key: "skills",
        eyebrow: "Core Stack",
        title: "Skills That Power The Build",
        blurb:
          "The tools and technologies I rely on to turn AI ideas into production-ready systems.",
        content: <Skills skills={skills} />,
      },
      {
        key: "experience",
        eyebrow: "Career Path",
        title: "Experience Shaped By Real Systems",
        blurb:
          "Hands-on roles focused on applied AI, scalable pipelines, and practical delivery.",
        content: <Experience experience={experience} />,
      },
      {
        key: "education",
        eyebrow: "Foundation",
        title: "Education Behind The Engineering",
        blurb:
          "Academic work that strengthened the theory behind the production mindset.",
        content: <Education education={education} />,
      },
      {
        key: "achievements",
        eyebrow: "Highlights",
        title: "Milestones Worth Calling Out",
        blurb:
          "Selected wins, recognition, and moments that reflect impact beyond the day-to-day.",
        content: <Achievements achievements={achievements} />,
      },
      {
        key: "certificates",
        eyebrow: "Validation",
        title: "Certifications And Continued Growth",
        blurb:
          "Proof of ongoing learning across modern tooling, systems thinking, and AI practice.",
        content: <Certifications certificates={certificates} />,
      },
    ],
    [skills, experience, education, achievements, certificates]
  );

  const activeSectionData =
    sections.find((section) => section.key === activeSection) ?? sections[0];

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

        const currentKey =
          visibleEntries[0].target.getAttribute("data-about-key") ?? sections[0].key;
        setActiveSection(currentKey);
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-18% 0px -18% 0px",
      }
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [sections]);

  return (
    <section
      id="about"
      className="bg-bg px-6 py-20 font-sans text-text md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              About <span className="text-accent">Me</span>
            </h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-accent"></div>
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)]">
            <Reveal delay={0.15}>
              <div className="flex h-full flex-col justify-between rounded-[32px] border border-border/70 bg-linear-to-br from-background/80 via-background/65 to-primary/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <div className="space-y-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-accent/80">
                      {activeSectionData.eyebrow}
                    </p>
                    <h3 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                      {activeSectionData.title}
                    </h3>
                    <p className="mt-4 leading-7 text-muted-foreground">
                      {activeSectionData.blurb}
                    </p>
                  </div>

                  <div className="space-y-5 text-sm leading-7 text-text-muted">
                    <p>
                      I'm an <span className="font-semibold text-text">AI Engineer</span>{" "}
                      focused on building intelligent systems powered by
                      <span className="text-accent">
                        {" "}
                        Large Language Models (LLMs)
                      </span>
                      , Retrieval-Augmented Generation (RAG), and modern AI
                      pipelines.
                    </p>

                    <p>
                      My work centers on turning complex ideas into practical
                      software, from vector search and orchestration to
                      production-ready AI experiences.
                    </p>

                    <p>
                      Alongside engineering, I teach AI in hands-on settings and
                      enjoy helping people move from theory into real-world
                      implementation.
                    </p>
                  </div>
                </div>

                <div className="mt-10 space-y-3 border-t border-border/60 pt-6">
                  {sections.map((section, index) => (
                    <div
                      key={section.key}
                      className="flex items-center justify-between text-sm"
                    >
                      <span
                        className={
                          activeSection === section.key
                            ? "font-semibold text-accent"
                            : "text-muted-foreground"
                        }
                      >
                        {section.eyebrow}
                      </span>
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.section
                key={section.key}
                ref={(node) => {
                  sectionRefs.current[section.key] = node;
                }}
                data-about-key={section.key}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.22 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="flex min-h-screen items-center rounded-[32px] border border-border/70 bg-background/35 px-4 py-10 backdrop-blur-sm md:px-8"
              >
                <div className="w-full">
                  <div className="mb-8 border-b border-border/60 pb-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent/80">
                          {section.eyebrow}
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold text-text md:text-3xl">
                          {section.title}
                        </h3>
                      </div>

                      <span className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
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
