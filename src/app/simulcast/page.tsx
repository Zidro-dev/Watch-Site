export const dynamic = 'force-dynamic';

import { prisma } from "@/utils/prisma";
import Link from "next/link";
import { Play } from "lucide-react";



import { fallbackAnimes } from "@/utils/fallback-data";

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
      take: 30
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
      <div className="mb-8 border-b border-border pb-4">
        <h1 className="text-3xl font-bold">Simulcast Schedule</h1>
        <p className="text-muted-foreground mt-2">Catch the latest episodes airing this season right after they air in Japan.</p>
      </div>

      {animes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-secondary/50 rounded-lg">
          No ongoing simulcasts found at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animes.map((anime) => (
            <div key={anime.id} className="flex bg-secondary border border-border rounded-lg overflow-hidden h-40">
              <img src={anime.coverImage || ""} alt={anime.title} className="w-28 h-full object-cover" />
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold line-clamp-1">{anime.title}</h3>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded mt-1 inline-block">New Episode</span>
                </div>
                {anime.episodes.length > 0 && (
                  <Link 
                    href={`/watch/${anime.episodes[0].id}`}
                    className="flex items-center space-x-2 text-sm font-medium hover:text-primary transition mt-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Watch Ep {anime.episodes[0].episodeNumber}</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
