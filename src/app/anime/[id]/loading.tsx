import { Loader2 } from "lucide-react";

export default function AnimeLoading() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Banner Skeleton */}
      <div className="w-full h-[40vh] bg-secondary/20 animate-pulse relative"></div>
      
      <div className="container mx-auto px-4 md:px-8 mt-[-100px] relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-64 flex-shrink-0 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-lg shadow-2xl bg-secondary/40 animate-pulse border-4 border-black"></div>
          </div>
          
          {/* Details */}
          <div className="flex-1 mt-4 md:mt-24 space-y-4">
            <div className="h-10 bg-white/10 rounded w-3/4 animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-6 bg-white/10 rounded-full w-16 animate-pulse"></div>
              <div className="h-6 bg-white/10 rounded-full w-20 animate-pulse"></div>
              <div className="h-6 bg-white/10 rounded-full w-24 animate-pulse"></div>
            </div>
            <div className="h-24 bg-white/10 rounded w-full mt-6 animate-pulse"></div>
            <div className="flex space-x-4 pt-4">
              <div className="h-12 bg-white/10 rounded-full w-40 animate-pulse"></div>
              <div className="h-12 bg-white/10 rounded-full w-40 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Episodes Skeleton */}
        <div className="mt-16">
          <div className="h-8 bg-white/10 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-secondary/20 rounded-lg p-4 animate-pulse h-24 border border-white/5"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
