export default function CreatorLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-pulse mt-8">
      <div className="h-10 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-white/10 rounded w-1/2 mb-10"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-6 bg-white/10 rounded w-1/4 mb-6"></div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-12 bg-white/10 rounded-md"></div>
                <div className="h-12 bg-white/10 rounded-md"></div>
              </div>
              <div className="h-12 bg-white/10 rounded-md"></div>
              <div className="h-32 bg-white/10 rounded-lg border-2 border-dashed border-white/5"></div>
              <div className="h-12 bg-white/10 rounded-md"></div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="h-6 bg-white/10 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-white/10 rounded w-full"></div>
              <div className="h-3 bg-white/10 rounded w-5/6"></div>
              <div className="h-3 bg-white/10 rounded w-4/5"></div>
              <div className="h-3 bg-white/10 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
