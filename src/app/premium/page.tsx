"use client";

import { Check, Star, Loader2, Crown, Mic2, X } from "lucide-react";
import { useState } from "react";
import { upgradeToPremium } from "./actions";
import { useRouter } from "next/navigation";

export default function PremiumPage() {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showModal, setShowModal] = useState<string | null>(null);
  const router = useRouter();

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    const result = await upgradeToPremium();
    
    if (result.success) {
      alert("Success! You are now upgraded. Enjoy AniZone!");
      router.push("/profile");
    } else {
      alert(result.error || "Something went wrong.");
      setIsUpgrading(false);
      setShowModal(null);
    }
  };

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Choose Your Anime Journey</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Experience anime the way it was meant to be seen. Go Premium to unlock ad-free streaming, exclusive fandub audio tracks, and simulcast episodes.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
        {/* Free Tier */}
        <div className="bg-secondary/30 border border-white/10 rounded-2xl p-8 flex flex-col relative overflow-hidden backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-2 text-white">Free Plan</h2>
          <p className="text-gray-400 mb-6">For casual viewers</p>
          <div className="text-4xl font-extrabold mb-8 text-white">$0<span className="text-xl text-gray-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 text-gray-300">
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-gray-500 mr-3 shrink-0" /> Watch all free episodes</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-gray-500 mr-3 shrink-0" /> 720p Video Quality</li>
            <li className="flex items-center text-sm text-gray-500"><X className="h-5 w-5 mr-3 shrink-0" /> Includes Ads</li>
            <li className="flex items-center text-sm text-gray-500"><X className="h-5 w-5 mr-3 shrink-0" /> Delayed simulcasts</li>
          </ul>
          
          <button className="w-full py-3 rounded-md bg-white/5 border border-white/10 text-gray-400 font-semibold hover:bg-white/10 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="bg-black border border-primary/50 shadow-[0_0_40px_rgba(229,9,20,0.2)] rounded-2xl p-8 flex flex-col relative overflow-hidden backdrop-blur-md transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg tracking-wider">
            RECOMMENDED
          </div>
          <div className="flex items-center mb-2">
            <Crown className="h-6 w-6 text-primary mr-2 fill-primary" />
            <h2 className="text-2xl font-bold text-white">Otaku Pro</h2>
          </div>
          <p className="text-gray-400 mb-6">The ultimate fan experience</p>
          <div className="text-4xl font-extrabold text-white mb-8">$7.99<span className="text-xl text-gray-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 text-gray-200">
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> Zero Ads. No interruptions</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> 4K Ultra HD Video Quality</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> Unlock ALL Fandub Audio Tracks</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> Watch Party Host Access</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-primary mr-3 shrink-0" /> Custom Profile Badge</li>
          </ul>
          
          <button 
            onClick={() => setShowModal("Otaku Pro")}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/50"
          >
            Upgrade to Pro
          </button>
        </div>

        {/* Creator Tier */}
        <div className="bg-gradient-to-b from-purple-900/20 to-black border border-purple-500/30 rounded-2xl p-8 flex flex-col relative overflow-hidden backdrop-blur-sm">
          <div className="flex items-center mb-2">
            <Mic2 className="h-6 w-6 text-purple-400 mr-2" />
            <h2 className="text-2xl font-bold text-white">Studio Creator</h2>
          </div>
          <p className="text-gray-400 mb-6">For fandubbers & creators</p>
          <div className="text-4xl font-extrabold text-white mb-8">$14.99<span className="text-xl text-gray-500 font-normal">/mo</span></div>
          
          <ul className="space-y-4 mb-8 flex-1 text-gray-200">
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-purple-400 mr-3 shrink-0" /> All Otaku Pro features</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-purple-400 mr-3 shrink-0" /> AI Auto-Dubbing Access</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-purple-400 mr-3 shrink-0" /> Monetize Fandubs (Donate Button)</li>
            <li className="flex items-center text-sm"><Check className="h-5 w-5 text-purple-400 mr-3 shrink-0" /> Verified Studio Badge</li>
          </ul>
          
          <button 
            onClick={() => setShowModal("Studio Creator")}
            className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-500/30"
          >
            Become a Creator
          </button>
        </div>
      </div>

      {/* Demo Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-secondary border border-white/10 p-8 rounded-2xl w-full max-w-md relative shadow-2xl">
            <button onClick={() => setShowModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-2xl font-bold text-white mb-2">Upgrade to {showModal}</h3>
            <p className="text-gray-400 text-sm mb-6">This is a demo checkout flow.</p>
            
            <div className="space-y-4 mb-8">
              <input type="text" placeholder="Card Number" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white" defaultValue="4111 1111 1111 1111" />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-white" defaultValue="12/25" />
                <input type="text" placeholder="CVC" className="w-1/2 bg-black/50 border border-white/10 rounded-lg p-3 text-white" defaultValue="123" />
              </div>
            </div>

            <button 
              onClick={handleUpgrade}
              disabled={isUpgrading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg flex justify-center items-center"
            >
              {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Star className="w-5 h-5 mr-2" />}
              {isUpgrading ? "Processing..." : `Pay $${showModal === "Otaku Pro" ? "7.99" : "14.99"} & Subscribe`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
