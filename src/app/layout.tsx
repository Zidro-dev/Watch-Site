export const dynamic = 'force-dynamic';

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
  let user = null;
  
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Supabase getUser error in RootLayout:", error);
  }

  let notifications: any[] = [];
  let dbUser = null;
  
  if (user) {
    try {
      const { prisma } = await import("@/utils/prisma");
      
      dbUser = await prisma.user.findUnique({
        where: { id: user.id }
      });

      notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 20
      });
    } catch (error) {
      console.error("Prisma query error in RootLayout:", error);
    }
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
