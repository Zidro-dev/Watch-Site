"use client";

import Player from "@/components/video/Player";
import { saveWatchProgress } from "./actions";
import { useEffect, useState } from "react";

type WatchPlayerClientProps = {
  episode: any;
  tracks: any[];
  initialProgress?: number;
  nextEpisodeUrl?: string;
};

export default function WatchPlayerClient({ episode, tracks, initialProgress = 0, nextEpisodeUrl }: WatchPlayerClientProps) {
  const customAudioTracks = tracks
    .filter(t => t.id !== "official")
    .map(t => ({
      id: t.id,
      language: t.language,
      url: t.url,
      source: t.source
    }));

  const handleProgressSave = (time: number) => {
    saveWatchProgress(episode.id, time);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {episode.title || `Episode ${episode.episodeNumber}`}
        </h1>
        <p className="text-gray-400">
          Episode {episode.episodeNumber} of {episode.anime.title}
        </p>
      </div>
      
      {/* Our Custom Hybrid Video Player */}
      <Player 
        videoUrl={episode.videoUrl} 
        audioTracks={customAudioTracks} 
        subtitleTracks={episode.subtitleTracks || []} 
        initialTime={initialProgress}
        onProgressSave={handleProgressSave}
        nextEpisodeUrl={nextEpisodeUrl}
      />
      
      <div className="mt-8 bg-secondary/30 p-6 rounded-xl border border-white/5">
        <h3 className="font-bold text-lg mb-2 flex items-center">
          <span className="bg-primary w-2 h-6 rounded-full mr-3 inline-block"></span>
          About This Episode
        </h3>
        <p className="text-gray-400">
          This episode supports our hybrid multi-track audio system. Hover over the video player and click the settings icon in the bottom right corner to switch seamlessly between the original Japanese audio and community-submitted Fandub tracks.
        </p>
      </div>
    </div>
  );
}
