"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { uploadFileToSupabase } from "@/utils/storage";
import { createClient } from "@/utils/supabase/server";



export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Not logged in" };

    const avatarFile = formData.get("avatarFile") as File;
    if (!avatarFile || avatarFile.size === 0) {
      return { success: false, error: "No file provided" };
    }

    const publicUrl = await uploadFileToSupabase(avatarFile, "avatars", user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: publicUrl },
    });

    revalidatePath("/profile");
    revalidatePath("/"); // Update Navbar everywhere
    
    return { success: true, avatarUrl: publicUrl };
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    return { success: false, error: error.message };
  }
}
