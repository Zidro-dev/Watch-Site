"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, SkipForward, FastForward, Keyboard } from "lucide-react";
import Link from "next/link";

type AudioTrack = {
  id: string;
  language: string;
  url: string;
  source: string;
};

type SubtitleTrack = {
  id: string;
  language: string;
  url: string;
};

type PlayerProps = {
  videoUrl: string;
  audioTracks?: AudioTrack[];
  subtitleTracks?: SubtitleTrack[];
  initialTime?: number;
  onProgressSave?: (time: number) => void;
  nextEpisodeUrl?: string;
  flyingEmojis?: { id: number; emoji: string; x: number }[];
};

export default function Player({ 
  videoUrl, 
  audioTracks = [], 
  subtitleTracks = [], 
  initialTime = 0,
  onProgressSave,
  nextEpisodeUrl,
  flyingEmojis = []
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [selectedAudioId, setSelectedAudioId] = useState("base");
  const [selectedSubId, setSelectedSubId] = useState(subtitleTracks.length > 0 ? subtitleTracks[0].id : "none");
  
  const [quality, setQuality] = useState("Auto");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showShortcutsMenu, setShowShortcutsMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sync initial time
  useEffect(() => {
    if (videoRef.current && initialTime > 0) {
      videoRef.current.currentTime = initialTime;
    }
  }, [initialTime]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        if (audioRef.current && selectedAudioId !== "base") audioRef.current.pause();
      } else {
        videoRef.current.play();
        if (audioRef.current && selectedAudioId !== "base") audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      if (audioRef.current) audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById("player-container");
    if (container) {
      if (!document.fullscreenElement) container.requestFullscreen();
      else document.exitFullscreen();
    }
  };

  const skipTime = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
      if (audioRef.current) audioRef.current.currentTime += amount;
    }
  };

  // Keyboard Shortcuts Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted]);

  // Audio track syncing logic
  useEffect(() => {
    if (selectedAudioId === "base") {
      if (videoRef.current) videoRef.current.muted = isMuted;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    } else {
      const track = audioTracks.find(t => t.id === selectedAudioId);
      if (track && videoRef.current && audioRef.current) {
        videoRef.current.muted = true;
        audioRef.current.src = track.url;
        audioRef.current.currentTime = videoRef.current.currentTime;
        audioRef.current.muted = isMuted;
        if (isPlaying) audioRef.current.play();
      }
    }
  }, [selectedAudioId, audioTracks, isPlaying, isMuted]);

  // Constantly sync custom audio if it drifts
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const percent = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percent);

      if (audioRef.current && selectedAudioId !== "base") {
        if (Math.abs(audioRef.current.currentTime - videoRef.current.currentTime) > 0.3) {
          audioRef.current.currentTime = videoRef.current.currentTime;
        }
      }

      // Save progress periodically (e.g. every 10s)
      if (onProgressSave && Math.floor(videoRef.current.currentTime) % 10 === 0) {
        onProgressSave(videoRef.current.currentTime);
      }
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) videoRef.current.playbackRate = speed;
    if (audioRef.current) audioRef.current.playbackRate = speed;
  };

  const skipIntro = () => skipTime(85);

  const showSkipIntro = videoRef.current && videoRef.current.currentTime > 10 && videoRef.current.currentTime < 180;

  return (
    <div 
      id="player-container"
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        setShowControls(false);
        setShowSettingsMenu(false);
        setShowShortcutsMenu(false);
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

      {/* Flying Emojis overlay for Watch Party */}
      {flyingEmojis.map((emojiObj) => (
        <div
          key={emojiObj.id}
          className="absolute bottom-16 text-3xl pointer-events-none animate-bounce z-30"
          style={{ left: `${emojiObj.x}%` }}
        >
          {emojiObj.emoji}
        </div>
      ))}

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
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"} z-40`}
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

            <button onClick={toggleMute} className="text-white hover:text-primary transition hidden sm:block">
              {isMuted ? <VolumeX className="w-6 h-6 text-red-500" /> : <Volume2 className="w-6 h-6" />}
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

            {/* Shortcuts Help */}
            <div className="relative hidden md:block">
              <button 
                onClick={() => setShowShortcutsMenu(!showShortcutsMenu)}
                className={`text-white hover:text-primary transition p-1 ${showShortcutsMenu ? 'text-primary' : ''}`}
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              {showShortcutsMenu && (
                <div className="absolute bottom-full right-1/2 translate-x-1/2 mb-4 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl w-48 p-4 z-50 text-xs">
                  <p className="font-bold text-gray-300 mb-3 border-b border-white/10 pb-2">Keyboard Shortcuts</p>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex justify-between"><span>Space / K</span> <span className="font-mono bg-white/10 px-1 rounded text-white">Play/Pause</span></li>
                    <li className="flex justify-between"><span>F</span> <span className="font-mono bg-white/10 px-1 rounded text-white">Fullscreen</span></li>
                    <li className="flex justify-between"><span>M</span> <span className="font-mono bg-white/10 px-1 rounded text-white">Mute</span></li>
                    <li className="flex justify-between"><span>← / →</span> <span className="font-mono bg-white/10 px-1 rounded text-white">-10s / +10s</span></li>
                  </ul>
                </div>
              )}
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

            <button onClick={toggleFullscreen} className="text-white hover:text-primary transition">
              <Maximize className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
