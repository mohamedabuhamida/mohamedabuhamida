"use client";

import { useState } from "react";
import Reveal from "@/components/animation/Reveal";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useTransform,
} from "framer-motion";

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
  scrollYProgress,
}: {
  skills: SkillProps[];
  education: EducationProps[];
  experience: ExperienceProps[];
  achievements: AchievementProps[];
  certificates: CertificateProps[];
  scrollYProgress: MotionValue<number>;
}) {
  const [visable, setVisable] = useState("skills");

  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [5, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 1], [0.7, 0.9, 1]);

  return (
    <motion.section
      style={{ scale, rotate, opacity }}
      id="about"
      className="relative h-screen overflow-hidden bg-bg font-sans text-text"
    >
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg to-primary/90" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-size-[54px_54px]" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-6 py-20 md:px-12 lg:px-24">
        <div className="w-full">
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
      </div>
    </motion.section>
  );
}
