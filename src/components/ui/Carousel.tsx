"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CarouselProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  title?: string;
};

export default function Carousel<T>({
  items,
  renderItem,
  title,
}: CarouselProps<T>) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
    },
    [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="space-y-8 overflow-hidden py-8">
      {title && (
        <div className="flex items-center justify-between px-2">
          <h3 className="text-3xl font-bold tracking-tight">{title}</h3>

          <div className="flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled}
              className="p-2 rounded-full border border-border bg-background/50 disabled:opacity-30 transition-all hover:bg-accent hover:text-white cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled}
              className="p-2 rounded-full border border-border bg-background/50 disabled:opacity-30 transition-all hover:bg-accent hover:text-white cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      <div ref={emblaRef}>
        <div className="flex -ml-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] xl:flex-[0_0_33.33%]"
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
