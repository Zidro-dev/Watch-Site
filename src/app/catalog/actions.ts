"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
