"use client";

import { useState } from "react";
import { Check, X, Trash2, Loader2 } from "lucide-react";
import { moderateFandubTrack } from "../actions";

interface TrackProps {
  track: {
    id: string;
    animeTitle: string;
    episodeNumber: number;
    language: string;
    creatorEmail: string;
    url: string;
  }
}

export default function FandubRowClient({ track }: TrackProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action: "APPROVE" | "REJECT" | "DELETE") => {
    setIsProcessing(true);
    const result = await moderateFandubTrack(track.id, action);
    if (!result.success) {
      alert("Action failed: " + result.error);
      setIsProcessing(false);
    }
    // If successful, the server action revalidates the path, which will automatically remove the row from the UI.
  };

  return (
    <tr className="hover:bg-secondary/20 transition">
      <td className="px-6 py-4">
        <p className="font-semibold">{track.animeTitle}</p>
        <p className="text-xs text-muted-foreground">Episode {track.episodeNumber}</p>
      </td>
      <td className="px-6 py-4">
        <span className="bg-secondary px-2 py-1 rounded text-xs font-bold">{track.language}</span>
      </td>
      <td className="px-6 py-4 text-muted-foreground">{track.creatorEmail}</td>
      <td className="px-6 py-4">
        <audio controls src={track.url} className="h-8 w-48" preload="none" />
      </td>
      <td className="px-6 py-4 text-right">
        {isProcessing ? (
          <Loader2 className="h-5 w-5 animate-spin inline-block text-muted-foreground" />
        ) : (
          <div className="flex justify-end space-x-2">
            <button 
              onClick={() => handleAction("APPROVE")}
              className="p-2 bg-green-500/10 text-green-500 rounded hover:bg-green-500/20 transition"
              title="Approve"
            >
              <Check className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handleAction("REJECT")}
              className="p-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500/20 transition"
              title="Reject & Delete"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
