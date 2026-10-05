"use server";

import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";



export async function markNotificationAsRead(id: string) {
  try {
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    revalidatePath("/"); // Adjust if needed
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
