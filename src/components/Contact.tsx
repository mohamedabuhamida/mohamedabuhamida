"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="relative min-h-screen flex items-center justify-center bg-black text-white overflow-hidden">

      {/* Subtle Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 text-center px-6 max-w-3xl"
      >
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-semibold mb-6">
          Let’s Build Something Intelligent.
        </h2>

        {/* Subtext */}
        <p className="text-white/60 text-lg md:text-xl mb-12">
          Have an idea in AI, Computer Vision, or modern web systems?
          Let’s turn it into reality.
        </p>

        {/* Primary CTA */}
        <div className="flex justify-center mb-10">
          <a
            href="mailto:mohamedabuhamida3@gmail.com"
            className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-sm md:text-base hover:scale-105 transition-transform duration-300"
          >
            <Mail size={18} />
            Get in Touch
          </a>
        </div>

        {/* Secondary Links */}
        <div className="flex justify-center gap-8 text-white/60">
          <a
            href="https://github.com/mohamedabuhamida"
            target="_blank"
            className="hover:text-white transition flex items-center gap-2"
          >
            <Github size={18} />
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/mohamedabuhamida"
            target="_blank"
            className="hover:text-white transition flex items-center gap-2"
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
        </div>
      </motion.div>
    </section>
  );
}