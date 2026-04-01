"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Linkedin } from "lucide-react";
import { FaUpwork } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Navigation configuration - IDs must match the id="..." in your sections
  const navigationItems = [
    { label: "Home", href: "/#home", id: "home" },
    { label: "About", href: "/#about", id: "about" },
    { label: "Projects", href: "/#projects", id: "projects" },
    { label: "Contact", href: "/#contact", id: "contact" },
  ];

  // 1. Sticky header effect
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  // 3. Active section tracking
  useEffect(() => {
    const sectionIds = navigationItems.map((item) => item.id);

    const updateActiveSection = () => {
      const y = window.scrollY;

      // Keep Home active at the top.
      if (y < 120) {
        setActiveSection("home");
        return;
      }

      const marker = window.innerHeight * 0.35;
      let current = "home";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > marker) {
          current = id;
        }
      }

      // If user reached bottom, force Contact.
      if (window.innerHeight + y >= document.body.scrollHeight - 8) {
        current = "contact";
      }

      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out${
          isSticky
            ? "max-w-3xl mx-auto top-4" // Floating pill style when sticky
            : "max-w-7xl mx-auto top-0"
        }`}
      >
        <div
          className={`transition-all duration-500 px-6 sm:px-10 
          ${
            isSticky
              ? "bg-primary/20 backdrop-blur-md shadow-2xl rounded-full border border-white/10 py-2"
              : "bg-transparent py-6"
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                priority
                className={`transition-all duration-300 ${isSticky ? "w-7 h-7" : "w-10 h-10"}`}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setActiveSection(item.id)}
                    className="relative px-4 py-2 text-sm font-medium transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-full bg-accent/20"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive
                          ? "text-accent"
                          : "text-text/70 hover:text-text"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3">
                <SocialLink
                  href="https://linkedin.com/in/mohamedabuhamida"
                  icon={<Linkedin size={18} />}
                />
                <SocialLink
                  href="https://github.com/mohamedabuhamida"
                  icon={<Github size={18} />}
                />
                <SocialLink
                  href="https://www.upwork.com/freelancers/~0191d02b8deff4294c"
                  icon={<FaUpwork size={18} />}
                />
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-text hover:text-accent transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-100 md:hidden transition-all duration-500 
        ${isMobileMenuOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500
          ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-70 bg-primary border-l border-white/10 p-8 transition-transform duration-500 ease-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6 text-2xl"
          >
            ✕
          </button>
          <div className="flex flex-col gap-8 mt-12">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-xl font-semibold ${activeSection === item.id ? "text-accent" : "text-text"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="text-text/60 hover:text-accent transition-colors"
    >
      {icon}
    </Link>
  );
}
