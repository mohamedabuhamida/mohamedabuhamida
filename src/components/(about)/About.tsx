"use client";

import { useRef } from "react";
import Reveal from "@/components/animation/Reveal";
import { useScroll, useTransform } from "framer-motion";

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
  // --- EXPERIENCE SCROLL LOGIC ---
  // We track the scroll specifically for the Experience container
  // 1. Ref for Experience (existing)
  const expRef = useRef(null);
  const { scrollYProgress: expScroll } = useScroll({
    target: expRef,
    offset: ["start start", "end end"],
  });

  // 2. Ref for Achievements (NEW)
  const achieveRef = useRef(null);
  const { scrollYProgress: achieveScroll } = useScroll({
    target: achieveRef,
    offset: ["start start", "end end"],
  });

  return (
    <div id="about" className="relative bg-black">
      {/* 1. INTRO SECTION */}
      <StickySection className="bg-bg border-t border-white/5">
        <Reveal>
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              About <span className="text-accent">Me</span>
            </h2>
            <div className="mx-auto h-1.5 w-20 rounded-full bg-accent"></div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="max-w-4xl space-y-6 text-center leading-relaxed text-text-muted text-lg">
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
              I believe in bridging the gap between research and production -
              turning complex AI concepts into reliable, scalable solutions.
            </p>
            <p className="hidden md:block text-sm uppercase tracking-[0.3em] text-accent/40 pt-10 animate-pulse">
              Scroll to explore my journey ↓
            </p>
          </div>
        </Reveal>
      </StickySection>

      {/* 2. SKILLS SECTION */}
      <StickySection className="bg-linear-to-tr from-bg to-primary shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <SectionHeader title="Technical" accent="Skills" />
        <div className="w-full max-w-5xl px-4">
          <Skills skills={skills} />
        </div>
      </StickySection>

      {/* 3. EXPERIENCE SECTION (Special Sticky Scroll) */}
      <div ref={expRef} className="h-[250vh] relative">
        <section className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-bg shadow-[0_-50px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          <SectionHeader title="Professional" accent="Experience" />
          <div className="w-full h-full max-w-5xl">
            {/* Pass the scroll progress to the Experience component */}
            <Experience experience={experience} scrollYProgress={expScroll} />
          </div>
        </section>
      </div>

      {/* 4. EDUCATION SECTION */}
      <StickySection className="bg-linear-to-tr from-bg to-primary shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <SectionHeader title="Academic" accent="Background" />
        <div className="w-full max-w-5xl px-4">
          <Education education={education} />
        </div>
      </StickySection>

      <div ref={achieveRef} className="h-[250vh] relative">
        <StickySection className="bg-black shadow-[0_-50px_50px_rgba(0,0,0,0.8)] ">
          <SectionHeader title="Achievements" accent="" />
          <div className="w-full max-w-5xl px-4">
            <Achievements
              achievements={achievements}
              scrollYProgress={achieveScroll}
            />
          </div>
        </StickySection>
      </div>

      {/* 5. ACHIEVEMENTS & CERTIFICATES */}
      <StickySection className="bg-linear-to-tr from-bg to-primary shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <SectionHeader title="Certifications" accent="" />
        <div className="w-full max-w-5xl px-4">
          <Certifications certificates={certificates} />
        </div>
      </StickySection>
    </div>
  );
}

// --- SUB-COMPONENTS ---

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
