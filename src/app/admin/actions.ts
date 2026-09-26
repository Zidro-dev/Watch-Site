"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

// Moderation Actions
export async function moderateFandubTrack(trackId: string, action: "APPROVE" | "REJECT" | "DELETE") {
  try {
    const track = await prisma.audioTrack.findUnique({
      where: { id: trackId },
      include: {
        episode: { include: { anime: true } },
      }
    });

    if (!track) return { success: false, error: "Track not found" };

    const title = track.episode.anime.title;
    const epNum = track.episode.episodeNumber;

    if (action === "APPROVE") {
      await prisma.audioTrack.update({
        where: { id: trackId },
        data: { isApproved: true },
      });
      
      if (track.creatorId) {
        await prisma.notification.create({
          data: {
            userId: track.creatorId,
            title: "Fandub Approved! 🎉",
            message: `Your ${track.language} audio track for ${title} (Episode ${epNum}) has been approved and is now live!`,
          }
        });
      }
    } else if (action === "REJECT" || action === "DELETE") {
      await prisma.audioTrack.delete({
        where: { id: trackId },
      });

      if (track.creatorId) {
        await prisma.notification.create({
          data: {
            userId: track.creatorId,
            title: "Fandub Rejected",
            message: `Unfortunately, your ${track.language} audio track for ${title} (Episode ${epNum}) was rejected by our moderation team.`,
          }
        });
      }
    }
    
    revalidatePath("/admin/fandub");
    revalidatePath("/fandub");
    return { success: true };
  } catch (error: any) {
    console.error("Moderation error:", error);
    return { success: false, error: error.message };
  }
}

// Content Management Actions
export async function createAnime(data: {
  title: string;
  description: string;
  releaseYear: number;
  coverImage: string;
  tags: string[];
}) {
  try {
    const anime = await prisma.anime.create({
      data: {
        title: data.title,
        description: data.description,
        releaseYear: data.releaseYear,
        coverImage: data.coverImage,
        tags: data.tags,
      },
    });
    revalidatePath("/admin/content");
    revalidatePath("/catalog");
    return { success: true, anime };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createEpisode(data: {
  animeId: string;
  episodeNumber: number;
  title: string;
  videoUrl: string;
  isPremiumOnly: boolean;
}) {
  try {
    const episode = await prisma.episode.create({
      data: {
        animeId: data.animeId,
        episodeNumber: data.episodeNumber,
        title: data.title,
        videoUrl: data.videoUrl,
        isPremiumOnly: data.isPremiumOnly,
      },
    });
    revalidatePath("/admin/content");
    revalidatePath(`/anime/${data.animeId}`);
    return { success: true, episode };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
