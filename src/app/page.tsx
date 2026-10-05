export const dynamic = 'force-dynamic';

import Hero from "@/components/home/Hero";
import CategoryRow from "@/components/home/CategoryRow";
import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";



export default async function Home() {
  const supabase = createClient();
  let user = null;
  
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Supabase error in Home:", error);
  }

  let newlyAdded: any[] = [];
  let topRated: any[] = [];
  let continueWatching: any[] = [];

  try {
    // 1. Newly Added (Latest 10 anime)
    newlyAdded = await prisma.anime.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // 2. Top Rated 
    topRated = await prisma.anime.findMany({
      orderBy: {
        reviews: {
          _count: "desc"
        }
      },
      take: 10,
    });

    // 3. Continue Watching (Only if user is logged in)
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
      
      continueWatching = progress.map(p => ({
        id: p.episode.anime.id, 
        title: `Ep ${p.episode.episodeNumber} - ${p.episode.anime.title}`,
        coverImage: p.episode.anime.coverImage,
        isPremium: p.episode.isPremiumOnly,
      }));
    }
  } catch (error) {
    console.error("Prisma error in Home:", error);
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
