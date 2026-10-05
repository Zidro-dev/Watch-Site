"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";



export async function toggleWatchlist(userId: string, animeId: string) {
  if (!userId || !animeId) return { success: false, error: "Missing data" };

  try {
    const existing = await prisma.watchlist.findUnique({
      where: {
        userId_animeId: {
          userId,
          animeId,
        },
      },
    });

    if (existing) {
      await prisma.watchlist.delete({
        where: { id: existing.id },
      });
      revalidatePath(`/anime/${animeId}`);
      revalidatePath(`/watchlist`);
      return { success: true, isWatchlisted: false };
    } else {
      await prisma.watchlist.create({
        data: {
          userId,
          animeId,
        },
      });
      revalidatePath(`/anime/${animeId}`);
      revalidatePath(`/watchlist`);
      return { success: true, isWatchlisted: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function submitReview(formData: FormData) {
  const userId = formData.get("userId") as string;
  const animeId = formData.get("animeId") as string;
  const rating = parseInt(formData.get("rating") as string);
  const comment = formData.get("comment") as string;

  if (!userId || !animeId || !rating || rating < 1 || rating > 5) {
    return { success: false, error: "Invalid data submitted" };
  }

  try {
    // Check if user already reviewed
    const existingReview = await prisma.review.findFirst({
      where: { userId, animeId },
    });

    if (existingReview) {
      await prisma.review.update({
        where: { id: existingReview.id },
        data: { rating, comment },
      });
    } else {
      await prisma.review.create({
        data: {
          userId,
          animeId,
          rating,
          comment,
        },
      });
    }

    revalidatePath(`/anime/${animeId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
