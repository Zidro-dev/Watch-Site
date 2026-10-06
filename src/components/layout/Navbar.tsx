"use client";

import Link from "next/link";
import { Search, User as UserIcon, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, usePathname } from "next/navigation";
import NotificationBell from "@/app/notifications/NotificationBell";

export default function Navbar({ user, dbUser, notifications = [] }: { user: any, dbUser?: any, notifications?: any[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden mr-4 text-white hover:text-primary transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">AniZone</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-white text-gray-300">Home</Link>
          <Link href="/catalog" className="transition-colors hover:text-white text-gray-300">Catalog</Link>
          <Link href="/simulcast" className="transition-colors hover:text-white text-gray-300">Simulcast</Link>
          <Link href="/fandub" className="transition-colors hover:text-white text-gray-300">Fandub Portal</Link>
          {user && (
            <Link href="/watchlist" className="transition-colors hover:text-white text-gray-300">My List</Link>
          )}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <div className="hidden sm:flex items-center">
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('open-search'))}
              className="flex items-center space-x-2 bg-secondary/50 hover:bg-secondary border border-white/10 text-muted-foreground px-4 py-1.5 rounded-full transition-colors mr-2"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search...</span>
              <kbd className="ml-2 hidden lg:inline-block bg-black/50 px-1.5 py-0.5 rounded text-[10px] font-mono border border-white/10">Ctrl K</kbd>
            </button>
          </div>
          
          <Link href="/premium" className="hidden lg:block text-primary font-semibold text-sm hover:underline">
            Premium
          </Link>
          
          {user && (
            <NotificationBell initialNotifications={notifications} />
          )}
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center cursor-pointer border border-white/20 overflow-hidden hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
              >
                {dbUser?.avatarUrl ? (
                  <img src={dbUser.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-4 w-4 md:h-5 md:w-5 text-white" />
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-black/90 backdrop-blur-md border border-white/10 shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-white/10 mb-1">
                    <p className="text-sm font-medium text-white truncate">{dbUser?.fullName || user.email}</p>
                    <p className="text-xs text-primary font-bold mt-1 uppercase tracking-wider">{dbUser?.role || "USER"}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">
                    My Profile
                  </Link>
                  <Link href="/admin" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">
                    Admin Dashboard
                  </Link>
                  <Link href="/fandub" className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition">
                    Creator Portal
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10 transition flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="ml-2 bg-primary hover:bg-primary/90 text-white text-xs md:text-sm font-bold py-2 px-3 md:px-5 rounded-full transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] hover:shadow-[0_0_25px_rgba(229,9,20,0.6)]"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl z-40 py-4 px-6 flex flex-col space-y-4">
          <Link href="/" className="text-white font-medium hover:text-primary transition">Home</Link>
          <Link href="/catalog" className="text-white font-medium hover:text-primary transition">Catalog</Link>
          <Link href="/simulcast" className="text-white font-medium hover:text-primary transition">Simulcast</Link>
          <Link href="/fandub" className="text-white font-medium hover:text-primary transition">Fandub Portal</Link>
          {user && (
            <Link href="/watchlist" className="text-white font-medium hover:text-primary transition">My List</Link>
          )}
          <Link href="/premium" className="text-primary font-bold hover:underline transition">Upgrade to Premium</Link>
          
          <div className="pt-4 border-t border-white/10 relative">
            <Search className="absolute left-3 top-7 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search anime..."
              className="w-full h-10 rounded-full border border-white/10 bg-white/5 px-9 py-1 text-sm text-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      )}
    </header>
  );
}
