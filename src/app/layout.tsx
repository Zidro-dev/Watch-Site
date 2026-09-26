import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/utils/supabase/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AniZone - Hybrid Anime Streaming",
  description: "Stream anime with official and fandub audio tracks.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let notifications: any[] = [];
  let dbUser = null;
  if (user) {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    
    dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <Navbar user={user} dbUser={dbUser} notifications={notifications} />
        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
