"use client";

import { useState } from "react";
import { createAnime, createEpisode } from "../actions";

export default function ContentFormsClient({ availableAnimes }: { availableAnimes: { id: string, title: string }[] }) {
  const [activeTab, setActiveTab] = useState<"anime" | "episode">("anime");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Anime Form State
  const [animeTitle, setAnimeTitle] = useState("");
  const [animeDesc, setAnimeDesc] = useState("");
  const [animeYear, setAnimeYear] = useState("");
  const [animeImage, setAnimeImage] = useState("");
  const [animeTags, setAnimeTags] = useState("");

  // Episode Form State
  const [epAnimeId, setEpAnimeId] = useState("");
  const [epNumber, setEpNumber] = useState("");
  const [epTitle, setEpTitle] = useState("");
  const [epVideo, setEpVideo] = useState("");
  const [epPremium, setEpPremium] = useState(false);

  const handleAnimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createAnime({
      title: animeTitle,
      description: animeDesc,
      releaseYear: parseInt(animeYear),
      coverImage: animeImage,
      tags: animeTags.split(",").map(t => t.trim())
    });
    
    if (result.success) {
      alert("Anime created successfully!");
      setAnimeTitle(""); setAnimeDesc(""); setAnimeYear(""); setAnimeImage(""); setAnimeTags("");
    } else {
      alert("Error: " + result.error);
    }
    setIsSubmitting(false);
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createEpisode({
      animeId: epAnimeId,
      episodeNumber: parseInt(epNumber),
      title: epTitle,
      videoUrl: epVideo,
      isPremiumOnly: epPremium
    });
    
    if (result.success) {
      alert("Episode created successfully!");
      setEpNumber(""); setEpTitle(""); setEpVideo(""); setEpPremium(false);
    } else {
      alert("Error: " + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 max-w-2xl">
      <div className="flex space-x-4 mb-6 border-b border-border pb-4">
        <button 
          onClick={() => setActiveTab("anime")}
          className={`px-4 py-2 font-semibold rounded-md transition ${activeTab === "anime" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"}`}
        >
          Add Anime
        </button>
        <button 
          onClick={() => setActiveTab("episode")}
          className={`px-4 py-2 font-semibold rounded-md transition ${activeTab === "episode" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"}`}
        >
          Add Episode
        </button>
      </div>

      {activeTab === "anime" && (
        <form onSubmit={handleAnimeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input required type="text" className="w-full bg-secondary border border-border rounded px-3 py-2" value={animeTitle} onChange={e => setAnimeTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Synopsis</label>
            <textarea required className="w-full bg-secondary border border-border rounded px-3 py-2" rows={3} value={animeDesc} onChange={e => setAnimeDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Release Year</label>
              <input required type="number" className="w-full bg-secondary border border-border rounded px-3 py-2" value={animeYear} onChange={e => setAnimeYear(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <input required type="text" placeholder="Action, Drama, Fantasy" className="w-full bg-secondary border border-border rounded px-3 py-2" value={animeTags} onChange={e => setAnimeTags(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Cover Image URL</label>
            <input required type="url" className="w-full bg-secondary border border-border rounded px-3 py-2" value={animeImage} onChange={e => setAnimeImage(e.target.value)} />
          </div>
          <button disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Create Anime"}
          </button>
        </form>
      )}

      {activeTab === "episode" && (
        <form onSubmit={handleEpisodeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Select Anime</label>
            <select required className="w-full bg-secondary border border-border rounded px-3 py-2" value={epAnimeId} onChange={e => setEpAnimeId(e.target.value)}>
              <option value="">-- Select Anime --</option>
              {availableAnimes.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Episode Number</label>
              <input required type="number" className="w-full bg-secondary border border-border rounded px-3 py-2" value={epNumber} onChange={e => setEpNumber(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Episode Title</label>
              <input type="text" className="w-full bg-secondary border border-border rounded px-3 py-2" value={epTitle} onChange={e => setEpTitle(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Video URL (MP4 / HLS)</label>
            <input required type="url" className="w-full bg-secondary border border-border rounded px-3 py-2" value={epVideo} onChange={e => setEpVideo(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="premium" className="h-4 w-4 bg-secondary border-border" checked={epPremium} onChange={e => setEpPremium(e.target.checked)} />
            <label htmlFor="premium" className="text-sm">Is Premium Only?</label>
          </div>
          <button disabled={isSubmitting} className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Create Episode"}
          </button>
        </form>
      )}
    </div>
  );
}
