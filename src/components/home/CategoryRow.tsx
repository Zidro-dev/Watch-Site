"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface AnimeCard {
  id: string;
  title: string;
  coverImage: string;
  isPremium?: boolean;
}

interface CategoryRowProps {
  title: string;
  items: AnimeCard[];
}

export default function CategoryRow({ title, items }: CategoryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-2 py-4">
      <h2 className="text-xl font-semibold px-4 md:px-12 transition-colors hover:text-foreground/80 cursor-pointer">
        {title}
      </h2>
      <div className="group relative">
        {/* Left Arrow */}
        <ChevronLeft
          className={`absolute top-0 bottom-0 left-0 z-40 m-auto h-full w-10 cursor-pointer bg-black/40 opacity-0 transition hover:bg-black/60 hover:opacity-100 ${
            !isMoved && "hidden"
          }`}
          onClick={() => handleClick("left")}
        />

        {/* Row Container */}
        <div
          ref={rowRef}
          className="flex items-center space-x-2.5 overflow-x-scroll px-4 md:px-12 py-2"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            div::-webkit-scrollbar { display: none; }
          `}} />
          {items.map((item) => (
            <Link key={item.id} href={`/anime/${item.id}`}>
              <div className="relative h-36 min-w-[240px] cursor-pointer transition-transform duration-200 ease-out md:h-40 md:min-w-[280px] hover:scale-105 hover:z-30 rounded-md overflow-hidden bg-secondary">
                <Image
                  src={item.coverImage}
                  alt={item.title}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 768px) 240px, 280px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                  {item.isPremium && (
                    <span className="text-[10px] font-bold uppercase bg-primary text-primary-foreground px-1.5 py-0.5 rounded w-max mt-1">
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Arrow */}
        <ChevronRight
          className="absolute top-0 bottom-0 right-0 z-40 m-auto h-full w-10 cursor-pointer bg-black/40 opacity-0 transition hover:bg-black/60 hover:opacity-100"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
}
