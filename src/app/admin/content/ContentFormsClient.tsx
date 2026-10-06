"use client";

import { useState } from "react";
import { createAnime, createEpisode } from "../actions";
import { Search, Loader2, Download } from "lucide-react";

export default function ContentFormsClient({ availableAnimes }: { availableAnimes: { id: string, title: string }[] }) {
  const [activeTab, setActiveTab] = useState<"anime" | "episode" | "import">("anime");
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

  // Import State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleAnimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createAnime({
      title: animeTitle,
      description: animeDesc,
      releaseYear: parseInt(animeYear) || 2024,
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

  const searchJikan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error("Jikan API Error:", error);
      alert("Failed to fetch from MyAnimeList.");
    }
    setIsSearching(false);
  };

  const importAnime = async (anime: any) => {
    setIsSubmitting(true);
    
    const tags = anime.genres ? anime.genres.map((g: any) => g.name) : ["Anime"];
    const year = anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 2024);
    
    const result = await createAnime({
      title: anime.title_english || anime.title,
      description: anime.synopsis || "No description provided.",
      releaseYear: year,
      coverImage: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || "",
      tags: tags
    });
    
    if (result.success) {
      alert(`Imported ${anime.title} successfully!`);
      // Update available list optimistically if needed, or rely on page reload
    } else {
      alert("Error: " + result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 max-w-3xl">
      <div className="flex space-x-2 sm:space-x-4 mb-6 border-b border-border pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("anime")}
          className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap ${activeTab === "anime" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"}`}
        >
          Add Anime
        </button>
        <button 
          onClick={() => setActiveTab("episode")}
          className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap ${activeTab === "episode" ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"}`}
        >
          Add Episode
        </button>
        <button 
          onClick={() => setActiveTab("import")}
          className={`px-4 py-2 font-semibold rounded-md transition whitespace-nowrap flex items-center ${activeTab === "import" ? "bg-blue-600 text-white" : "text-blue-400 hover:bg-blue-600/10"}`}
        >
          <Download className="w-4 h-4 mr-2" /> Import from MAL
        </button>
      </div>

      {activeTab === "anime" && (
        <form onSubmit={handleAnimeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input required type="text" className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={animeTitle} onChange={e => setAnimeTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Synopsis</label>
            <textarea required className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" rows={3} value={animeDesc} onChange={e => setAnimeDesc(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Release Year</label>
              <input required type="number" className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={animeYear} onChange={e => setAnimeYear(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <input required type="text" placeholder="Action, Drama, Fantasy" className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={animeTags} onChange={e => setAnimeTags(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Cover Image URL</label>
            <input required type="url" className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={animeImage} onChange={e => setAnimeImage(e.target.value)} />
          </div>
          <button disabled={isSubmitting} className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Create Anime"}
          </button>
        </form>
      )}

      {activeTab === "episode" && (
        <form onSubmit={handleEpisodeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Select Anime</label>
            <select required className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={epAnimeId} onChange={e => setEpAnimeId(e.target.value)}>
              <option value="">-- Select Anime --</option>
              {availableAnimes.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Episode Number</label>
              <input required type="number" className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={epNumber} onChange={e => setEpNumber(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Episode Title</label>
              <input type="text" className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={epTitle} onChange={e => setEpTitle(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Video URL (MP4 / HLS)</label>
            <input required type="url" className="w-full bg-secondary border border-border rounded px-3 py-2 text-white" value={epVideo} onChange={e => setEpVideo(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" id="premium" className="h-4 w-4 bg-secondary border-border rounded" checked={epPremium} onChange={e => setEpPremium(e.target.checked)} />
            <label htmlFor="premium" className="text-sm cursor-pointer">Is Premium Only?</label>
          </div>
          <button disabled={isSubmitting} className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-primary/90 disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Create Episode"}
          </button>
        </form>
      )}

      {activeTab === "import" && (
        <div className="space-y-6">
          <form onSubmit={searchJikan} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search MyAnimeList (e.g. Naruto, Bleach)..." 
                className="w-full bg-secondary border border-border text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit" 
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-bold transition disabled:opacity-50 flex items-center"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </button>
          </form>

          <div className="space-y-4">
            {searchResults.map(anime => (
              <div key={anime.mal_id} className="flex gap-4 p-4 bg-secondary/30 border border-white/5 rounded-xl hover:border-blue-500/30 transition">
                <img 
                  src={anime.images?.jpg?.image_url} 
                  alt={anime.title} 
                  className="w-16 h-24 object-cover rounded shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-lg text-white truncate">{anime.title_english || anime.title}</h4>
                  <div className="flex flex-wrap gap-1 mt-1 mb-2">
                    {anime.genres?.map((g: any) => (
                      <span key={g.mal_id} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">
                        {g.name}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {anime.synopsis}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => importAnime(anime)}
                    disabled={isSubmitting}
                    className="bg-primary/20 text-primary border border-primary/50 hover:bg-primary hover:text-white px-4 py-2 rounded font-bold text-sm transition whitespace-nowrap"
                  >
                    Import
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
