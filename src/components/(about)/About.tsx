"use client";

import { useRef } from "react";
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
  return (
    // The outer container handles the ID for the Header observer
    <div id="about" className="relative">
      {/* 1. INTRO SECTION */}
      <StickySection className="bg-bg border-t border-white/5">
        <Reveal delay={0.2}>
          <div className="max-w-4xl space-y-6 text-center leading-relaxed text-text-muted">
            <p>
              I&apos;m an{" "}
              <span className="font-semibold text-text">AI Engineer</span>{" "}
              focused on building intelligent systems powered by
              <span className="text-accent"> Large Language Models (LLMs)</span>
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
        <Reveal delay={0.2}>
          <div className="max-w-3xl space-y-6 text-center text-lg leading-relaxed text-text-muted">
            <p>
              I&apos;m an{" "}
              <span className="font-semibold text-text">AI Engineer</span>{" "}
              focused on building intelligent systems powered by
              <span className="text-accent"> LLMs</span>, RAG, and modern AI
              pipelines.
            </p>
            <p>
              Alongside engineering, I serve as an
              <span className="text-accent">
                {" "}
                AI Instructor at Digital Knights
              </span>
              , mentoring students in ML and AI development.
            </p>
            <p className="hidden md:block text-sm uppercase tracking-widest text-accent/50 pt-10">
              Scroll to explore my journey ↓
            </p>
          </div>
        </Reveal>
      </StickySection>

      {/* 2. SKILLS SECTION */}
      <StickySection className="bg-neutral-900 shadow-[0_-50px_50px_rgba(0,0,0,0.5)]">
        <SectionHeader title="Technical" accent="Skills" />
        <div className="w-full max-w-5xl px-4 overflow-y-auto max-h-[70vh]">
          <Skills skills={skills} />
        </div>
      </StickySection>

      {/* 3. EXPERIENCE SECTION */}
      <StickySection className="bg-bg shadow-[0_-50px_50px_rgba(0,0,0,0.5)]">
        <SectionHeader title="Professional" accent="Experience" />
        <div className="w-full max-w-5xl px-4 overflow-y-auto max-h-[70vh]">
          <Experience experience={experience} />
        </div>
      </StickySection>

      {/* 4. EDUCATION SECTION */}
      <StickySection className="bg-neutral-900 shadow-[0_-50px_50px_rgba(0,0,0,0.5)]">
        <SectionHeader title="Academic" accent="Background" />
        <div className="w-full max-w-5xl px-4">
          <Education education={education} />
        </div>
      </StickySection>

      {/* 5. ACHIEVEMENTS & CERTIFICATES */}
      <StickySection className="bg-bg shadow-[0_-50px_50px_rgba(0,0,0,0.5)]">
        <SectionHeader title="Awards &" accent="Certifications" />
        <div className="w-full max-w-5xl px-4 grid md:grid-cols-2 gap-8 overflow-y-auto max-h-[70vh]">
          <Achievements achievements={achievements} />
          <Certifications certificates={certificates} />
        </div>
      </StickySection>
    </div>
  );
}

// --- HELPER COMPONENTS FOR CLEANER CODE ---

function StickySection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`sticky top-0 h-screen w-full flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 overflow-hidden ${className}`}
    >
      {/* Background Pattern Mask */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </section>
  );
}

function SectionHeader({ title, accent }: { title: string; accent: string }) {
  return (
    <Reveal>
      <div className="mb-10 text-center">
        <h2 className="text-2xl md:text-4xl font-bold">
          {title} <span className="text-accent">{accent}</span>
        </h2>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-accent/50" />
      </div>
    </Reveal>
  );
}
