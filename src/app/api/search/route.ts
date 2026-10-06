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
        status: true
      },
      take: 10
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error, using fallback:", error);
    // Fallback if DB is down
    const fallback = (await import("@/utils/fallback-data")).fallbackAnimes;
    const filtered = fallback.filter(a => a.title.toLowerCase().includes(q.toLowerCase()));
    return NextResponse.json(filtered);
  }
}
