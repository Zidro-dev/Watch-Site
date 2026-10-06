"use client";

import { useState, useEffect } from "react";
import { toggleWatchlist, submitReview } from "./actions";
import { Bookmark, BookmarkCheck, Star, Loader2, Send, Eye, Check, Heart, ListPlus, Flame } from "lucide-react";
import { useGamification } from "@/components/layout/GamificationProvider";

export function WatchlistButton({ userId, animeId, initialIsWatchlisted }: { userId: string | null, animeId: string, initialIsWatchlisted: boolean }) {
  const [isWatchlisted, setIsWatchlisted] = useState(initialIsWatchlisted);
  const [status, setStatus] = useState<"PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "FAVORITE" | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { addXp } = useGamification();

  useEffect(() => {
    // Load local status for guests
    if (!userId) {
      const localWatchlist = JSON.parse(localStorage.getItem("anizone_watchlist") || "{}");
      if (localWatchlist[animeId]) {
        setIsWatchlisted(true);
        setStatus(localWatchlist[animeId]);
      }
    }
  }, [userId, animeId]);

  const handleToggle = async (newStatus: "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "FAVORITE") => {
    const wasWatchlisted = isWatchlisted;
    setIsPending(true);
    setStatus(newStatus);
    setIsWatchlisted(true);
    setShowDropdown(false);

    if (!wasWatchlisted) {
      addXp(30, "Added to Watchlist");
    }

    if (userId) {
      // Real API call (we will reuse toggleWatchlist or an updated version)
      const result = await toggleWatchlist(userId, animeId);
      if (result.success) setIsWatchlisted(result.isWatchlisted!);
    } else {
      // LocalStorage for guests
      const localWatchlist = JSON.parse(localStorage.getItem("anizone_watchlist") || "{}");
      localWatchlist[animeId] = newStatus;
      localStorage.setItem("anizone_watchlist", JSON.stringify(localWatchlist));
    }
    setIsPending(false);
  };

  const statusIcons = {
    PLAN_TO_WATCH: <ListPlus className="h-4 w-4" />,
    WATCHING: <Eye className="h-4 w-4" />,
    COMPLETED: <Check className="h-4 w-4" />,
    FAVORITE: <Heart className="h-4 w-4" />
  };

  const statusLabels = {
    PLAN_TO_WATCH: "Plan to Watch",
    WATCHING: "Watching",
    COMPLETED: "Completed",
    FAVORITE: "Favorite"
  };

  return (
    <div className="relative mt-4 sm:mt-0 sm:ml-4">
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isPending}
        className={`flex items-center justify-center font-bold py-3 px-6 rounded-full transition-all border w-full sm:w-auto ${
          isWatchlisted 
            ? "bg-secondary text-primary border-primary/50 hover:bg-secondary/80" 
            : "bg-transparent text-white border-white/20 hover:border-white/50 hover:bg-white/5"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
        ) : isWatchlisted ? (
          status ? statusIcons[status] : <BookmarkCheck className="h-5 w-5" />
        ) : (
          <Bookmark className="h-5 w-5" />
        )}
        <span className="ml-2">{isWatchlisted && status ? statusLabels[status] : "Add to List"}</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
          {(["PLAN_TO_WATCH", "WATCHING", "COMPLETED", "FAVORITE"] as const).map(s => (
            <button
              key={s}
              onClick={() => handleToggle(s)}
              className={`w-full text-left px-4 py-3 text-sm flex items-center space-x-3 hover:bg-white/10 transition ${status === s ? "text-primary" : "text-gray-300"}`}
            >
              {statusIcons[s]}
              <span>{statusLabels[s]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ReviewsSection({ userId, animeId, existingReviews }: { userId: string | null, animeId: string, existingReviews: any[] }) {
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addXp } = useGamification();
  
  // Local state for optimistic UI or guest reviews
  const [localReviews, setLocalReviews] = useState<any[]>(existingReviews);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newReview = {
      id: `local-${Date.now()}`,
      userId: userId || "guest",
      animeId,
      rating,
      comment: isSpoiler ? `[SPOILER] ${comment}` : comment,
      createdAt: new Date().toISOString(),
      user: { fullName: userId ? "You" : "Guest Viewer" }
    };

    if (userId) {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("animeId", animeId);
      formData.append("rating", rating.toString());
      formData.append("comment", newReview.comment);
      
      const result = await submitReview(formData);
      if (result.success) {
        setLocalReviews([newReview, ...localReviews]);
        addXp(100, "Wrote a review");
      }
    } else {
      // LocalStorage for guests
      const guestReviews = JSON.parse(localStorage.getItem(`anizone_reviews_${animeId}`) || "[]");
      guestReviews.unshift(newReview);
      localStorage.setItem(`anizone_reviews_${animeId}`, JSON.stringify(guestReviews));
      setLocalReviews([newReview, ...localReviews]);
      addXp(100, "Wrote a review");
    }

    setComment("");
    setIsSpoiler(false);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (!userId) {
      const guestReviews = JSON.parse(localStorage.getItem(`anizone_reviews_${animeId}`) || "[]");
      setLocalReviews([...guestReviews, ...existingReviews]);
    }
  }, [userId, animeId, existingReviews]);

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <span className="bg-primary w-1.5 h-6 rounded-full mr-3 inline-block"></span>
        Community Reviews & Ratings
      </h3>

      <form onSubmit={handleSubmit} className="mb-10 bg-secondary/30 p-6 rounded-xl border border-white/10">
        <h4 className="font-semibold mb-4 text-white">Rate & Review (Out of 10)</h4>
        <div className="flex flex-wrap items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
            <button 
              key={star} 
              type="button" 
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-125 p-1"
            >
              <Star className={`h-5 w-5 ${star <= rating ? "fill-primary text-primary" : "text-gray-600"}`} />
            </button>
          ))}
          <span className="ml-4 font-bold text-primary">{rating} / 10</span>
        </div>
        
        <textarea
          required
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Share your thoughts about this anime..."
          className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-sm text-white focus:outline-none focus:border-primary mb-4 min-h-[100px] resize-y shadow-inner"
        />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center space-x-2 cursor-pointer text-sm text-gray-400 hover:text-white transition">
            <input 
              type="checkbox" 
              checked={isSpoiler} 
              onChange={e => setIsSpoiler(e.target.checked)}
              className="rounded border-gray-600 text-primary focus:ring-primary accent-primary w-4 h-4"
            />
            <span>Contains Spoilers</span>
          </label>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !comment.trim()}
            className="w-full sm:w-auto flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-bold py-2.5 px-8 rounded-full transition-colors disabled:opacity-50 shadow-lg hover:shadow-primary/40"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {isSubmitting ? "Submitting..." : "Post Review"}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {localReviews.length === 0 ? (
          <p className="text-gray-500 italic p-8 text-center bg-secondary/10 rounded-xl border border-dashed border-white/10">
            No reviews yet. Be the first to share your thoughts!
          </p>
        ) : (
          localReviews.map(review => {
            const hasSpoiler = review.comment?.startsWith("[SPOILER]");
            const displayComment = hasSpoiler ? review.comment.replace("[SPOILER]", "").trim() : review.comment;
            
            return (
              <ReviewCard key={review.id} review={review} hasSpoiler={hasSpoiler} displayComment={displayComment} />
            );
          })
        )}
      </div>
    </div>
  );
}

function ReviewCard({ review, hasSpoiler, displayComment }: { review: any, hasSpoiler: boolean, displayComment: string }) {
  const [revealed, setRevealed] = useState(!hasSpoiler);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-secondary/20 p-5 rounded-xl border border-border hover:border-white/10 transition-colors group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm uppercase shadow-inner border border-white/20">
            {review.user?.fullName?.charAt(0) || review.user?.email?.charAt(0) || "U"}
          </div>
          <div>
            <span className="font-semibold text-sm text-gray-200">{review.user?.fullName || review.user?.username || "Anime Fan"}</span>
            <div className="flex items-center mt-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
              <span className="text-xs font-bold text-primary">{review.rating} / 10</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
      </div>
      
      {hasSpoiler && !revealed ? (
        <button 
          onClick={() => setRevealed(true)}
          className="w-full mt-2 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition-colors"
        >
          Warning: Contains Spoilers. Click to reveal.
        </button>
      ) : (
        <p className="text-sm text-gray-300 mt-3 leading-relaxed whitespace-pre-wrap">{displayComment}</p>
      )}

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-end">
        <button 
          onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1); }}
          className={`flex items-center text-xs font-medium transition-colors ${liked ? "text-primary" : "text-gray-500 hover:text-white"}`}
        >
          <Heart className={`h-4 w-4 mr-1.5 ${liked ? "fill-primary" : ""}`} />
          {likes > 0 ? likes : "Like"}
        </button>
      </div>
    </div>
  );
}
