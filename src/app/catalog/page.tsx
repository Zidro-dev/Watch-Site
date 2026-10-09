import { prisma } from "@/utils/prisma";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";



import { fallbackAnimes } from "@/utils/fallback-data";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || "";
  const page = parseInt(searchParams.page || "1");
  const take = 48; // Items per page
  const skip = (page - 1) * take;

  const whereClause = query
    ? { title: { contains: query, mode: "insensitive" as const } }
    : {};

  let animes: any[] = [];
  let totalCount = 0;

  try {
    [animes, totalCount] = await Promise.all([
      prisma.anime.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          coverImage: true,
          releaseYear: true,
          status: true,
        },
        orderBy: query ? undefined : { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.anime.count({ where: whereClause }),
    ]);
  } catch (error) {
    console.error("Prisma error in Catalog:", error);
  }

  // Use fallback if empty
  if (animes.length === 0 && !query) {
    animes = fallbackAnimes;
    totalCount = fallbackAnimes.length;
  }

  // Jikan API Fallback for Global Catalog Search
  if (query && animes.length < 5) {
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=${10 - animes.length}`);
      const jikanData = await res.json();
      
      if (jikanData.data) {
        const jikanFormatted = jikanData.data.map((a: any) => ({
          id: `jikan-${a.mal_id}`,
          title: a.title_english || a.title,
          coverImage: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url,
          releaseYear: a.year || (a.aired?.from ? new Date(a.aired.from).getFullYear() : 2024),
          status: a.status === "Currently Airing" ? "ONGOING" : "COMPLETED",
          isJikan: true
        }));
        animes = [...animes, ...jikanFormatted];
        totalCount = animes.length;
      }
    } catch (error) {
      console.error("Jikan API Error in Catalog:", error);
    }
  }

  const totalPages = Math.ceil(totalCount / take);

  // Form action for searching
  async function searchAction(formData: FormData) {
    "use server";
    const q = formData.get("q")?.toString() || "";
    redirect(`/catalog?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-border pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center">
          <span className="bg-primary w-2 h-8 rounded-full mr-3 inline-block"></span>
          Anime Catalog
        </h1>
        <form action={searchAction} className="relative w-full md:w-80">
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-muted-foreground hover:text-white transition-colors" />
          </button>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search local DB & global MAL..."
            className="w-full pl-10 pr-4 py-3 bg-secondary/50 backdrop-blur-md border border-white/10 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary transition-shadow shadow-inner"
          />
        </form>
      </div>

      {animes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-secondary/20 border border-border rounded-xl backdrop-blur-sm">
          No anime found matching your search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {animes.map((anime) => (
              <Link key={anime.id} href={`/anime/${anime.id}`} className="group relative block overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:-translate-y-1 bg-secondary border border-border">
                <div className="aspect-[2/3] w-full relative">
                  <img 
                    src={anime.coverImage || "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop"} 
                    alt={anime.title} 
                    className="w-full h-full object-cover" 
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-2">
              {page > 1 && (
                <Link 
                  href={`/catalog?q=${encodeURIComponent(query)}&page=${page - 1}`}
                  className="px-4 py-2 bg-secondary border border-border rounded-md hover:bg-secondary/80 transition"
                >
                  Previous
                </Link>
              )}
              <span className="text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link 
                  href={`/catalog?q=${encodeURIComponent(query)}&page=${page + 1}`}
                  className="px-4 py-2 bg-secondary border border-border rounded-md hover:bg-secondary/80 transition"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
