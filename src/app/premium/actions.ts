"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function upgradeToPremium() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "You must be logged in to upgrade." };
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "PREMIUM" },
    });
    
    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Upgrade error:", error);
    return { success: false, error: "Failed to upgrade your account. Please try again." };
  }
}
