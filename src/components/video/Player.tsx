"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Settings, Maximize, FastForward, SkipForward } from "lucide-react";
import Link from "next/link";

interface Track {
  id: string;
  language: string;
  url: string;
  source?: string;
}

interface PlayerProps {
  videoUrl: string;
  audioTracks: Track[];
  subtitleTracks: Track[];
  initialTime?: number;
  onProgressSave?: (time: number) => void;
  nextEpisodeUrl?: string;
}

export default function Player({ videoUrl, audioTracks, subtitleTracks, initialTime = 0, onProgressSave, nextEpisodeUrl }: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  
  // Track Selection State
  const [selectedAudioId, setSelectedAudioId] = useState<string>("base");
  const [selectedSubId, setSelectedSubId] = useState<string>("none");
  const [quality, setQuality] = useState<string>("1080p");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Syncing external audio track with video
  useEffect(() => {
    if (!videoRef.current || !audioRef.current) return;
    const video = videoRef.current;
    const audio = audioRef.current;

    const syncAudio = () => {
      if (Math.abs(audio.currentTime - video.currentTime) > 0.2) {
        audio.currentTime = video.currentTime;
      }
    };

    const handlePlay = () => {
      if (selectedAudioId !== "base") {
        audio.play().catch(console.error);
        video.muted = true;
      } else {
        video.muted = false;
        audio.pause();
      }
    };

    const handlePause = () => audio.pause();
    const handleSeek = () => { audio.currentTime = video.currentTime; };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("seeking", handleSeek);
    video.addEventListener("timeupdate", syncAudio);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("seeking", handleSeek);
      video.removeEventListener("timeupdate", syncAudio);
    };
  }, [selectedAudioId]);

  // Set initial time on mount
  useEffect(() => {
    if (videoRef.current) {
      // Check local storage as a fallback for guests
      let startAt = initialTime;
      if (initialTime === 0) {
        const localProg = localStorage.getItem(`progress_${videoUrl}`);
        if (localProg) startAt = parseFloat(localProg);
      }

      const handleLoadedMetadata = () => {
        if (videoRef.current && startAt > 0) {
          videoRef.current.currentTime = startAt;
        }
      };
      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        if (videoRef.current) videoRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [initialTime, videoUrl]);

  // Handle saving progress and Skip Intro button
  const lastSavedTime = useRef<number>(0);
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      setProgress((current / videoRef.current.duration) * 100);
      
      // Show skip intro button between 10s and 95s
      setShowSkipIntro(current > 10 && current < 95);

      if (current - lastSavedTime.current > 5) {
        lastSavedTime.current = current;
        // Save to local storage
        localStorage.setItem(`progress_${videoUrl}`, current.toString());
        // Save to API
        if (onProgressSave) onProgressSave(current);
      }
    }
  };

  useEffect(() => {
    if (selectedAudioId !== "base" && audioRef.current && videoRef.current) {
      const selectedTrack = audioTracks.find(t => t.id === selectedAudioId);
      if (selectedTrack) {
        audioRef.current.src = selectedTrack.url;
        audioRef.current.currentTime = videoRef.current.currentTime;
        audioRef.current.playbackRate = playbackSpeed;
        if (!videoRef.current.paused) {
          audioRef.current.play().catch(console.error);
        }
      }
    } else if (videoRef.current) {
      videoRef.current.muted = false;
      if (audioRef.current) audioRef.current.pause();
    }
  }, [selectedAudioId, audioTracks, playbackSpeed]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  const skipIntro = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 85;
      setShowSkipIntro(false);
    }
  };

  return (
    <div 
      className="relative group w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center font-sans"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowSettingsMenu(false);
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        playsInline
      >
        {subtitleTracks.map((sub) => (
          <track
            key={sub.id}
            kind="subtitles"
            srcLang={sub.language}
            label={sub.language}
            src={sub.url}
            default={selectedSubId === sub.id}
          />
        ))}
      </video>

      <audio ref={audioRef} />

      {/* Skip Intro Button */}
      {showSkipIntro && (
        <button 
          onClick={skipIntro}
          className="absolute bottom-24 right-8 bg-white/20 hover:bg-white/40 backdrop-blur-md border border-white/20 text-white font-bold py-2 px-6 rounded-md shadow-lg transition-all flex items-center z-40"
        >
          <FastForward className="w-5 h-5 mr-2" />
          Skip Intro (85s)
        </button>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        <div className="w-full h-1 bg-white/30 mb-4 cursor-pointer relative rounded">
          <div 
            className="absolute top-0 left-0 h-full bg-primary rounded transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 md:space-x-6">
            <button onClick={togglePlay} className="text-white hover:text-primary transition">
              {isPlaying ? <Pause className="w-6 h-6 md:w-8 md:h-8" /> : <Play className="w-6 h-6 md:w-8 md:h-8" />}
            </button>
            
            {nextEpisodeUrl && (
              <Link href={nextEpisodeUrl} className="text-white hover:text-primary transition" title="Next Episode">
                <SkipForward className="w-6 h-6" />
              </Link>
            )}

            <button className="text-white hover:text-primary transition hidden sm:block">
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center space-x-4 md:space-x-6 relative">
            
            {/* Speed Selector */}
            <div className="relative group/speed hidden sm:block">
              <button className="text-white text-sm font-semibold hover:text-primary transition">
                {playbackSpeed}x
              </button>
              <div className="absolute bottom-full right-0 mb-4 hidden group-hover/speed:block bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl min-w-[100px] overflow-hidden">
                {[1, 1.25, 1.5, 2].map(speed => (
                  <button 
                    key={speed}
                    onClick={() => changeSpeed(speed)}
                    className={`block w-full text-left px-4 py-3 text-sm transition-colors ${playbackSpeed === speed ? "text-primary bg-white/10 font-bold" : "text-white"} hover:bg-white/20`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Main Settings Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="text-white hover:text-primary transition p-1"
              >
                <Settings className={`w-5 h-5 md:w-6 md:h-6 transition-transform ${showSettingsMenu ? 'rotate-90 text-primary' : ''}`} />
              </button>
              
              {showSettingsMenu && (
                <div className="absolute bottom-full right-0 mb-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-64 max-h-[300px] overflow-y-auto flex flex-col z-50 divide-y divide-white/5">
                  
                  {/* Quality Selection */}
                  <div className="p-3">
                    <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Quality</p>
                    <div className="flex flex-wrap gap-2">
                      {["Auto", "1080p", "720p", "480p"].map(q => (
                        <button 
                          key={q}
                          onClick={() => { setQuality(q); setShowSettingsMenu(false); }}
                          className={`px-3 py-1 text-xs rounded-full border transition-colors ${quality === q ? "bg-primary border-primary text-white" : "border-white/20 text-gray-300 hover:border-white/50"}`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Selection */}
                  <div className="p-3">
                    <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Audio Track</p>
                    <button 
                      onClick={() => setSelectedAudioId("base")}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedAudioId === "base" ? "bg-primary/20 text-primary font-medium" : "text-gray-200 hover:bg-white/10"}`}
                    >
                      Original (Japanese)
                    </button>
                    {audioTracks.map(track => (
                      <button 
                        key={track.id}
                        onClick={() => setSelectedAudioId(track.id)}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm mt-1 transition-colors ${selectedAudioId === track.id ? "bg-primary/20 text-primary font-medium" : "text-gray-200 hover:bg-white/10"}`}
                      >
                        {track.language} {track.source === "FANDUB" && <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">Fandub</span>}
                      </button>
                    ))}
                  </div>

                  {/* Subtitle Selection */}
                  {subtitleTracks.length > 0 && (
                    <div className="p-3">
                      <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Subtitles</p>
                      <button 
                        onClick={() => setSelectedSubId("none")}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedSubId === "none" ? "bg-primary/20 text-primary font-medium" : "text-gray-200 hover:bg-white/10"}`}
                      >
                        None
                      </button>
                      {subtitleTracks.map(track => (
                        <button 
                          key={track.id}
                          onClick={() => setSelectedSubId(track.id)}
                          className={`block w-full text-left px-3 py-2 rounded-md text-sm mt-1 transition-colors ${selectedSubId === track.id ? "bg-primary/20 text-primary font-medium" : "text-gray-200 hover:bg-white/10"}`}
                        >
                          {track.language}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>

            <button className="text-white hover:text-primary transition">
              <Maximize className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
