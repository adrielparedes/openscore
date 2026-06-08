"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Banner = {
  id: number;
  titulo: string | null;
  imagen: string;
  linkUrl: string | null;
};

export function HomeCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [paused, next, banners.length]);

  if (banners.length === 0) return null;

  const banner = banners[current];

  const Wrapper = banner.linkUrl ? "a" : "div";
  const wrapperProps = banner.linkUrl
    ? { href: banner.linkUrl, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <div
      className="relative h-full w-full rounded-2xl overflow-hidden bg-muted shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Wrapper {...wrapperProps} className="block h-full w-full relative">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <Image
              src={b.imagen}
              alt={b.titulo || "Banner"}
              fill
              className="object-cover"
              unoptimized
              priority={idx === 0}
            />
          </div>
        ))}

        {banner.titulo && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
            <p className="text-white font-semibold text-sm drop-shadow-md">{banner.titulo}</p>
          </div>
        )}
      </Wrapper>

      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => { e.preventDefault(); prev(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 p-1.5 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); next(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 p-1.5 text-white/80 hover:text-white transition-colors backdrop-blur-sm"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); setCurrent(idx); }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === current ? "w-4 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
