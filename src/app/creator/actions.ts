"use server";

import { prisma } from "@/utils/prisma";
import { createClient } from "@/utils/supabase/server";



export async function createAudioTrackRecord(data: {
  episodeId: string;
  language: string;
  url: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    const track = await prisma.audioTrack.create({
      data: {
        episodeId: data.episodeId,
        language: data.language,
        url: data.url,
        source: "FANDUB",
        creatorId: user.id, // Links to the User model in Prisma
      },
    });

    return { success: true, track };
  } catch (error: any) {
    console.error("Failed to create audio track record:", error);
    return { success: false, error: error.message };
  }
}
