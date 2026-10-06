"use client";

import { useState } from "react";
import { submitFandubTrack } from "./actions";
import { Loader2, CheckCircle2 } from "lucide-react";

type AnimeWithEpisodes = {
  id: string;
  title: string;
  episodes: {
    id: string;
    episodeNumber: number;
    title: string | null;
  }[];
};

export default function FandubCreatorForm({ animes, userId }: { animes: AnimeWithEpisodes[], userId: string }) {
  const [selectedAnime, setSelectedAnime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activeAnime = animes.find(a => a.id === selectedAnime);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setErrorMsg("");

    const formData = new FormData(e.currentTarget);
    formData.append("userId", userId);
    
    const result = await submitFandubTrack(formData);
    
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
      e.currentTarget.reset();
      setSelectedAnime("");
    } else {
      setErrorMsg(result.error || "Failed to submit track.");
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-500/20 mb-4 border border-green-500/50">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Track Submitted!</h3>
        <p className="text-gray-400 mb-6">
          Your audio track has been sent to the moderation queue. It will be available to all users once approved by an Admin.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-primary hover:underline font-medium"
        >
          Submit another track
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
      {errorMsg && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Select Anime</label>
        <select 
          name="animeId" 
          required 
          value={selectedAnime}
          onChange={(e) => setSelectedAnime(e.target.value)}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
        >
          <option value="" className="bg-black">-- Choose Anime --</option>
          {animes.map(a => (
            <option key={a.id} value={a.id} className="bg-black">{a.title}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Select Episode</label>
        <select 
          name="episodeId" 
          required 
          disabled={!activeAnime}
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition disabled:opacity-50"
        >
          <option value="" className="bg-black">-- Choose Episode --</option>
          {activeAnime?.episodes.map(ep => (
            <option key={ep.id} value={ep.id} className="bg-black">
              Episode {ep.episodeNumber} {ep.title ? `- ${ep.title}` : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Language</label>
          <input 
            type="text" 
            name="language" 
            required 
            placeholder="e.g., Uzbek, Russian"
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Fandub Group (Optional)</label>
          <input 
            type="text" 
            name="groupName" 
            placeholder="e.g., AniDUB"
            className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Audio File (MP3, WAV, M4A)</label>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus-within:border-primary transition border-dashed hover:border-primary/50 cursor-pointer">
          <input 
            type="file" 
            name="audioFile" 
            accept="audio/mp3, audio/wav, audio/mpeg, audio/mp4"
            required 
            className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          *Required. Maximum file size: 50MB. Ensure it's perfectly synced to the original Japanese video track.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle File (SRT, VTT) <span className="text-gray-500 text-xs ml-1">(Optional)</span></label>
        <div className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus-within:border-primary transition border-dashed hover:border-primary/50 cursor-pointer">
          <input 
            type="file" 
            name="subtitleFile" 
            accept=".vtt, .srt"
            className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Voice Actors Cast <span className="text-gray-500 text-xs ml-1">(Optional)</span></label>
        <textarea 
          name="voiceActors" 
          placeholder="E.g., Eren - John Doe, Mikasa - Jane Doe..."
          className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition min-h-[80px]"
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full mt-6 bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary/90 transition shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:shadow-[0_0_25px_rgba(229,9,20,0.5)] flex justify-center items-center disabled:opacity-50"
      >
        {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
        {isSubmitting ? "Uploading & Processing... Please wait" : "Submit to Moderation"}
      </button>
    </form>
  );
}
