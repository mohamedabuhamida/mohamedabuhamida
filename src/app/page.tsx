"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/(about)/About";
import { useState, useEffect, useRef } from "react";
import LoadingWrapper from "@/components/LoadingWrapper";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
// Import motion and useTransform
import { useMotionValue, useScroll, useTransform, motion } from "framer-motion";
import {
  HeroProps,
  SkillProps,
  EducationProps,
  ExperienceProps,
  AchievementProps,
  CertificateProps,
  ProjectProps,
} from "@/types";

export default function Home() {
  const [heroData, setHeroData] = useState<HeroProps["data"] | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillProps[]>([]);
  const [education, setEducation] = useState<EducationProps[]>([]);
  const [experience, setExperience] = useState<ExperienceProps[]>([]);
  const [achievements, setAchievements] = useState<AchievementProps[]>([]);
  const [certificates, setCertificates] = useState<CertificateProps[]>([]);
  const [projects, setProjects] = useState<ProjectProps[]>([]);

  // Logic for fetching data...
  const fetchHero = async () => {
    try {
      const res = await fetch("/api/hero");
      const data = await res.json();
      setHeroData(data);
    } catch (e) {
      setError("Failed");
    }
  };
  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (e) {}
  };
  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/education");
      const data = await res.json();
      setEducation(data);
    } catch (e) {}
  };
  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      setExperience(data);
    } catch (e) {}
  };
  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      setAchievements(data);
    } catch (e) {}
  };
  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      setCertificates(data);
    } catch (e) {}
  };
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (e) {}
  };

  useEffect(() => {
    setIsMounted(true);
    fetchHero();
    fetchSkills();
    fetchEducation();
    fetchExperience();
    fetchAchievements();
    fetchCertificates();
    fetchProjects();
  }, []);

  return (
    <LoadingWrapper isLoading={!heroData}>
      <Header />
      {isMounted && heroData ? (
        <HeroAboutTransition
          data={heroData}
          skills={skills}
          education={education}
          experience={experience}
          achievements={achievements}
          certificates={certificates}
        />
      ) : (
        <div className="h-screen bg-bg" />
      )}
      <Projects projects={projects} />
      <Contact />
      <Footer />
    </LoadingWrapper>
  );
}

function HeroAboutTransition({
  data,
  skills,
  education,
  experience,
  achievements,
  certificates,
}: {
  data: HeroProps["data"];
  skills: SkillProps[];
  education: EducationProps[];
  experience: ExperienceProps[];
  achievements: AchievementProps[];
  certificates: CertificateProps[];
}) {
  const containerRef = useRef<HTMLElement | null>(null);

  // Hook into the scroll progress of the 200vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero Animations: Shrink from 1 to 0.8 and rotate slightly
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);

  // About Animations: Grow from 0.8 to 1 and straighten up
  const aboutScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const aboutRotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <main ref={containerRef} className="relative h-[200vh] bg-black">
      {/* SECTION 1: HERO (Sticky) */}
      <motion.section
        style={{ scale: heroScale, rotate: heroRotate }}
        className="sticky top-0 h-screen overflow-hidden z-0"
      >
        <Hero data={data} scrollYProgress={scrollYProgress} />
      </motion.section>

      {/* SECTION 2: ABOUT (Relative - scrolls over/after Hero) */}
      <motion.section
        style={{ scale: aboutScale, rotate: aboutRotate }}
        className="relative min-h-screen z-10 bg-bg" // bg-bg ensures it hides the hero behind it
      >
        <About
          skills={skills}
          education={education}
          experience={experience}
          achievements={achievements}
          certificates={certificates}
        />
      </motion.section>
    </main>
  );
}
