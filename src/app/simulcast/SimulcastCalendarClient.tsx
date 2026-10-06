"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Clock } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SimulcastCalendarClient({ animes }: { animes: any[] }) {
  // Determine current day index (0 = Monday, 6 = Sunday)
  const today = new Date().getDay();
  const currentDayIdx = today === 0 ? 6 : today - 1;
  const [activeDay, setActiveDay] = useState(currentDayIdx);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Distribute animes pseudo-randomly across days based on their ID for demo purposes
  const schedule = DAYS.map((day, idx) => {
    return {
      day,
      animes: animes.filter(a => {
        // Simple hash string to number
        let hash = 0;
        for (let i = 0; i < a.id.length; i++) hash += a.id.charCodeAt(i);
        return hash % 7 === idx;
      }).map(a => {
        // Assign a mock airing time for the countdown
        const airingHour = 10 + (hash(a.id) % 12); // Between 10:00 and 22:00
        return { ...a, airingHour };
      })
    };
  });

  function hash(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h += str.charCodeAt(i);
    return h;
  }

  const activeSchedule = schedule[activeDay].animes;

  const formatCountdown = (airingHour: number, dayIdx: number) => {
    const target = new Date();
    
    // Calculate days difference
    let daysDiff = dayIdx - currentDayIdx;
    if (daysDiff < 0) daysDiff += 7; // Next week
    
    target.setDate(target.getDate() + daysDiff);
    target.setHours(airingHour, 0, 0, 0);

    // If it's today but already passed, it airs next week
    if (daysDiff === 0 && target.getTime() < now.getTime()) {
      target.setDate(target.getDate() + 7);
    }

    const diffMs = target.getTime() - now.getTime();
    if (diffMs <= 0) return "Airing Now!";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diffMs / 1000 / 60) % 60);
    const secs = Math.floor((diffMs / 1000) % 60);

    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Days Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar space-x-2 mb-8 pb-2">
        {DAYS.map((day, idx) => (
          <button
            key={day}
            onClick={() => setActiveDay(idx)}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all ${
              activeDay === idx 
                ? "bg-primary text-white shadow-[0_0_15px_rgba(229,9,20,0.5)]" 
                : "bg-secondary text-gray-400 hover:text-white hover:bg-secondary/80"
            }`}
          >
            {day} {idx === currentDayIdx && <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded">Today</span>}
          </button>
        ))}
      </div>

      {activeSchedule.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground bg-secondary/30 rounded-2xl border border-white/5">
          No simulcasts scheduled for {DAYS[activeDay]}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeSchedule.map((anime) => {
            const countdown = formatCountdown(anime.airingHour, activeDay);
            const isAiringNow = countdown === "Airing Now!";
            
            return (
              <div key={anime.id} className="group relative flex bg-secondary border border-white/10 rounded-xl overflow-hidden h-44 hover:border-primary/50 transition-colors shadow-lg">
                <img src={anime.coverImage || ""} alt={anime.title} className="w-32 h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur text-xs font-bold px-2 py-1 rounded text-white border border-white/10">
                  {anime.airingHour}:00 JST
                </div>
                
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold line-clamp-2 text-white group-hover:text-primary transition-colors">{anime.title}</h3>
                    <div className={`mt-2 flex items-center space-x-1.5 text-xs font-mono font-bold px-2.5 py-1 rounded w-fit ${isAiringNow ? "bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse" : "bg-black/50 text-gray-300 border border-white/10"}`}>
                      <Clock className="w-3 h-3" />
                      <span>{countdown}</span>
                    </div>
                  </div>
                  
                  {anime.episodes?.length > 0 && (
                    <Link 
                      href={`/watch/${anime.episodes[0].id}`}
                      className="flex items-center space-x-2 text-sm font-semibold bg-white/5 hover:bg-primary/20 hover:text-primary px-3 py-2 rounded-lg transition-colors w-fit mt-3"
                    >
                      <Play className="h-4 w-4" />
                      <span>Ep {anime.episodes[0].episodeNumber}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
