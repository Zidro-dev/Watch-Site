import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  // Array of placeholder anime cover images for the collage grid
  const collageImages = [
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596727147705-61a533a659bd?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1580477659551-789a69145657?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560942485-b2a11cc13456?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498623116890-37e912163d5d?q=80&w=400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1528150247656-7871b058fb2a?q=80&w=400&auto=format&fit=crop",
  ];

  return (
    <div className="relative w-full h-[85vh] lg:h-[90vh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image Collage Grid */}
      <div className="absolute inset-0 z-0">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 opacity-50 transform scale-110">
          {collageImages.map((src, idx) => (
            <div key={idx} className="aspect-[3/4] w-full relative">
              <img
                src={src}
                alt={`Anime cover ${idx}`}
                className="w-full h-full object-cover absolute inset-0"
                
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
              />
            </div>
          ))}
          {/* Duplicate for density if needed */}
          {collageImages.map((src, idx) => (
            <div key={`dup-${idx}`} className="aspect-[3/4] w-full hidden md:block relative">
              <img
                src={src}
                alt={`Anime cover ${idx} duplicate`}
                className="w-full h-full object-cover absolute inset-0"
                
                sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 16vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dark Gradient Overlays for Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-black/80 to-black/60" />
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Hero Content (Centered) */}
      <div className="relative z-20 container mx-auto px-4 flex flex-col items-center justify-center text-center mt-16">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-tight mb-6 drop-shadow-2xl">
          Dunyodagi eng katta maxsus anime to'plami buyurtma asosida
        </h1>
        <p className="text-lg md:text-2xl text-gray-300 font-medium max-w-2xl mb-10 drop-shadow-lg">
          AniZone-ga qo'shiling va anime dunyosini kashf eting
        </p>
        
        <Link 
          href="/premium" 
          className="inline-block bg-[#F47521] hover:bg-[#F47521]/90 text-black font-extrabold text-sm md:text-base tracking-wider uppercase py-4 px-10 rounded-sm shadow-[0_0_20px_rgba(244,117,33,0.4)] transition-all hover:scale-105"
        >
          BEPUL SINOV MUDDATINI BOSHLANG
        </Link>
      </div>
    </div>
  );
}
