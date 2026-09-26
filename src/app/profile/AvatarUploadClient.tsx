"use client";

import { useState, useRef } from "react";
import { User as UserIcon, Camera, Loader2 } from "lucide-react";
import { uploadAvatar } from "./actions";

export default function AvatarUploadClient({ avatarUrl }: { avatarUrl?: string | null }) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatarFile", file);

    await uploadAvatar(formData);
    setIsUploading(false);
  };

  return (
    <div className="relative h-24 w-24 rounded-full bg-secondary flex items-center justify-center border-4 border-background shadow-md shrink-0 group overflow-hidden">
      {avatarUrl ? (
        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <UserIcon className="h-10 w-10 text-muted-foreground" />
      )}
      
      {/* Hover Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 text-white animate-spin" />
        ) : (
          <Camera className="w-6 h-6 text-white" />
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/png, image/jpeg, image/webp" 
        className="hidden" 
      />
    </div>
  );
}
