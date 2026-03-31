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
        <Reveal>
          <div className="mb-8 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              About <span className="text-accent">Me</span>
            </h2>
            <div className="mx-auto h-1.5 w-20 rounded-full bg-accent"></div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="max-w-4xl space-y-6 text-center leading-relaxed text-text-muted text-base md:text-lg">
            <p>
              I&apos;m an{" "}
              <span className="font-semibold text-text">AI Engineer</span>{" "}
              passionate about building intelligent, production-ready systems
              powered by
              <span className="text-accent"> LLMs</span>, RAG architectures, and
              scalable AI pipelines. I focus on designing end-to-end solutions —
              from data preprocessing and model development to deployment and
              real-world integration.
            </p>

            <p>
              My experience spans across computer vision, natural language
              processing, and AI-driven automation, where I&apos;ve developed
              systems that solve real-world problems with measurable impact. I
              enjoy working at the intersection of engineering and intelligence
              — turning complex ideas into practical, scalable applications.
            </p>

            <p>
              Beyond building models, I care about creating complete AI products
              — systems that are reliable, efficient, and ready for real users.
              Whether it&apos;s deploying ML models, integrating APIs, or
              designing intelligent agents, I aim to deliver solutions that go
              beyond experimentation into production.
            </p>

            <p className="hidden md:block text-sm uppercase tracking-[0.3em] text-accent/40 pt-10 animate-pulse">
              Scroll to explore my journey ↓
            </p>
          </div>
        </Reveal>
      </StickySection>

      {/* 2. SKILLS SECTION */}
      <StickySection className="bg-linear-to-tr from-bg to-primary shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <SectionHeader title="Technical" accent="Skills" />
          <div className="w-full ">
            <Skills skills={skills} />
          </div>
        </div>
      </StickySection>

      {/* 3. EXPERIENCE SECTION (Sticky Scroll Container) */}
      <div ref={expRef} className="relative lg:h-[250vh]">
        <div className="w-full flex flex-col items-center justify-center bg-bg shadow-[0_-50px_50px_rgba(0,0,0,0.8)] overflow-visible px-4 py-16 lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden lg:px-0 lg:py-0">
          <SectionHeader title="Professional" accent="Experience" />
          <div className="w-full max-w-5xl lg:h-full">
            <Experience experience={experience} scrollYProgress={expScroll} />
          </div>
        </div>
      </div>

      {/* 4. EDUCATION SECTION */}
      <StickySection className="bg-linear-to-tr from-bg to-primary shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <SectionHeader title="Academic" accent="Background" />
        <div className="w-full max-w-5xl px-4">
          <Education education={education} />
        </div>
      </StickySection>

      {/* 5. CERTIFICATIONS SECTION */}
      <StickySection className="bg-bg shadow-[0_-50px_50px_rgba(0,0,0,0.8)]">
        <SectionHeader title="Certifications" accent="" />
        <div className="w-full max-w-6xl px-2 md:px-4 lg:overflow-y-auto lg:max-h-[80vh] no-scrollbar">
          <Certifications certificates={certificates} />
        </div>
      </StickySection>

      {/* 6. ACHIEVEMENTS SECTION (Sticky Scroll Container) */}
      <section
        id="achievements"
        className="relative bg-linear-to-tr from-bg to-primary shadow-[0_-50px_50px_rgba(0,0,0,0.8)]"
      >
        <Achievements achievements={achievements} />
      </section>
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
      className={`w-full flex flex-col items-center justify-center px-4 py-16 md:p-12 lg:sticky lg:top-0 lg:h-screen lg:p-24 lg:overflow-hidden ${className}`}
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
