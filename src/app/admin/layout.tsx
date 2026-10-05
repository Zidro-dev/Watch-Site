export const dynamic = 'force-dynamic';

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/utils/prisma";
import Link from "next/link";
import { LayoutDashboard, Mic2, Film } from "lucide-react";



export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Supabase error in AdminLayout:", error);
  }

  if (!user) {
    redirect("/login");
  }

  let dbUser = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
  } catch (error) {
    console.error("Prisma error in AdminLayout:", error);
  }

  if (!dbUser || dbUser.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403 Forbidden</h1>
        <p className="text-lg text-muted-foreground mb-6">You do not have administrative privileges to view this page.</p>
        <Link href="/" className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background pt-16">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border bg-card hidden md:block">
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition">
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </Link>
          <Link href="/admin/content" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition">
            <Film className="h-5 w-5" />
            <span>Content Management</span>
          </Link>
          <Link href="/admin/fandub" className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition">
            <Mic2 className="h-5 w-5" />
            <span>Fandub Moderation</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
