"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Star, Trophy } from "lucide-react";

type GamificationContextType = {
  xp: number;
  level: number;
  rankName: string;
  addXp: (amount: number, reason: string) => void;
};

const GamificationContext = createContext<GamificationContextType>({
  xp: 0,
  level: 1,
  rankName: "Lvl 1: Rookie",
  addXp: () => {},
});

export const useGamification = () => useContext(GamificationContext);

export const RANKS = [
  { max: 100, name: "Lvl 1: Rookie" },
  { max: 300, name: "Lvl 5: Chunin" },
  { max: 800, name: "Lvl 15: Hashira" },
  { max: 2000, name: "Lvl 30: S-Rank Hunter" },
  { max: 999999, name: "Lvl 50: Anime God" },
];

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; amount: number; reason: string }[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedXp = localStorage.getItem("anizone_xp");
      if (savedXp) setXp(parseInt(savedXp, 10));
    }
  }, []);

  const getRank = (currentXp: number) => {
    return RANKS.find(r => currentXp < r.max)?.name || "Lvl 50: Anime God";
  };

  const getLevel = (currentXp: number) => {
    if (currentXp < 100) return 1;
    if (currentXp < 300) return 5;
    if (currentXp < 800) return 15;
    if (currentXp < 2000) return 30;
    return 50;
  };

  const addXp = (amount: number, reason: string) => {
    setXp((prev) => {
      const newXp = prev + amount;
      localStorage.setItem("anizone_xp", newXp.toString());
      return newXp;
    });

    const newToast = { id: Date.now(), amount, reason };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  return (
    <GamificationContext.Provider value={{ xp, level: getLevel(xp), rankName: getRank(xp), addXp }}>
      {children}
      
      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className="bg-black/90 backdrop-blur-xl border border-yellow-500/30 text-white p-4 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.2)] animate-slide-up flex items-center gap-3"
          >
            <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-500">
              <Star className="w-5 h-5 fill-yellow-500" />
            </div>
            <div>
              <p className="font-bold text-yellow-500">+{toast.amount} XP!</p>
              <p className="text-xs text-gray-300 font-medium">{toast.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </GamificationContext.Provider>
  );
}
