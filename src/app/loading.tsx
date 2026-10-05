import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Skeleton */}
      <div className="w-full h-[60vh] md:h-[80vh] bg-secondary/20 animate-pulse relative">
        <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-3xl">
          <div className="h-10 bg-white/10 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
          <div className="h-4 bg-white/10 rounded w-5/6 mb-6"></div>
          <div className="flex space-x-4">
            <div className="h-12 bg-white/10 rounded-full w-32"></div>
            <div className="h-12 bg-white/10 rounded-full w-32"></div>
          </div>
        </div>
      </div>

      <div className="mt-[-80px] relative z-30 space-y-12 pb-24">
        {[1, 2, 3].map((row) => (
          <div key={row} className="pl-4 md:pl-12">
            <div className="h-8 bg-white/10 rounded w-48 mb-6 animate-pulse"></div>
            <div className="flex space-x-4 overflow-hidden">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex-none w-[150px] md:w-[200px] lg:w-[240px]">
                  <div className="aspect-[2/3] bg-secondary/30 rounded-md animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4 mt-3 animate-pulse"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2 mt-2 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
