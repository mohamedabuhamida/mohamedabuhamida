"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Props {
  isLoading: boolean;
  children: ReactNode;
}

export default function LoadingWrapper({ isLoading, children }: Props) {
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<
    { id: number; left: string; top: string; duration: string }[]
  >([]);
  const [binaryLeft, setBinaryLeft] = useState<string[]>([]);
  const [binaryRight, setBinaryRight] = useState<string[]>([]);

  // ✅ Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);

    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${3 + Math.random() * 2}s`,
    }));

    const newBinaryLeft = Array.from({ length: 5 }).map(() =>
      Math.random().toString(2).substring(2, 10),
    );

    const newBinaryRight = Array.from({ length: 5 }).map(() =>
      Math.random().toString(2).substring(2, 10),
    );

    setParticles(newParticles);
    setBinaryLeft(newBinaryLeft);
    setBinaryRight(newBinaryRight);
  }, []);

  // ✅ GSAP Animations
  useEffect(() => {
    if (!mounted) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(logoRef.current, {
      scale: 1.1,
      rotateY: 180,
      duration: 2,
      ease: "power2.inOut",
    })
      .to(logoRef.current, {
        scale: 1,
        rotateY: 360,
        duration: 2,
        ease: "power2.inOut",
      })
      .to(logoRef.current, {
        scale: 1.05,
        rotate: 5,
        duration: 1,
        ease: "sine.inOut",
      })
      .to(logoRef.current, {
        scale: 1,
        rotate: -5,
        duration: 1,
        ease: "sine.inOut",
      })
      .to(logoRef.current, {
        scale: 1,
        rotate: 0,
        duration: 0.5,
      });

    gsap.to(glowRef.current, {
      scale: 1.5,
      opacity: 0.8,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    gsap.to(logoRef.current, {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [mounted]);

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-tr from-bg via-primary to-bg font-sans">
        <div className="relative flex flex-col items-center gap-8">
          {/* Glow */}
          <div
            ref={glowRef}
            className="absolute w-60 h-60 bg-accent/30 rounded-full blur-3xl"
          ></div>

          <div className="absolute w-80 h-80 bg-primary/50 rounded-full blur-3xl animate-pulse"></div>

          {/* Logo */}
          <div className="relative perspective-1000">
            <div ref={logoRef} className="relative transform-style-3d">
              <div className="relative">
                <Image
                  src="/logo.png"
                  alt="Loading..."
                  width={150}
                  height={150}
                  priority
                  className="object-contain relative z-10 drop-shadow-2xl"
                />
                <div className="absolute inset-0 bg-linear-to-t from-accent/20 to-transparent rounded-full blur-sm"></div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="relative">
            <p className="text-text-muted text-lg tracking-wider flex items-center">
              <span>
                <span className="text-accent">&gt;</span> INITIALIZING Profile
              </span>
              <span ref={cursorRef} className="text-accent ml-1">
                _
              </span>
            </p>

            <div className="mt-4 w-48 h-1 bg-primary/50 rounded-full overflow-hidden">
              <div className="h-full bg-linear-to-r from-accent via-accent/80 to-accent rounded-full animate-progress"></div>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute w-1 h-1 bg-accent/30 rounded-full animate-float"
                style={{
                  left: p.left,
                  top: p.top,
                  animationDuration: p.duration,
                }}
              />
            ))}
          </div>

          {/* Binary Left */}
          <div className="absolute bottom-8 left-8 text-accent/10 text-xs font-mono">
            {binaryLeft.map((code, i) => (
              <div key={i} className="animate-binary">
                {code}
              </div>
            ))}
          </div>

          {/* Binary Right */}
          <div className="absolute top-8 right-8 text-accent/10 text-xs font-mono">
            {binaryRight.map((code, i) => (
              <div
                key={i}
                className="animate-binary"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {code}
              </div>
            ))}
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
          }

          @keyframes progress {
            0% {
              width: 0%;
            }
            50% {
              width: 70%;
            }
            100% {
              width: 100%;
            }
          }

          @keyframes binary {
            0%,
            100% {
              opacity: 0.3;
              transform: translateY(0);
            }
            50% {
              opacity: 1;
              transform: translateY(-5px);
            }
          }

          .animate-float {
            animation: float 4s ease-in-out infinite;
          }

          .animate-progress {
            animation: progress 2s ease-in-out infinite;
          }

          .animate-binary {
            animation: binary 3s ease-in-out infinite;
          }

          .perspective-1000 {
            perspective: 1000px;
          }

          .transform-style-3d {
            transform-style: preserve-3d;
          }
        `}</style>
      </div>
    );
  }

  return <>{children}</>;
}
