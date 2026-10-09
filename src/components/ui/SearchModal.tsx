"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SearchModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? onClose() : document.dispatchEvent(new CustomEvent('open-search'));
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // Quick fetch to catalog with specific query
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-secondary/80 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center px-4 py-4 border-b border-white/10">
          <Search className="w-6 h-6 text-muted-foreground mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search anime... (e.g. Naruto, Attack on Titan)"
            className="flex-1 bg-transparent border-none text-white focus:outline-none text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : query && results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  onClick={(e) => {
                    if (anime.source === "global") {
                      e.preventDefault();
                      alert("This anime is from MAL and hasn't been imported yet. Admins can import it via Dashboard.");
                    } else {
                      onClose();
                    }
                  }}
                  className="flex items-center p-3 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="relative w-16 h-20 rounded-md overflow-hidden bg-black/50 mr-4 flex-shrink-0">
                    {anime.coverImage ? (
                      <img 
                        src={anime.coverImage}
                        alt={anime.title}
                        className="w-full h-full object-cover absolute inset-0"
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <Play className="w-6 h-6 m-auto text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold truncate group-hover:text-primary transition-colors flex items-center">
                      {anime.title}
                      {anime.source === "global" && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-blue-600/20 text-blue-400 border border-blue-600/30 uppercase tracking-wider">
                          MAL
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center space-x-2">
                      <span>{anime.releaseYear || "N/A"}</span>
                      <span>•</span>
                      <span className={anime.status === "ONGOING" ? "text-green-400" : "text-gray-400"}>{anime.status}</span>
                    </p>
                    {anime.tags && anime.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5 overflow-hidden">
                        {anime.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400 truncate">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Type at least 1 character to start searching
            </div>
          )}
        </div>
        
        <div className="bg-black/50 px-4 py-3 border-t border-white/5 text-xs text-muted-foreground flex justify-between items-center">
          <span>Search powered by AniZone & Jikan API</span>
          <span className="flex items-center space-x-1">
            <kbd className="bg-white/10 px-2 py-1 rounded text-[10px] font-mono">ESC</kbd> <span>to close</span>
          </span>
        </div>

      </div>
    </div>
  );
}
