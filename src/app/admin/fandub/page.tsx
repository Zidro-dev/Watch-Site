"use client";

import { useEffect, useState } from "react";
import { Check, X, Trash2, Play } from "lucide-react";
import { moderateFandubTrack } from "../actions";

// In a real app, this would be passed as initialData from a Server Component, 
// or fetched via SWR/React Query. For simplicity in this demo, we'll imagine it's passed or fetched.
// To keep it standard Next.js App Router, we should ideally make this a Server Component 
// that renders Client Component rows. Let's do that approach in a single file by splitting.

import FandubTableServer from "./FandubTableServer";

export default function FandubModerationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fandub Moderation</h1>
        <p className="text-sm text-muted-foreground">Review and approve audio tracks submitted by creators.</p>
      </div>
      <FandubTableServer />
    </div>
  );
}
