export const dynamic = 'force-dynamic';

import { prisma } from "@/utils/prisma";
import { Users, Mic2, Film, PlayCircle } from "lucide-react";



export default async function AdminOverview() {
  let userCount = 0, animeCount = 0, episodeCount = 0, pendingTracks = 0;
  
  try {
    [userCount, animeCount, episodeCount, pendingTracks] = await Promise.all([
      prisma.user.count(),
      prisma.anime.count(),
      prisma.episode.count(),
      prisma.audioTrack.count({ where: { isApproved: false, source: "FANDUB" } })
    ]);
  } catch (error) {
    console.error("Prisma error in AdminOverview:", error);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-full"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <h3 className="text-2xl font-bold">{userCount}</h3>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 text-purple-500 rounded-full"><Film className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Anime Titles</p>
            <h3 className="text-2xl font-bold">{animeCount}</h3>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-500 rounded-full"><PlayCircle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Total Episodes</p>
            <h3 className="text-2xl font-bold">{episodeCount}</h3>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 text-primary rounded-full"><Mic2 className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Fandubs</p>
            <h3 className="text-2xl font-bold text-primary">{pendingTracks}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
