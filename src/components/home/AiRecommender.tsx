"use client";

import { useState } from "react";
import { Sparkles, Loader2, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AiRecommender() {
  const [mood, setMood] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const handleRecommend = () => {
    if (!mood.trim()) return;
    setIsAnalyzing(true);
    setRecommendations([]);
    
    // Simulate AI Agent reasoning time
    setTimeout(() => {
      // Mock recommendations
      setRecommendations([
        { id: "jujutsu-kaisen", title: "Jujutsu Kaisen", coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx113415-bbBWj4pEFseh.jpg", match: "98%", reason: "Matches your action-packed mood with stunning animation." },
        { id: "solo-leveling", title: "Solo Leveling", coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-m1gX3iqITivI.png", match: "92%", reason: "Perfect zero-to-hero story based on your preferences." },
        { id: "aot-final-season", title: "Attack on Titan", coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx104578-LaRYFCzuRAM5.jpg", match: "89%", reason: "Epic plot twists that will keep you on edge." }
      ]);
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 md:px-8 my-16">
      <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-black flex items-center text-white">
              <Sparkles className="w-8 h-8 mr-3 text-purple-400" />
              AI Anime Recommender
            </h2>
            <p className="text-gray-300">
              Not sure what to watch? Tell our AI agent your current mood, favorite genres, or two animes you liked, and it will find the perfect match.
            </p>
            
            <div className="flex gap-2 mt-4">
              <input 
                type="text" 
                value={mood}
                onChange={e => setMood(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRecommend()}
                placeholder="E.g. 'I want something dark like Death Note' or 'Chill slice of life'"
                className="flex-1 bg-black/50 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-400 shadow-inner"
              />
              <button 
                onClick={handleRecommend}
                disabled={isAnalyzing || !mood.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center"
              >
                {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Discover"}
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            {isAnalyzing ? (
              <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-purple-300 space-y-3 bg-black/30 rounded-xl border border-white/5 p-6">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-mono animate-pulse">Agent is scanning the database...</p>
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendations.map(anime => (
                  <Link key={anime.id} href={`/anime/${anime.id}`} className="group relative bg-black/40 rounded-xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition">
                    <div className="aspect-[3/4] relative">
                      <img src={anime.coverImage} alt={anime.title} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute top-2 right-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                        {anime.match} Match
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                        <Play className="w-10 h-10 text-white fill-white shadow-2xl" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 p-3 w-full">
                      <h4 className="font-bold text-sm text-white line-clamp-1">{anime.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[160px] flex items-center justify-center bg-black/30 rounded-xl border border-white/5 border-dashed p-6 text-center text-gray-500 text-sm">
                Recommendations will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
