"use client";

import { useGamification, RANKS } from "@/components/layout/GamificationProvider";
import { Shield, Star, Trophy, Target, Zap, Crown } from "lucide-react";

export default function ProfileGamification() {
  const { xp, level, rankName } = useGamification();

  const nextRank = RANKS.find(r => r.max > xp) || RANKS[RANKS.length - 1];
  const progressPercent = Math.min(100, (xp / nextRank.max) * 100);

  const badges = [
    { id: 1, name: "First Review", icon: <Star className="w-5 h-5 text-yellow-400" />, earned: xp >= 100 },
    { id: 2, name: "Night Owl", icon: <Trophy className="w-5 h-5 text-purple-400" />, earned: xp >= 300 },
    { id: 3, name: "Studio Supporter", icon: <Heart className="w-5 h-5 text-red-400" />, earned: xp >= 800 },
    { id: 4, name: "Anime God", icon: <Crown className="w-5 h-5 text-primary" />, earned: xp >= 2000 },
  ];

  return (
    <div className="space-y-6 mt-8 border-t border-white/10 pt-8">
      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Otaku Rank & XP
        </h3>
        
        <div className="bg-black/40 border border-white/10 rounded-xl p-5">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm text-gray-400">Current Rank</p>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                {rankName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{xp} <span className="text-sm text-gray-400 font-normal">XP</span></p>
            </div>
          </div>
          
          <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mt-3 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercent}%` }}
            >
              <div className="absolute top-0 bottom-0 right-0 w-4 bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500 font-medium">
            <span>Level {level}</span>
            <span>Next: {nextRank.name} ({nextRank.max} XP)</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-400" />
          Achievements & Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map(badge => (
            <div 
              key={badge.id}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                badge.earned 
                  ? "bg-white/5 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-white/40" 
                  : "bg-black/50 border-white/5 opacity-40 grayscale"
              }`}
            >
              <div className={`p-3 rounded-full mb-2 ${badge.earned ? 'bg-black/50 border border-white/10' : 'bg-transparent'}`}>
                {badge.icon}
              </div>
              <p className="text-xs font-bold text-white">{badge.name}</p>
              {!badge.earned && <p className="text-[10px] text-gray-500 mt-1">Locked</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Just adding a quick Heart import since I used it inside the component:
import { Heart } from "lucide-react";
