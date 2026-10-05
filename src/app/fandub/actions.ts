"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

import { uploadFileToSupabase } from "@/utils/storage";



export async function submitFandubTrack(formData: FormData) {
  try {
    const episodeId = formData.get("episodeId") as string;
    const language = formData.get("language") as string;
    const audioFile = formData.get("audioFile") as File;
    const userId = formData.get("userId") as string;
    const groupName = formData.get("groupName") as string;

    const displayLanguage = groupName ? `${language} (${groupName})` : language;

    if (!episodeId || !language || !audioFile || !userId) {
      return { success: false, error: "Missing required fields." };
    }

    if (audioFile.size === 0) {
      return { success: false, error: "Empty file provided." };
    }

    // Upload file to Supabase Storage bucket 'audio_tracks'
    const fileUrl = await uploadFileToSupabase(audioFile, "audio_tracks", `anime_${episodeId}`);

    await prisma.audioTrack.create({
      data: {
        episodeId,
        language: displayLanguage,
        url: fileUrl,
        creatorId: userId,
        source: "FANDUB",
        isApproved: false, // Must be approved by Admin
      },
    });

    revalidatePath("/admin/fandub");
    revalidatePath("/fandub");
    return { success: true };
  } catch (error: any) {
    console.error("Submission error:", error);
    return { success: false, error: error.message || "Failed to submit track." };
  }
}
