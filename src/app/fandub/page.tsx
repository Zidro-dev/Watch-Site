export const dynamic = 'force-dynamic';

import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { Mic2, Music } from "lucide-react";
import Link from "next/link";
import CreatorStudioClient from "./CreatorStudioClient";

const prisma = new PrismaClient();

export default async function FandubPortalPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Anime and their Episodes for the form dropdowns
  const animes = await prisma.anime.findMany({
    select: {
      id: true,
      title: true,
      episodes: {
        select: {
          id: true,
          episodeNumber: true,
          title: true,
        },
        orderBy: { episodeNumber: "asc" }
      }
    },
    orderBy: { title: "asc" }
  });

  let myTracks: any[] = [];
  if (user) {
    myTracks = await prisma.audioTrack.findMany({
      where: { creatorId: user.id },
      include: {
        episode: {
          include: { anime: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center border-b border-white/10 pb-8">
          <div className="inline-flex h-16 w-16 rounded-full bg-primary/20 items-center justify-center mb-4 border border-primary/50 shadow-[0_0_15px_rgba(229,9,20,0.3)]">
            <Mic2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">Fandub Creator Studio</h1>
          <p className="text-gray-400 mt-4 text-lg">
            Share your voice with the world. Manage your submitted tracks and upload new ones.
          </p>
        </div>

        {!user ? (
          <div className="bg-secondary/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center shadow-xl">
            <Music className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-white">Join the Community</h2>
            <p className="text-gray-400 mb-6">You must be logged in to submit a fandub track.</p>
            <Link href="/login" className="inline-block bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition shadow-lg hover:shadow-primary/50">
              Sign In to Access Studio
            </Link>
          </div>
        ) : (
          <CreatorStudioClient animes={animes} userId={user.id} myTracks={myTracks} />
        )}
      </div>
    </div>
  );
}
