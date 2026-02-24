import React from "react";
import Link from "next/link";
import Image from "next/image";
import TextType from "@/components/animation/TextType";
import Reveal from "@/components/animation/Reveal";

import { HeroProps } from "@/types";

export default function Hero({ data }: HeroProps) {
  return (
    <section className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-tr from-bg to-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-16 md:py-24 lg:py-28 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left column: Text content */}
          <div className="space-y-4 md:space-y-6 order-2 lg:order-1">
            {/* Badge - Responsive text size */}
            {/* <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 md:px-4 py-1.5 md:py-2 w-fit">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm text-text-muted">
                AI Engineer · LLMs · RAG · Instructor @ Digital Knights
              </span>
            </div> */}

            {/* Main heading - Responsive font sizes */}
            <Reveal delay={0.1}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold leading-tight">
                {data.title}{" "}
                <span className="text-accent bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                  {data.name}
                </span>
              </h1>
            </Reveal>

            {/* Description - Responsive font sizes */}
            <Reveal delay={0.2}>
              <div className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl leading-relaxed">
                <TextType
                  text={data.typing_texts}
                  typingSpeed={80}
                  deletingSpeed={40}
                  pauseDuration={1500}
                  showCursor
                  cursorCharacter="|"
                  cursorBlinkDuration={0.8}
                />
              </div>
            </Reveal>

            {/* CTA Buttons - Stack on mobile */}
            <Reveal delay={0.3}>
              <div className="flex  gap-3 sm:gap-4 pt-3 md:pt-4">
                <Link
                  href="/resume"
                  className="bg-accent text-bg font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-accent/90 transition-all duration-300 hover:scale-105 active:scale-95 text-center text-sm sm:text-base"
                >
                  View Resume
                </Link>
                <Link
                  href="/contact"
                  className="border border-text text-text font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 text-center text-sm sm:text-base"
                >
                  Let's Work Together
                </Link>
              </div>
            </Reveal>

            {/* Quick stats - Responsive layout */}
            <Reveal delay={0.4}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 pt-6 md:pt-8">
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {data.years_experience}+
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm">
                    Years in AI & ML
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {data.projects_count}+
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm ">
                    AI Projects Delivered
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    Instructor
                  </p>
                  <p className="text-text-muted text-xs sm:text-sm">
                    Digital Knights
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right column: Image - Better mobile positioning */}
          <div className="flex justify-center lg:justify-end items-center order-1 lg:order-2 mb-8 lg:mb-0">
            <Reveal delay={0.2} direction="right">
              <div className="relative">
                <Image
                  src="/main.png"
                  width={280}
                  height={280}
                  alt="Mohamed AbuHamida"
                  className="rounded-full object-cover border-4 border-border shadow-2xl shadow-primary/30 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 transition-transform duration-500 hover:scale-105"
                  priority
                />

                {/* Decorative elements for visual interest */}
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-16 h-16 md:w-24 md:h-24 border-2 border-accent/30 rounded-full animate-spin-slow"></div>
                <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-12 h-12 md:w-20 md:h-20 border-2 border-text/20 rounded-full animate-pulse"></div>

                {/* Status badge */}
                {data.is_available && (
                  <div className="absolute -bottom-2 right-4 md:-bottom-4 md:right-8 bg-accent text-bg text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Available for Work
                  </div>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
