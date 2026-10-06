export const dynamic = 'force-dynamic';

import { prisma } from "@/utils/prisma";
import { notFound } from "next/navigation";
import WatchPlayerClient from "./WatchPlayerClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import type { Metadata } from "next";

import { fallbackEpisodes, fallbackAnimes } from "@/utils/fallback-data";

export async function generateMetadata({ params }: { params: { episodeId: string } }): Promise<Metadata> {
  let episode = null;
  try {
    episode = await prisma.episode.findUnique({
      where: { id: params.episodeId },
      include: { anime: true }
    });
  } catch (error) {
    console.error("Metadata prisma error in WatchPage", error);
  }

  if (!episode) {
    episode = fallbackEpisodes.find(ep => ep.id === params.episodeId) as any;
    if (episode) {
      episode.anime = fallbackAnimes.find(a => a.id === episode.animeId);
    }
  }

  if (!episode) {
    return { title: "Episode Not Found - AniZone" };
  }

  const title = `Watch ${episode.anime.title} - Episode ${episode.episodeNumber}`;
  const desc = `Stream Episode ${episode.episodeNumber} of ${episode.anime.title} with multiple audio tracks and subtitles on AniZone.`;

  return {
    title: `${title} | AniZone`,
    description: desc,
    openGraph: {
      title: title,
      description: desc,
      images: [
        {
          url: episode.anime.coverImage || "",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "video.episode",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: desc,
      images: [episode.anime.coverImage || ""],
    }
  };
}

export default async function WatchPage({ params }: { params: { episodeId: string } }) {
  const supabase = createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Supabase user error in WatchPage:", error);
  }

  let episode = null;
  let nextEpisode = null;
  let initialProgress = 0;

  try {
    episode = await prisma.episode.findUnique({
      where: { id: params.episodeId },
      include: {
        anime: true,
        audioTracks: {
          where: { isApproved: true },
        },
        subtitleTracks: true,
      }
    });

    if (user && episode) {
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

    if (episode) {
      nextEpisode = await prisma.episode.findFirst({
        where: {
          animeId: episode.animeId,
          episodeNumber: episode.episodeNumber + 1
        }
      });
    }
  } catch (error) {
    console.error("Prisma error in WatchPage:", error);
  }

  if (!episode) {
    episode = fallbackEpisodes.find(ep => ep.id === params.episodeId) as any;
    if (episode) {
      episode.anime = fallbackAnimes.find(a => a.id === episode.animeId);
    } else {
      // If we don't have a matching fallback, just use the first fallback to prevent crash
      episode = fallbackEpisodes[0] as any;
      episode.anime = fallbackAnimes[0];
    }
  }

  if (!episode) {
    notFound();
  }

  const tracks = [
    { id: "official", language: "Original (Japanese)", url: "", source: "OFFICIAL" },
    ...(episode.audioTracks || [])
  ];

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
          user={user}
        />
      </div>
    </div>
  );
}
