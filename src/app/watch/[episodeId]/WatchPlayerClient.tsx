"use client";

import Player from "@/components/video/Player";
import { saveWatchProgress } from "./actions";
import { useEffect, useState } from "react";
import { Users, Copy, X, Send, Heart, Flame, MessageCircle, Coffee } from "lucide-react";
import { useGamification } from "@/components/layout/GamificationProvider";

type WatchPlayerClientProps = {
  episode: any;
  tracks: any[];
  initialProgress?: number;
  nextEpisodeUrl?: string;
  user?: any;
};

export default function WatchPlayerClient({ episode, tracks, initialProgress = 0, nextEpisodeUrl, user }: WatchPlayerClientProps) {
  const [isWatchParty, setIsWatchParty] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<{ id: number, user: string, text: string, type: "text"|"system" }[]>([
    { id: 1, user: "System", text: "Welcome to the Watch Party! Invite friends to join.", type: "system" }
  ]);
  const [flyingEmojis, setFlyingEmojis] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [hasAwardedXp, setHasAwardedXp] = useState(false);
  const { addXp } = useGamification();

  useEffect(() => {
    if (!hasAwardedXp && user) {
      setTimeout(() => {
        addXp(50, "Watched an episode");
        setHasAwardedXp(true);
      }, 5000); // award after 5 seconds of watching
    }
  }, [user, hasAwardedXp]);

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

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      user: user?.fullName || "Guest", 
      text: chatMessage,
      type: "text"
    }]);
    setChatMessage("");
  };

  const sendEmoji = (emoji: string) => {
    const newEmoji = { id: Date.now(), emoji, x: Math.random() * 80 + 10 };
    setFlyingEmojis(prev => [...prev, newEmoji]);
    
    // Remove emoji after animation
    setTimeout(() => {
      setFlyingEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
    }, 2000);
  };

  const copyInvite = () => {
    navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href + "?party=true" : "");
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  // Auto-activate party if URL has ?party=true
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("party=true")) {
      setIsWatchParty(true);
      setMessages(prev => [...prev, { id: Date.now(), user: "System", text: `${user?.fullName || "A new viewer"} joined the party!`, type: "system" }]);
    }
  }, [user]);

  return (
    <div className={`mx-auto transition-all duration-300 ${isWatchParty ? "max-w-[1400px]" : "max-w-5xl"}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Video Column */}
        <div className={`flex-1 transition-all duration-300 ${isWatchParty ? "lg:w-[70%]" : "w-full"}`}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {episode.title || `Episode ${episode.episodeNumber}`}
              </h1>
              <p className="text-gray-400">
                Episode {episode.episodeNumber} of {episode.anime.title}
              </p>
            </div>
            {!isWatchParty && (
              <button 
                onClick={() => setIsWatchParty(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-lg transition-transform hover:scale-105"
              >
                <Users className="w-5 h-5 mr-2" />
                Start Watch Party
              </button>
            )}
          </div>
          
          <Player 
            videoUrl={episode.videoUrl} 
            audioTracks={customAudioTracks} 
            subtitleTracks={episode.subtitleTracks || []} 
            initialTime={initialProgress}
            onProgressSave={handleProgressSave}
            nextEpisodeUrl={nextEpisodeUrl}
            flyingEmojis={flyingEmojis}
          />
          
          <div className="mt-8 bg-secondary/30 p-6 rounded-xl border border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h3 className="font-bold text-lg flex items-center">
                <span className="bg-primary w-2 h-6 rounded-full mr-3 inline-block"></span>
                About This Episode
              </h3>
              
              <button 
                onClick={() => {
                  const amt = prompt("Enter donation amount ($):", "5");
                  if (amt) {
                    alert(`Thank you! You have successfully donated $${amt} to support the Fandub Creators of this episode!`);
                    addXp(200, "Supported a Creator!");
                  }
                }}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/50 font-bold py-2 px-4 rounded-lg flex items-center transition-colors text-sm"
              >
                <Coffee className="w-4 h-4 mr-2" />
                Support Studio / Donate
              </button>
            </div>
            
            <p className="text-gray-400">
              This episode supports our hybrid multi-track audio system. Hover over the video player and click the settings icon in the bottom right corner to switch seamlessly between the original Japanese audio and community-submitted Fandub tracks.
            </p>
          </div>
        </div>

        {/* Watch Party Sidebar */}
        {isWatchParty && (
          <div className="w-full lg:w-[30%] lg:min-w-[320px] bg-black/50 border border-white/10 rounded-xl overflow-hidden flex flex-col h-[600px] lg:h-auto shadow-2xl animate-fade-in">
            <div className="bg-purple-900/40 p-4 border-b border-purple-500/30 flex items-center justify-between">
              <h3 className="font-bold text-purple-100 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-400" />
                Watch Party Room
              </h3>
              <button onClick={() => setIsWatchParty(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 border-b border-white/5 bg-white/5">
              <button 
                onClick={copyInvite}
                className="w-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 py-2 rounded-lg text-sm text-gray-200 transition"
              >
                <Copy className="w-4 h-4 mr-2" />
                {inviteCopied ? "Invite Link Copied!" : "Copy Invite Link"}
              </button>
              <div className="flex items-center space-x-2 mt-3 text-xs text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>{Math.floor(Math.random() * 5) + 2} people watching</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar flex flex-col justify-end">
              {messages.map(msg => (
                <div key={msg.id} className={`text-sm ${msg.type === 'system' ? 'text-gray-500 text-center italic' : 'text-gray-300'}`}>
                  {msg.type === 'text' && <span className="font-bold text-purple-400 mr-2">{msg.user}:</span>}
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-white/10 bg-black/80">
              <div className="flex justify-center gap-4 mb-3">
                {['🔥', '😭', '🤯', '😂', '💖'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => sendEmoji(emoji)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  placeholder="Chat with the party..." 
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 rounded-full p-2 text-white transition">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
