"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";



export async function saveWatchProgress(episodeId: string, timestamp: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not logged in" };

  try {
    // If progress is near the end, we could mark as completed, but for now we just save it.
    await prisma.watchProgress.upsert({
      where: {
        userId_episodeId: {
          userId: user.id,
          episodeId,
        },
      },
      update: {
        timestamp,
      },
      create: {
        userId: user.id,
        episodeId,
        timestamp,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save progress:", error);
    return { success: false, error: error.message };
  }
}
