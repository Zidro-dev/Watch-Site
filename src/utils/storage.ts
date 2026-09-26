"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a file to a Supabase Storage bucket.
 * 
 * @param file The File object (from FormData)
 * @param bucketName The name of the bucket (e.g. 'avatars' or 'audio_tracks')
 * @param folder Optional folder path inside the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadFileToSupabase(file: File, bucketName: string, folder: string = "") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const fileExt = file.name.split('.').pop();
  const fileName = `${folder ? folder + '/' : ''}${user.id}_${uuidv4()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage error:", error);
    throw new Error(error.message);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);

  return publicUrl;
}
