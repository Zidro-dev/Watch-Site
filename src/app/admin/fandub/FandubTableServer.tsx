import { prisma } from "@/utils/prisma";
import FandubRowClient from "./FandubRowClient";



export default async function FandubTableServer() {
  const pendingTracks = await prisma.audioTrack.findMany({
    where: { isApproved: false, source: "FANDUB" },
    include: {
      episode: {
        include: { anime: true }
      },
      creator: true
    },
    orderBy: { createdAt: 'asc' }
  });

  if (pendingTracks.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
        No pending fandub tracks to moderate.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-secondary/50 border-b border-border">
          <tr>
            <th className="px-6 py-4 font-medium">Anime & Episode</th>
            <th className="px-6 py-4 font-medium">Language</th>
            <th className="px-6 py-4 font-medium">Creator</th>
            <th className="px-6 py-4 font-medium">Preview</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {pendingTracks.map((track) => (
            <FandubRowClient 
              key={track.id} 
              track={{
                id: track.id,
                animeTitle: track.episode.anime.title,
                episodeNumber: track.episode.episodeNumber,
                language: track.language,
                creatorEmail: track.creator?.email || "Unknown",
                url: track.url
              }} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
