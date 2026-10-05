export const dynamic = 'force-dynamic';

import Hero from "@/components/home/Hero";
import CategoryRow from "@/components/home/CategoryRow";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";



export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Newly Added (Latest 10 anime)
  const newlyAdded = await prisma.anime.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // 2. Top Rated (Anime with most/highest reviews - for simplicity we just sort by those with most reviews)
  const topRated = await prisma.anime.findMany({
    orderBy: {
      reviews: {
        _count: "desc"
      }
    },
    take: 10,
  });

  // 3. Continue Watching (Only if user is logged in)
  let continueWatching: any[] = [];
  if (user) {
    const progress = await prisma.watchProgress.findMany({
      where: { userId: user.id },
      include: {
        episode: {
          include: { anime: true }
        }
      },
      orderBy: { updatedAt: "desc" },
      take: 10,
    });
    
    // Map to AnimeCard format expected by CategoryRow
    continueWatching = progress.map(p => ({
      id: p.episode.anime.id, // Linking back to Anime
      title: `Ep ${p.episode.episodeNumber} - ${p.episode.anime.title}`,
      coverImage: p.episode.anime.coverImage,
      isPremium: p.episode.isPremiumOnly,
    }));
  }

  // Format arrays for CategoryRow
  const formatAnime = (animes: any[]) => animes.map(a => ({
    id: a.id,
    title: a.title,
    coverImage: a.coverImage || "https://via.placeholder.com/600x400",
  }));

  return (
    <div className="pb-24 min-h-screen bg-black">
      <Hero />
      <div className="mt-[-100px] relative z-30 space-y-12">
        
        {continueWatching.length > 0 && (
          <CategoryRow title="Continue Watching" items={continueWatching} />
        )}
        
        <CategoryRow title="Newly Added" items={formatAnime(newlyAdded)} />
        
        <CategoryRow title="Top Rated & Popular" items={formatAnime(topRated)} />
        
        {/* Placeholder for Fandubs */}
        <CategoryRow title="Community Fandubs" items={formatAnime([...newlyAdded].reverse())} />
      </div>
    </div>
  );
}
