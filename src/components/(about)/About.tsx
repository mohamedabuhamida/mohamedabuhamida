import React from "react";
import Reveal from "@/components/animation/Reveal";
import { FaGraduationCap } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { TbTopologyStar3 } from "react-icons/tb";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <section
      id="about"
      className="font-sans bg-bg text-text py-20 px-6 md:px-12 lg:px-24  overflow-hidden "
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <Reveal>
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              About <span className="text-accent">Me</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
          </div>
        </Reveal>

        <div className="flex flex-col justify-center items-center space-y-12">
          {/* Left: Text */}
          <Reveal delay={0.2}>
            <div className="space-y-6 text-text-muted leading-relaxed max-w-4xl text-center ">
              <p>
                I'm an{" "}
                <span className="text-text font-semibold">AI Engineer</span>{" "}
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
                I believe in bridging the gap between research and production —
                turning complex AI concepts into reliable, scalable solutions.
              </p>
            </div>
          </Reveal>

          {/* Right: Skills Grid */}
          <Reveal delay={0.3}>
            <div className=" flex flex-col space-y-12 justify-between items-center lg:justify-start  max-w-screen">
              <Tabs visable={visable} setVisable={setVisable} />
              <div className="w-full px-4 md:px-28 ">
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
    </section>
  );
}
