import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const results = await prisma.anime.findMany({
      where: {
        title: {
          contains: q,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        title: true,
        coverImage: true,
        releaseYear: true,
        status: true,
        tags: true,
      },
      take: 10
    });

    let finalResults: any[] = results.map(r => ({ ...r, source: 'local' }));

    // If we have less than 5 local results, fetch from Jikan API to enrich the search
    if (finalResults.length < 5) {
      try {
        const jikanRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=${10 - finalResults.length}`);
        const jikanData = await jikanRes.json();
        
        if (jikanData.data) {
          const jikanFormatted = jikanData.data.map((a: any) => ({
            id: `jikan-${a.mal_id}`,
            title: a.title_english || a.title,
            coverImage: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url,
            releaseYear: a.year || (a.aired?.from ? new Date(a.aired.from).getFullYear() : null),
            status: a.status === "Currently Airing" ? "ONGOING" : "COMPLETED",
            tags: a.genres?.map((g: any) => g.name) || [],
            source: 'global'
          }));
          
          finalResults = [...finalResults, ...jikanFormatted];
        }
      } catch (e) {
        console.error("Jikan Search Error:", e);
      }
    }

    return NextResponse.json(finalResults);
  } catch (error) {
    console.error("Search API error, using fallback:", error);
    // Fallback if DB is down
    const fallback = (await import("@/utils/fallback-data")).fallbackAnimes;
    const filtered = fallback.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
    return NextResponse.json(filtered.map(r => ({ ...r, source: 'local' })));
  }
}
