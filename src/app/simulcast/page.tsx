export const dynamic = 'force-dynamic';

import { prisma } from "@/utils/prisma";
import Link from "next/link";
import { Play } from "lucide-react";



import { fallbackAnimes } from "@/utils/fallback-data";
import SimulcastCalendarClient from "./SimulcastCalendarClient";

export default async function SimulcastPage() {
  let animes: any[] = [];
  try {
    animes = await prisma.anime.findMany({
      where: { status: "ONGOING" },
      include: {
        episodes: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      take: 50
    });
  } catch (error) {
    console.error("Prisma error in Simulcast:", error);
  }

  if (animes.length === 0) {
    animes = fallbackAnimes.filter(a => a.status === "ONGOING").map(a => ({
      ...a,
      episodes: [{ id: `ep-fb-${a.id}`, episodeNumber: 1 }]
    }));
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-4xl font-black mb-2 flex items-center">
          <span className="bg-primary w-2 h-8 rounded-full mr-3 inline-block"></span>
          Simulcast Schedule
        </h1>
        <p className="text-muted-foreground text-lg">Catch the latest episodes airing this season right after they air in Japan.</p>
      </div>

      <SimulcastCalendarClient animes={animes} />
    </div>
  );
}
