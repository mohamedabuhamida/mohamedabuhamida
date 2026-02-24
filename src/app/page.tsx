"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Hero from "@/components/Hero";
import About from "@/components/(about)/About";
import { useState, useEffect } from "react";
import LoadingWrapper from "@/components/LoadingWrapper";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
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
  const [error, setError] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillProps[]>([]);
  const [education, setEducation] = useState<EducationProps[]>([]);
  const [experience, setExperience] = useState<ExperienceProps[]>([]);
  const [achievements, setAchievements] = useState<AchievementProps[]>([]);
  const [certificates, setCertificates] = useState<CertificateProps[]>([]);
  const [projects, setProjects] = useState<ProjectProps[]>([]);

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

      <Hero data={heroData!} />
      <About
        skills={skills}
        education={education}
        experience={experience}
        achievements={achievements}
        certificates={certificates}
      />
      <ProjectsSection projects={projects} />
      <ContactSection />
      <Footer />
    </LoadingWrapper>
  );
}
