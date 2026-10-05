"use server";

import { prisma } from "@/utils/prisma";



export async function fetchAnimeCatalog() {
  const animes = await prisma.anime.findMany({
    select: {
      id: true,
      title: true,
      coverImage: true,
      releaseYear: true,
      status: true,
    },
    orderBy: { title: "asc" }
  });
  return animes;
}
