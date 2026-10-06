"use client";

import { useState } from "react";
import FandubCreatorForm from "./FandubCreatorForm";
import { List, Plus, CheckCircle2, Clock, XCircle, Bot, Wand2, FileText, Download } from "lucide-react";

export default function CreatorStudioClient({ animes, userId, myTracks }: { animes: any[], userId: string, myTracks: any[] }) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "submit" | "ai-sub">("dashboard");
  const [srtText, setSrtText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedSrt, setTranslatedSrt] = useState("");

  const handleTranslate = () => {
    if (!srtText.trim()) return;
    setIsTranslating(true);
    
    // Simulate AI Translation Delay
    setTimeout(() => {
      const translated = srtText
        .replace(/Hello/gi, "Salom")
        .replace(/I love you/gi, "Men seni sevaman")
        .replace(/What is this\?/gi, "Bu nima?")
        .replace(/Naruto/gi, "Naruto")
        .replace(/Sasuke/gi, "Sasuke")
        .replace(/Attack/gi, "Hujum")
        .replace(/Titan/gi, "Titan")
        .replace(/Demon/gi, "Iblis")
        .replace(/Sword/gi, "Qilich")
        .replace(/Brother/gi, "Aka")
        .replace(/Wait/gi, "Kutib tur")
        .replace(/Sorry/gi, "Kechirasiz")
        .replace(/Thank you/gi, "Rahmat")
        .replace(/Yes/gi, "Ha")
        .replace(/No/gi, "Yo'q")
        .replace(/Are you okay\?/gi, "Yaxshimisiz?")
        .replace(/Please/gi, "Iltimos")
        .replace(/Friend/gi, "Do'st")
        .replace(/Power/gi, "Kuch")
        .replace(/Die/gi, "O'l")
        .replace(/Stop/gi, "To'xta")
        // Generic fallback for simulation
        .split('\n').map(line => {
          // If line is timestamp or number, keep it
          if (line.match(/^\d+$/) || line.match(/\d{2}:\d{2}:\d{2}/) || line.trim() === "") return line;
          // If no specific match was made, append "(Uzbek translated)"
          if (!line.match(/Salom|Men|Bu nima|Hujum|Kutib/)) {
            return `${line} (AI Tarjima)`;
          }
          return line;
        }).join('\n');
        
      setTranslatedSrt(translated);
      setIsTranslating(false);
    }, 2500);
  };

  const handleDownloadSrt = () => {
    const blob = new Blob([translatedSrt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "translated_uzbek.srt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Tabs Header */}
      <div className="flex border-b border-white/10 overflow-x-auto hide-scrollbar">
        <button 
          onClick={() => setActiveTab("dashboard")}
          className={`flex-1 flex items-center justify-center py-4 px-6 font-semibold transition-colors whitespace-nowrap ${activeTab === "dashboard" ? "bg-white/10 text-white border-b-2 border-primary" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
        >
          <List className="w-5 h-5 mr-2" /> My Tracks
        </button>
        <button 
          onClick={() => setActiveTab("submit")}
          className={`flex-1 flex items-center justify-center py-4 px-6 font-semibold transition-colors whitespace-nowrap ${activeTab === "submit" ? "bg-white/10 text-white border-b-2 border-primary" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
        >
          <Plus className="w-5 h-5 mr-2" /> Submit Track
        </button>
        <button 
          onClick={() => setActiveTab("ai-sub")}
          className={`flex-1 flex items-center justify-center py-4 px-6 font-semibold transition-colors whitespace-nowrap ${activeTab === "ai-sub" ? "bg-purple-600/20 text-purple-400 border-b-2 border-purple-500" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
        >
          <Bot className="w-5 h-5 mr-2" /> AI Auto-Sub
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
        ) : activeTab === "submit" ? (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="bg-primary w-2 h-6 rounded-full mr-3 inline-block"></span>
              Submit Audio Track
            </h2>
            <FandubCreatorForm animes={animes} userId={userId} />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold flex items-center text-purple-400">
                  <Bot className="w-6 h-6 mr-3" />
                  AI Subtitle Translator
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Paste your English/Japanese SRT file and let our AI translate it to Uzbek while preserving timestamps.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  <FileText className="w-4 h-4 mr-2" /> Original SRT Text
                </label>
                <textarea
                  value={srtText}
                  onChange={(e) => setSrtText(e.target.value)}
                  placeholder={"1\n00:00:01,000 --> 00:00:04,000\nHello, world!"}
                  className="w-full h-[400px] bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-gray-300 font-mono focus:border-purple-500 focus:outline-none resize-none"
                />
                <button
                  onClick={handleTranslate}
                  disabled={isTranslating || !srtText.trim()}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center disabled:opacity-50"
                >
                  {isTranslating ? <Wand2 className="w-5 h-5 mr-2 animate-spin" /> : <Wand2 className="w-5 h-5 mr-2" />}
                  {isTranslating ? "Translating..." : "Translate with AI"}
                </button>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center justify-between">
                  <span className="flex items-center"><FileText className="w-4 h-4 mr-2" /> Translated SRT (Uzbek)</span>
                  {translatedSrt && (
                    <button onClick={handleDownloadSrt} className="text-purple-400 hover:text-white text-xs flex items-center">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </button>
                  )}
                </label>
                <textarea
                  value={translatedSrt}
                  readOnly
                  placeholder="Translated text will appear here..."
                  className="w-full h-[400px] bg-purple-900/10 border border-purple-500/30 rounded-xl p-4 text-sm text-white font-mono focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
