"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/animation/Reveal";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

import Tabs from "./Tabs";

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
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);

  return (
    <motion.section
      ref={sectionRef}
      style={{ scale, rotate, y }}
      id="about"
      className="font-sans bg-bg px-6 py-20 text-text md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              About <span className="text-accent">Me</span>
            </h2>
            <div className="mx-auto h-1 w-20 rounded-full bg-accent"></div>
          </div>
        </Reveal>

        <div className="flex flex-col items-center justify-center space-y-12">
          <Reveal delay={0.2}>
            <div className="max-w-4xl space-y-6 text-center leading-relaxed text-text-muted">
              <p>
                I&apos;m an{" "}
                <span className="font-semibold text-text">AI Engineer</span>{" "}
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
                <span className="text-accent">
                  {" "}
                  AI Instructor at Digital Knights
                </span>
                , mentoring students and guiding them through hands-on machine
                learning and AI system development.
              </p>

              <p>
                I believe in bridging the gap between research and production -
                turning complex AI concepts into reliable, scalable solutions.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex max-w-screen flex-col items-center justify-between space-y-12 lg:justify-start">
              <Tabs visable={visable} setVisable={setVisable} />
              <div className="w-full px-4 md:px-28">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={visable}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    {visable === "skills" && <Skills skills={skills} />}
                    {visable === "experience" && (
                      <Experience experience={experience} />
                    )}
                    {visable === "education" && (
                      <Education education={education} />
                    )}
                    {visable === "achievements" && (
                      <Achievements achievements={achievements} />
                    )}
                    {visable === "certificates" && (
                      <Certifications certificates={certificates} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </motion.section>
  );
}
