"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedinIn } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { FaUpwork } from "react-icons/fa6";

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  // Close menu on ESC
  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigationItems = [
      { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300
        ${isSticky ? "backdrop-blur-md bg-primary/10 shadow-lg max-w-7xl mx-auto rounded-full top-4" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24">
          <div
            className={`flex items-center justify-between transition-all duration-300
            ${isSticky ? "h-16" : "h-20"}`}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={40}
                height={40}
                priority
                className={`transition-all duration-300
                ${isSticky ? "w-8 h-8" : "w-10 h-10"}`}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-medium text-text hover:text-accent transition"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* LinkedIn Desktop */}
              <Link
                href="https://linkedin.com/in/mohamedabuhamida"
                target="_blank"
                className="hidden md:block text-text hover:text-accent transition"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="text-xl" />
              </Link>
              <Link
                href="https://github.com/mohamedabuhamida"
                target="_blank"
                className="hidden md:block text-text hover:text-accent transition"
                aria-label="GitHub"
              >
                <FaGithub className="text-xl" />
              </Link>
              <Link
                href="https://www.upwork.com/freelancers/~0191d02b8deff4294c"
                target="_blank"
                className="hidden md:block text-text hover:text-accent transition"
                aria-label="Upwork"
              >
                <FaUpwork className="text-xl" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10 transition"
                aria-label="Open menu"
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300
        ${isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-linear-to-br from-primary to-bg
          transition-transform duration-300
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-6 flex flex-col gap-6">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="self-end p-2"
            >
              ✕
            </button>

            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium hover:text-accent transition"
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-6 border-t border-white/10 flex gap-4">
              <Link
                href="https://linkedin.com/in/mohamedabuhamida"
                target="_blank"
                className="hover:text-accent transition"
              >
                <FaLinkedinIn />
              </Link>
              <Link
                href="https://github.com/mohamedabuhamida"
                target="_blank"
                className="hover:text-accent transition"
              >
                <FaGithub />
              </Link>
              <Link
                href="https://www.upwork.com/freelancers/~0191d02b8deff4294c"
                target="_blank"
                className="hover:text-accent transition"
              >
                <FaUpwork />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
