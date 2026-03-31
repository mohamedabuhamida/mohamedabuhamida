"use client";

import { useRef } from "react";
import Reveal from "@/components/animation/Reveal";
import { useScroll } from "framer-motion";

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
  // 1. UNIQUE REF for Experience
  const expRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: expScroll } = useScroll({
    target: expRef,
    offset: ["start start", "end end"],
  });

  return (
    <div id="about" className="relative bg-black">
      {/* 1. INTRO SECTION */}
      <StickySection className="bg-bg border-t border-white/5">
        <div className="max-w-4xl mx-auto w-full">
          <Reveal>
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                About <span className="text-accent">Me</span>
              </h2>
              <div className="mx-auto h-1.5 w-20 rounded-full bg-accent"></div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="space-y-6 text-center leading-relaxed text-text-muted text-lg">
              <p>
                I&apos;m an <span className="font-semibold text-text">AI Engineer</span> passionate about building intelligent, production-ready systems powered by
                <span className="text-accent"> LLMs</span>, RAG architectures, and scalable AI pipelines.
              </p>
              <p>
                My experience spans across computer vision, NLP, and AI-driven automation. I enjoy turning complex ideas into practical, scalable applications.
              </p>
              <p className="hidden md:block text-sm uppercase tracking-[0.3em] text-accent/40 pt-10 animate-pulse">
                Scroll to explore my journey ↓
              </p>
            </div>
          </Reveal>
        </div>
      </StickySection>

      {/* 2. SKILLS SECTION */}
      <StickySection className="bg-linear-to-tr from-bg to-primary/10 shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <SectionHeader title="Technical" accent="Skills" />
          <div className="w-full">
            <Skills skills={skills} />
          </div>
        </div>
      </StickySection>

      {/* 3. EXPERIENCE SECTION (Internal Scroll) */}
      <div ref={expRef} className="h-[250vh] relative">
        <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center bg-bg shadow-[0_-50px_50px_rgba(0,0,0,0.8)] overflow-hidden">
          <SectionHeader title="Professional" accent="Experience" />
          <div className="w-full h-full max-w-5xl mx-auto">
            <Experience experience={experience} scrollYProgress={expScroll} />
          </div>
        </div>
      </div>

      {/* 4. EDUCATION SECTION */}
      <StickySection className="bg-linear-to-tr from-bg to-primary/10 shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <SectionHeader title="Academic" accent="Background" />
          <div className="w-full">
            <Education education={education} />
          </div>
        </div>
      </StickySection>

      {/* 5. CERTIFICATIONS SECTION */}
      <StickySection className="bg-bg shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
          <SectionHeader title="Certifications" accent="" />
          <div className="w-full overflow-y-auto max-h-[70vh] no-scrollbar px-4">
            <Certifications certificates={certificates} />
          </div>
        </div>
      </StickySection>

      {/* 6. ACHIEVEMENTS SECTION (Sticky Cards) */}
      <section
        id="achievements"
        className="relative bg-linear-to-tr from-bg to-primary/10 shadow-[0_-50px_50px_rgba(0,0,0,0.8)]"
      >
        <Achievements achievements={achievements} />
      </section>
    </div>
  );
}

// --- REUSABLE SUB-COMPONENTS ---

function StickySection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`sticky top-0 h-screen w-full flex items-center justify-center px-6 md:px-12 overflow-hidden ${className}`}
    >
      {/* 
          This inner div ensures that whatever children you pass 
          are treated as a single block that stays centered 
      */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </section>
  );
}

function SectionHeader({ title, accent }: { title: string; accent: string }) {
  return (
    <Reveal>
      <div className="mb-10 text-center w-full">
        <h2 className="text-2xl md:text-4xl font-bold text-text">
          {title} <span className="text-accent">{accent}</span>
        </h2>
        <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-accent/50" />
      </div>
    </Reveal>
  );
}