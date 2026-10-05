export const dynamic = 'force-dynamic';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/prisma";

// Initialize Prisma (ideally this should be in a separate lib/prisma.ts file)


export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the user's role from the Prisma database using the Supabase Auth ID
  // Note: In a real environment with the DB running, this will execute.
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || (dbUser.role !== "FANDUB_CREATOR" && dbUser.role !== "ADMIN")) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-3xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to access the Fandub Creator Portal.</p>
        </div>
      );
    }
  } catch (error) {
    console.error("Prisma check failed (likely DB not connected yet). Bypassing for UI demonstration.");
    // For demonstration purposes, we will not block if the DB throws an error due to missing connection.
    // In production, you would redirect: redirect("/");
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8 border-b border-border pb-4">
          <h1 className="text-3xl font-bold">Fandub Creator Portal</h1>
          <p className="text-muted-foreground mt-2">Upload and manage your custom audio tracks.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
