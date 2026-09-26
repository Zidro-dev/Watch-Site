"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";

type Anime = {
  id: string;
  title: string;
  coverImage: string | null;
  releaseYear: number | null;
  status: string;
};

export default function CatalogPage() {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // In a real app we'd use Server Actions or an API route.
  // We'll create a server action specifically for fetching to keep it clean.
  useEffect(() => {
    import("./actions").then(module => {
      module.fetchAnimeCatalog().then(data => {
        setAnimes(data);
        setIsLoading(false);
      });
    });
  }, []);

  const filteredAnimes = animes.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Anime Catalog</h1>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-secondary/50 backdrop-blur-md border border-white/10 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-shadow shadow-inner"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredAnimes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-secondary/20 border border-border rounded-xl backdrop-blur-sm">
          No anime found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredAnimes.map((anime) => (
            <Link key={anime.id} href={`/anime/${anime.id}`} className="group relative block overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:-translate-y-1 bg-secondary border border-border">
              <div className="aspect-[2/3] w-full relative">
                <Image 
                  src={anime.coverImage || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop"} 
                  alt={anime.title} 
                  fill
                  className="object-cover" 
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-sm md:text-base text-white line-clamp-2 leading-tight drop-shadow-md">{anime.title}</h3>
                  <p className="text-xs text-primary font-semibold mt-1 drop-shadow-md">{anime.releaseYear} • {anime.status}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
