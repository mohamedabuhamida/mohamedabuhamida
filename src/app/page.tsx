  "use client";

  import Header from "@/components/Header";
  import Footer from "@/components/Footer";

  import Hero from "@/components/Hero";
  import About from "@/components/(about)/About";
  import { useState, useEffect, useRef } from "react";
  import LoadingWrapper from "@/components/LoadingWrapper";
  import Projects from "@/components/Projects";
  import Contact from "@/components/Contact";
  import { useMotionValue, useScroll } from "framer-motion";
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
    const fallbackProgress = useMotionValue(0);

    const fetchHero = async () => {
      try {
        const res = await fetch("/api/hero");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setHeroData(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch hero data");
      }
    };

    const fetchSkills = async () => {
      try {
        const res = await fetch("/api/skills");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSkills(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch skills");
      }
    };

    const fetchEducation = async () => {
      try {
        const res = await fetch("/api/education");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEducation(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch education");
      }
    };

    const fetchExperience = async () => {
      try {
        const res = await fetch("/api/experience");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExperience(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch experience");
      }
    };

    const fetchAchievements = async () => {
      try {
        const res = await fetch("/api/achievements");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAchievements(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch achievements");
      }
    };

    const fetchCertificates = async () => {
      try {
        const res = await fetch("/api/certificates");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCertificates(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch certificates");
      }
    };
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch Projects");
      }
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

        {isMounted ? (
          <HeroAboutTransition
            data={heroData!}
            skills={skills}
            education={education}
            experience={experience}
            achievements={achievements}
            certificates={certificates}
          />
        ) : (
          <main className="relative h-[200vh] bg-linear-to-b from-bg via-primary to-bg">
            <Hero data={heroData!} scrollYProgress={fallbackProgress} />
            <About
              skills={skills}
              education={education}
              experience={experience}
              achievements={achievements}
              certificates={certificates}
            />
          </main>
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
    const heroAboutRef = useRef<HTMLElement | null>(null);
    const { scrollYProgress } = useScroll({
      target: heroAboutRef,
      offset: ["start start", "end end"],
    });

    return (
      <main
        ref={heroAboutRef}
        className="relative h-[200vh] bg-linear-to-b from-bg via-primary to-bg"
      >
        <Hero data={data} scrollYProgress={scrollYProgress} />
        <About
          skills={skills}
          education={education}
          experience={experience}
          achievements={achievements}
          certificates={certificates}
        />
      </main>
    );
  }
