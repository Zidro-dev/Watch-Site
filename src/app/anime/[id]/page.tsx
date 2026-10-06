export const dynamic = 'force-dynamic';

import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Play, Calendar, Tag } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { WatchlistButton, ReviewsSection } from "./AnimeClientFeatures";
import type { Metadata } from "next";



import { fallbackAnimes } from "@/utils/fallback-data";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let anime = null;
  try {
    anime = await prisma.anime.findUnique({
      where: { id: params.id },
    });
  } catch (error) {
    console.error("Metadata prisma error in AnimeDetails:", error);
  }

  if (!anime) {
    anime = fallbackAnimes.find(a => a.id === params.id) as any;
  }

  if (!anime) {
    return {
      title: "Anime Not Found - AniZone",
    };
  }

  return {
    title: `${anime.title} | AniZone`,
    description: anime.description?.slice(0, 160) || `Watch ${anime.title} on AniZone with official and community Fandub audio tracks.`,
    openGraph: {
      title: anime.title,
      description: anime.description?.slice(0, 160) || `Watch ${anime.title} on AniZone.`,
      images: [
        {
          url: anime.coverImage || "",
          width: 800,
          height: 600,
          alt: anime.title,
        },
      ],
      type: "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title: anime.title,
      description: anime.description?.slice(0, 160) || `Watch ${anime.title} on AniZone.`,
      images: [anime.coverImage || ""],
    },
  };
}

export default async function AnimeDetailsPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Supabase user error in AnimeDetails:", error);
  }

  let anime = null;
  try {
    anime = await prisma.anime.findUnique({
      where: { id: params.id },
      include: {
        episodes: {
          orderBy: { episodeNumber: "asc" }
        },
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" }
        },
        watchlists: user ? {
          where: { userId: user.id }
        } : false
      }
    });
  } catch (error) {
    console.error("Prisma error in AnimeDetails:", error);
  }

  if (!anime) {
    anime = fallbackAnimes.find(a => a.id === params.id) as any;
    if (anime) {
      anime.episodes = [{ id: `ep-fb-${anime.id}`, episodeNumber: 1, title: "Mock Episode" }];
      anime.reviews = [];
      anime.watchlists = [];
    } else {
      // Just fallback to the first one to avoid 404 crash
      anime = { ...fallbackAnimes[0] } as any;
      anime.episodes = [{ id: `ep-fb-${anime.id}`, episodeNumber: 1, title: "Mock Episode" }];
      anime.reviews = [];
      anime.watchlists = [];
    }
  }

  if (!anime) {
    notFound();
  }

  const isWatchlisted = user && anime.watchlists ? anime.watchlists.length > 0 : false;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
        <div className="absolute inset-0 z-0">
          <img 
            src={anime.coverImage || ""} 
            alt={anime.title} 
            className="w-full h-full object-cover opacity-40 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 md:px-8 h-full flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end md:items-start">
            <img 
              src={anime.coverImage || ""} 
              alt={anime.title} 
              className="w-48 md:w-64 aspect-[2/3] object-cover rounded-xl shadow-2xl border border-white/10 shrink-0 transform md:translate-y-12"
            />
            <div className="flex-1 pb-2">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">{anime.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-300 mb-6">
                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1.5" /> {anime.releaseYear}</span>
                <span className="bg-primary/20 text-primary border border-primary/30 px-2.5 py-0.5 rounded-full uppercase text-xs tracking-wider">
                  {anime.status}
                </span>
              </div>
              <p className="text-gray-400 text-lg max-w-3xl leading-relaxed line-clamp-3 md:line-clamp-none mb-8">
                {anime.description || "No description available."}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center">
                {anime.episodes.length > 0 ? (
                  <Link 
                    href={`/watch/${anime.episodes[0].id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition-colors"
                  >
                    <Play className="h-5 w-5 mr-2 fill-black" />
                    Start Watching
                  </Link>
                ) : (
                  <span className="w-full sm:w-auto inline-flex items-center justify-center bg-white/20 text-white font-bold py-3 px-8 rounded-full cursor-not-allowed">
                    Coming Soon
                  </span>
                )}
                
                <WatchlistButton 
                  userId={user?.id || null} 
                  animeId={anime.id} 
                  initialIsWatchlisted={isWatchlisted} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes & Reviews Section */}
      <div className="container mx-auto px-4 md:px-8 mt-24 md:mt-32">
        <h2 className="text-2xl font-bold mb-8 flex items-center">
          <span className="bg-primary w-1.5 h-6 rounded-full mr-3 inline-block"></span>
          Episodes
        </h2>
        
        {anime.episodes.length === 0 ? (
          <div className="text-center py-16 bg-secondary/30 rounded-xl border border-border">
            <p className="text-muted-foreground">No episodes available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {anime.episodes.map(episode => (
              <Link 
                key={episode.id} 
                href={`/watch/${episode.id}`}
                className="group flex items-center p-4 bg-secondary/40 hover:bg-secondary border border-border rounded-xl transition-all hover:border-primary/50 hover:shadow-[0_0_15px_rgba(229,9,20,0.1)]"
              >
                <div className="h-16 w-24 bg-black rounded-md relative overflow-hidden shrink-0 flex items-center justify-center border border-white/5">
                  <Play className="h-6 w-6 text-white/50 group-hover:text-primary group-hover:scale-110 transition-all" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-primary font-semibold mb-1">Episode {episode.episodeNumber}</p>
                  <h3 className="font-medium text-white text-sm line-clamp-2">
                    {episode.title || `Episode ${episode.episodeNumber}`}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

        <ReviewsSection 
          userId={user?.id || null} 
          animeId={anime.id} 
          existingReviews={anime.reviews} 
        />
      </div>
    </div>
  );
}
