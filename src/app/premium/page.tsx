"use client";

import { Check, Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { upgradeToPremium } from "./actions";
import { useRouter } from "next/navigation";

export default function PremiumPage() {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const router = useRouter();

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    const result = await upgradeToPremium();
    
    if (result.success) {
      alert("Success! You are now a Premium member. Enjoy unlimited anime!");
      router.push("/profile");
    } else {
      alert(result.error || "Something went wrong.");
      setIsUpgrading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Choose Your Anime Journey</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Experience anime the way it was meant to be seen. Go Premium to unlock ad-free streaming, exclusive fandub audio tracks, and simulcast episodes.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-4">
        {/* Free Tier */}
        <div className="bg-secondary/30 border border-border rounded-2xl p-8 flex flex-col relative overflow-hidden backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
          <p className="text-muted-foreground mb-6">For casual viewers</p>
          <div className="text-4xl font-extrabold mb-8">$0<span className="text-xl text-muted-foreground font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-green-500 mr-3 shrink-0" /> Watch all free episodes</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-green-500 mr-3 shrink-0" /> 720p Video Quality</li>
            <li className="flex items-center text-sm text-muted-foreground"><Check className="h-5 w-5 text-muted-foreground mr-3 shrink-0" /> Includes Ads</li>
            <li className="flex items-center text-sm text-muted-foreground"><Check className="h-5 w-5 text-muted-foreground mr-3 shrink-0" /> Delayed simulcast releases</li>
          </ul>
          
          <button className="w-full py-3 rounded-md bg-secondary text-foreground font-semibold hover:bg-secondary/80 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="bg-black/60 border border-primary/50 shadow-[0_0_40px_rgba(229,9,20,0.15)] rounded-2xl p-8 flex flex-col relative overflow-hidden backdrop-blur-md transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="flex items-center mb-2">
            <Star className="h-6 w-6 text-primary mr-2 fill-primary" />
            <h2 className="text-2xl font-bold text-white">Premium</h2>
          </div>
          <p className="text-gray-400 mb-6">The ultimate fan experience</p>
          <div className="text-4xl font-extrabold text-white mb-8">$7.99<span className="text-xl text-gray-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 text-gray-200">
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> Zero Ads. No interruptions.</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> 1080p & 4K Video Quality</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> Unlock ALL Fandub Audio Tracks</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> Watch new episodes 1 hr after Japan</li>
          </ul>
          
          <button 
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full py-4 rounded-md bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50 flex justify-center items-center"
          >
            {isUpgrading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
            {isUpgrading ? "Upgrading..." : "Upgrade to Premium"}
          </button>
        </div>
      </div>
    </div>
  );
}
