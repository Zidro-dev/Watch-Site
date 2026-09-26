export const dynamic = 'force-dynamic';

import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bookmark, Play } from "lucide-react";

const prisma = new PrismaClient();

export default async function WatchlistPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const watchlists = await prisma.watchlist.findMany({
    where: { userId: user.id },
    include: {
      anime: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="mb-10 border-b border-border pb-6 flex items-center space-x-3">
        <Bookmark className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-extrabold tracking-tight">My Watchlist</h1>
      </div>

      {watchlists.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 rounded-xl border border-border">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6">Find shows you want to watch later and add them here.</p>
          <Link href="/catalog" className="bg-white text-black font-bold py-2.5 px-6 rounded-full hover:bg-gray-200 transition">
            Browse Anime
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {watchlists.map(({ anime }) => (
            <Link key={anime.id} href={`/anime/${anime.id}`} className="group relative block overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:-translate-y-1 bg-secondary border border-border">
              <div className="aspect-[2/3] w-full relative">
                <img src={anime.coverImage || "https://via.placeholder.com/300x450"} alt={anime.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-primary rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Play className="h-6 w-6 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-sm md:text-base text-white line-clamp-2 leading-tight drop-shadow-md">{anime.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
