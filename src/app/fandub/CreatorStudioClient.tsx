"use client";

import { useState } from "react";
import FandubCreatorForm from "./FandubCreatorForm";
import { List, Plus, CheckCircle2, Clock, XCircle } from "lucide-react";

export default function CreatorStudioClient({ animes, userId, myTracks }: { animes: any[], userId: string, myTracks: any[] }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "submit">("dashboard");

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 flex items-center justify-center py-4 font-semibold transition-colors ${activeTab === "dashboard" ? "bg-white/10 text-white border-b-2 border-primary" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
        >
          <List className="w-5 h-5 mr-2" /> My Tracks
        </button>
        <button 
          onClick={() => setActiveTab("submit")}
          className={`flex-1 flex items-center justify-center py-4 font-semibold transition-colors ${activeTab === "submit" ? "bg-white/10 text-white border-b-2 border-primary" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
        >
          <Plus className="w-5 h-5 mr-2" /> Submit New Track
        </button>
      </div>

      <div className="p-6 md:p-10">
        {activeTab === "dashboard" ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Submissions</h2>
            {myTracks.length === 0 ? (
              <div className="text-center py-10 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400">You haven't submitted any tracks yet.</p>
                <button 
                  onClick={() => setActiveTab("submit")}
                  className="mt-4 text-primary font-semibold hover:underline"
                >
                  Submit your first Fandub
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myTracks.map((track) => (
                  <div key={track.id} className="bg-white/5 border border-white/10 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/20 px-2 py-0.5 rounded">
                          {track.language}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(track.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-lg">
                        {track.episode.anime.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Episode {track.episode.episodeNumber} {track.episode.title ? `- ${track.episode.title}` : ""}
                      </p>
                    </div>
                    
                    <div className="flex items-center">
                      {track.isApproved ? (
                        <div className="flex items-center text-green-500 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full text-sm font-semibold">
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approved
                        </div>
                      ) : (
                        <div className="flex items-center text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1.5 rounded-full text-sm font-semibold">
                          <Clock className="w-4 h-4 mr-1.5" /> Pending Review
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-primary w-2 h-6 rounded-full mr-3 inline-block"></span>
              Submit Audio Track
            </h2>
            <FandubCreatorForm animes={animes} userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
}
