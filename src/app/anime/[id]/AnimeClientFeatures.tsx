"use client";

import { useState } from "react";
import { toggleWatchlist, submitReview } from "./actions";
import { Bookmark, BookmarkCheck, Star, Loader2, Send } from "lucide-react";

export function WatchlistButton({ userId, animeId, initialIsWatchlisted }: { userId: string | null, animeId: string, initialIsWatchlisted: boolean }) {
  const [isWatchlisted, setIsWatchlisted] = useState(initialIsWatchlisted);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    if (!userId) {
      alert("Please sign in to add to your watchlist.");
      return;
    }
    setIsPending(true);
    const result = await toggleWatchlist(userId, animeId);
    if (result.success) {
      setIsWatchlisted(result.isWatchlisted!);
    } else {
      alert(result.error);
    }
    setIsPending(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={isPending}
      className={`mt-4 sm:mt-0 sm:ml-4 flex items-center justify-center font-bold py-3 px-6 rounded-full transition-all border ${
        isWatchlisted 
          ? "bg-secondary text-primary border-primary/50 hover:bg-secondary/80" 
          : "bg-transparent text-white border-white/20 hover:border-white/50 hover:bg-white/5"
      }`}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
      ) : isWatchlisted ? (
        <BookmarkCheck className="h-5 w-5 mr-2" />
      ) : (
        <Bookmark className="h-5 w-5 mr-2" />
      )}
      {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}

export function ReviewsSection({ userId, animeId, existingReviews }: { userId: string | null, animeId: string, existingReviews: any[] }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("animeId", animeId);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);

    const result = await submitReview(formData);
    
    if (result.success) {
      alert("Review submitted successfully!");
      setComment("");
    } else {
      alert(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold mb-6 flex items-center">
        <span className="bg-primary w-1.5 h-6 rounded-full mr-3 inline-block"></span>
        Community Reviews
      </h3>

      {userId ? (
        <form onSubmit={handleSubmit} className="mb-10 bg-secondary/30 p-6 rounded-xl border border-white/10">
          <h4 className="font-semibold mb-4 text-white">Leave a Review</h4>
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <button 
                key={star} 
                type="button" 
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star className={`h-6 w-6 ${star <= rating ? "fill-primary text-primary" : "text-gray-500"}`} />
              </button>
            ))}
          </div>
          <textarea
            required
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="What did you think about this anime?"
            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary mb-4 min-h-[100px]"
          />
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center bg-primary hover:bg-primary/90 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <div className="mb-10 p-6 bg-secondary/30 rounded-xl border border-border text-center">
          <p className="text-gray-400 text-sm">You must be logged in to leave a review.</p>
        </div>
      )}

      <div className="space-y-4">
        {existingReviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet. Be the first!</p>
        ) : (
          existingReviews.map(review => (
            <div key={review.id} className="bg-secondary/20 p-5 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase">
                    {review.user?.fullName?.charAt(0) || review.user?.email?.charAt(0) || "U"}
                  </div>
                  <div>
                    <span className="font-semibold text-sm">{review.user?.fullName || review.user?.username || "Anonymous"}</span>
                    <div className="flex items-center mt-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`h-3 w-3 ${star <= review.rating ? "fill-primary text-primary" : "text-gray-600"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-300 mt-3">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
