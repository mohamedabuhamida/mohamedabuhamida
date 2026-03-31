"use client";

import Link from "next/link";
import Image from "next/image";
import { MotionValue, motion, useTransform } from "framer-motion";
import TextType from "@/components/animation/TextType";
import Reveal from "@/components/animation/Reveal";

import { HeroProps } from "@/types";

export default function Hero({
  data,
  scrollYProgress,
}: HeroProps & {
  scrollYProgress: MotionValue<number>;
}) {
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const heroRotate = useTransform(scrollYProgress, [0, 1], [0, -4]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [0.22, 0.12, 0.05]);

  return (
    <section id="home" className="relative h-screen bg-linear-to-tr from-bg to-primary">
      <motion.div
        style={{ scale: heroScale, rotate: heroRotate, y: heroY }}
        className="sticky top-0 flex h-screen items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-tr from-bg to-primary" />
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f22_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f22_1px,transparent_1px)] bg-size-[54px_54px]"
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-bg via-bg/60 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 md:px-12 md:py-24 lg:px-24 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              style={{ y: contentY }}
              className="order-2 space-y-4 md:space-y-6 lg:order-1"
            >
              <Reveal delay={0.1}>
                <h1 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-4xl">
                  {data.title}{" "}
                  <span className="bg-linear-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                    {data.name}
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg md:text-xl">
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

              <Reveal delay={0.3}>
                <div className="flex gap-5 pt-4">
                  <Link
                    href="/api/cv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-linear-to-b from-primary px-9 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 active:translate-y-1 sm:text-base"
                  >
                    <span className="absolute inset-0.5 rounded-full bg-linear-to-b from-white/20 to-transparent opacity-60 pointer-events-none"></span>
                    <span className="absolute -left-full top-0 h-full w-[60%] skew-x-[-25deg] bg-linear-to-r from-transparent via-white/30 to-transparent animate-[shine_6s_ease-in-out_infinite]"></span>
                    <span className="relative z-10">View Resume</span>
                  </Link>

                  <Link
                    href="/#contact"
                    className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/10 bg-primary/10 px-9 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 active:translate-y-1 sm:text-base"
                  >
                    <span className="absolute inset-px rounded-full bg-linear-to-b from-white/15 to-transparent opacity-50 pointer-events-none"></span>
                    <span className="absolute -left-full top-0 h-full w-[60%] skew-x-[-25deg] bg-linear-to-r from-transparent via-white/20 to-transparent animate-[shine_6s_ease-in-out_infinite]"></span>
                    <span className="relative z-10">Let&apos;s Work Together</span>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="grid grid-cols-2 gap-4 pt-6 md:gap-8 md:pt-8 sm:grid-cols-3">
                  <div className="text-center sm:text-left">
                    <p className="text-xl font-bold text-accent sm:text-2xl">
                      {data.years_experience}+
                    </p>
                    <p className="text-xs text-text-muted sm:text-sm">
                      Years in AI & ML
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-xl font-bold text-accent sm:text-2xl">
                      {data.projects_count}+
                    </p>
                    <p className="text-xs text-text-muted sm:text-sm">
                      AI Projects Delivered
                    </p>
                  </div>
                  <div className="col-span-2 text-center sm:col-span-1 sm:text-left">
                    <p className="text-xl font-bold text-accent sm:text-2xl">
                      Instructor
                    </p>
                    <p className="text-xs text-text-muted sm:text-sm">
                      Digital Knights
                    </p>
                  </div>
                </div>
              </Reveal>
            </motion.div>

            <motion.div
              style={{ y: imageY }}
              className="order-1 mb-8 flex items-center justify-center lg:order-2 lg:mb-0 lg:justify-end"
            >
              <Reveal delay={0.2} direction="right">
                <div className="relative">
                  <Image
                    src="/main.png"
                    width={280}
                    height={280}
                    alt="Mohamed AbuHamida"
                    className="h-48 w-48 rounded-full border-4 border-border object-cover shadow-2xl shadow-primary/30 transition-transform duration-500 hover:scale-105 sm:h-56 sm:w-56 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80"
                    priority
                  />

                  <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full border-2 border-accent/30 animate-spin-slow md:-right-4 md:-top-4 md:h-24 md:w-24" />
                  <div className="absolute -bottom-2 -left-2 h-12 w-12 rounded-full border-2 border-text/20 animate-pulse md:-bottom-4 md:-left-4 md:h-20 md:w-20" />

                  {data.is_available && (
                    <div className="absolute -bottom-2 right-4 rounded-full bg-accent px-3 py-1 text-xs font-bold text-bg shadow-lg md:-bottom-4 md:right-8">
                      Available for Work
                    </div>
                  )}
                </div>
              </Reveal>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
