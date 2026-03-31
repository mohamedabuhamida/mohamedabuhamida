"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/(about)/About";
import { useState, useEffect, useRef } from "react";
import LoadingWrapper from "@/components/LoadingWrapper";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
<<<<<<< ours
// Import motion and useTransform
import { useMotionValue, useScroll, useTransform, motion } from "framer-motion";
=======
import { useScroll } from "framer-motion";
>>>>>>> theirs
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
  const heroAboutRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroAboutProgress } = useScroll({
    target: heroAboutRef,
    offset: ["start start", "end end"],
  });
  const [heroData, setHeroData] = useState<HeroProps["data"] | null>(null);
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
<<<<<<< ours
      {isMounted && heroData ? (
        <HeroAboutTransition
          data={heroData}
=======

      <main
        ref={heroAboutRef}
        className="relative h-[200vh] bg-linear-to-b from-bg via-primary to-bg"
      >
        <Hero data={heroData!} scrollYProgress={heroAboutProgress} />
        <About
>>>>>>> theirs
          skills={skills}
          education={education}
          experience={experience}
          achievements={achievements}
          certificates={certificates}
          scrollYProgress={heroAboutProgress}
        />
<<<<<<< ours
      ) : (
        <div className="h-screen bg-bg" />
      )}
=======
      </main>
>>>>>>> theirs
      <Projects projects={projects} />
      <Contact />
      <Footer />
    </LoadingWrapper>
  );
}
<<<<<<< ours

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
  const aboutRef = useRef<HTMLElement | null>(null);
  
  // Track scroll specifically when the About section is moving 
  // from the bottom of the screen to the top of the screen.
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "start start"],
  });

  // Hero animations (shrinks as About comes up)
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const heroRotate = useTransform(scrollYProgress, [0, 1], [0, -5]);
  
  // About animations (scales up as it arrives)
  const aboutScale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const aboutRotate = useTransform(scrollYProgress, [0, 1], [5, 0]);

  return (
    <main className="relative bg-black">
      {/* 1. HERO SECTION: Sticky so it stays put while About scrolls over it */}
      <motion.section
        style={{ scale: heroScale, rotate: heroRotate }}
        className="sticky top-0 h-screen overflow-hidden z-0"
      >
        <div id="home" className="absolute top-0 left-0 h-px w-px" />
        <Hero data={data} scrollYProgress={scrollYProgress} />
      </motion.section>

      {/* 2. ABOUT SECTION: Relative so it pushes the rest of the page down naturally */}
      <motion.section
        ref={aboutRef}
        id="about" // This ID is used by your Header observer
        style={{ scale: aboutScale, rotate: aboutRotate }}
        className="relative z-10 bg-bg shadow-[0_-50px_100px_rgba(0,0,0,0.5)] origin-top"
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
=======
>>>>>>> theirs
