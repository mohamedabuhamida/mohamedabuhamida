import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="font-sans bg-gradient-to-br from-bg to-primary text-text py-14 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-12">

          {/* Brand */}
          <div className="max-w-md space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3 text-xl font-bold text-text hover:text-accent transition-colors"
            >
              <Image
                src="/logo.png"
                alt="Mohamed AbuHamida Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              Mohamed AbuHamida
            </Link>

            <p className="text-text-muted text-sm leading-relaxed">
              AI Engineer specializing in LLMs, RAG systems, and scalable AI
              solutions. Building intelligent systems that bridge research and
              real-world applications.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
            
            <div>
              <h3 className="font-bold text-accent mb-4 uppercase tracking-wide">
                Navigation
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#about" className="hover:text-accent transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#work" className="hover:text-accent transition">
                    Work
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-accent transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-accent mb-4 uppercase tracking-wide">
                Connect
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-accent transition"
                  >
                    Email
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://linkedin.com/in/mohamedabuhamida"
                    target="_blank"
                    className="hover:text-accent transition"
                  >
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/mohamedabuhamida"
                    target="_blank"
                    className="hover:text-accent transition"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-border mb-6"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-text-muted gap-4">
          <p>
            © {currentYear} Mohamed AbuHamida. All rights reserved.
          </p>

         
        </div>
      </div>
    </footer>
  );
}
