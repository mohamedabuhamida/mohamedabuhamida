"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/types";

interface BlogTableOfContentsProps {
  items: TocItem[];
}

export default function BlogTableOfContents({ items }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const handleScrollTo = (id: string) => () => {
    const target = document.getElementById(id);
    if (!target) return;

    window.history.replaceState(null, "", `#${id}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 1],
      }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const activeButton = buttonRefs.current[activeId];
    if (!activeButton) return;

    activeButton.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [activeId]);

  if (!items.length) return null;

  return (
    <aside className="sticky top-24 hidden max-h-[calc(100vh-7rem)] w-56 shrink-0 lg:block">
      <div className="flex max-h-[calc(100vh-7rem)] flex-col border-l border-white/10 pl-4">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-text/35">
          On this page
        </p>
        <nav className="dashboard-sidebar-scroll min-h-0 space-y-1.5 overflow-y-auto pr-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={handleScrollTo(item.id)}
              ref={(element) => {
                buttonRefs.current[item.id] = element;
              }}
              className={cn(
                "block w-full rounded-r-xl border-l-2 border-transparent px-3 py-2 text-left text-[13px] leading-6 transition",
                item.level === 2 && "pl-4",
                item.level === 3 && "pl-7 text-text/40",
                activeId === item.id
                  ? "border-accent bg-accent/8 text-accent"
                  : "text-text/50 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
