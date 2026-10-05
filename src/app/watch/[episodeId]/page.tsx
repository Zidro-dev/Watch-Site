export const dynamic = 'force-dynamic';

import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";
import WatchPlayerClient from "./WatchPlayerClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";



export default async function WatchPage({ params }: { params: { episodeId: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const episode = await prisma.episode.findUnique({
    where: { id: params.episodeId },
    include: {
      anime: true,
      audioTracks: {
        where: { isApproved: true },
      },
      subtitleTracks: true,
    }
  });

  if (!episode) {
    notFound();
  }

  let initialProgress = 0;
  if (user) {
    const progress = await prisma.watchProgress.findUnique({
      where: {
        userId_episodeId: {
          userId: user.id,
          episodeId: episode.id
        }
      }
    });
    if (progress) initialProgress = progress.timestamp;
  }

  const tracks = [
    { id: "official", language: "Original (Japanese)", url: "", source: "OFFICIAL" },
    ...episode.audioTracks
  ];

  const nextEpisode = await prisma.episode.findFirst({
    where: {
      animeId: episode.animeId,
      episodeNumber: episode.episodeNumber + 1
    }
  });
  const nextEpisodeUrl = nextEpisode ? `/watch/${nextEpisode.id}` : undefined;

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="container mx-auto px-4 py-6">
        <Link 
          href={`/anime/${episode.animeId}`}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {episode.anime.title}
        </Link>
        
        <WatchPlayerClient 
          episode={episode} 
          tracks={tracks} 
          initialProgress={initialProgress}
          nextEpisodeUrl={nextEpisodeUrl}
        />
      </div>
    </div>
  );
}
