"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { createAudioTrackRecord } from "./actions";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";

export default function CreatorDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [animeId, setAnimeId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [language, setLanguage] = useState("UZ");
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createClient();

  // Simulated data for dropdowns (in reality, fetched from Prisma)
  const availableAnimes = [
    { id: "aot-final-season", title: "Attack on Titan: The Final Season" },
    { id: "jujutsu-kaisen", title: "Jujutsu Kaisen" }
  ];
  const availableEpisodes = [
    { id: "ep-1", title: "Episode 1" },
    { id: "ep-2", title: "Episode 2" }
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !animeId || !episodeId || !language) {
      setErrorMessage("Please fill all fields and select a file.");
      setUploadStatus("error");
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `fandubs/${animeId}/${episodeId}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("audio_tracks")
        .upload(filePath, file);

      if (uploadError) throw new Error(`Storage error: ${uploadError.message}`);

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("audio_tracks")
        .getPublicUrl(filePath);

      const audioUrl = publicUrlData.publicUrl;

      // 3. Save Record in Prisma via Server Action
      const dbResult = await createAudioTrackRecord({
        episodeId,
        language,
        url: audioUrl,
      });

      if (!dbResult.success) {
        throw new Error(dbResult.error || "Failed to save record in database");
      }

      setUploadStatus("success");
      setFile(null); // Reset form
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Upload New Audio Track</h2>
          
          {uploadStatus === "success" && (
            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-md flex items-center">
              <CheckCircle className="mr-2 h-5 w-5" />
              Track uploaded and linked successfully!
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-md">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Anime</label>
                <select 
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={animeId}
                  onChange={(e) => setAnimeId(e.target.value)}
                >
                  <option value="">Select Anime...</option>
                  {availableAnimes.map(a => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Episode</label>
                <select 
                  className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  value={episodeId}
                  onChange={(e) => setEpisodeId(e.target.value)}
                  disabled={!animeId}
                >
                  <option value="">Select Episode...</option>
                  {availableEpisodes.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select 
                className="w-full bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="UZ">Uzbek (UZ)</option>
                <option value="RU">Russian (RU)</option>
                <option value="EN">English (EN)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Audio File (.mp3, .m4a)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-lg cursor-pointer bg-secondary/50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-white">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">MP3 or M4A (MAX. 50MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="audio/mpeg, audio/mp4" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              {file && <p className="mt-2 text-sm text-primary font-medium">Selected: {file.name}</p>}
            </div>

            <button
              type="submit"
              disabled={isUploading || !file}
              className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary/90 transition flex justify-center items-center disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Uploading & Processing...
                </>
              ) : (
                "Upload Audio Track"
              )}
            </button>
          </form>
        </div>
      </div>
      
      <div className="hidden md:block">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold mb-4">Guidelines</h3>
          <ul className="text-sm text-muted-foreground space-y-3 list-disc pl-4">
            <li>Ensure the audio is properly synced to the raw Japanese video timeline.</li>
            <li>Use high-quality MP3 (320kbps) or AAC formats.</li>
            <li>No watermarks or intrusive ads in the audio.</li>
            <li>Uploading unauthorized content may result in account termination.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
