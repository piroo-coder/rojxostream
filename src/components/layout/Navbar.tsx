
"use client";

import Link from 'next/link';
import { Play, Home, Layers, Search, Heart, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useMedia } from '@/context/MediaContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { searchTerm, setSearchTerm } = useMedia();

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-6 md:px-12 h-16 bg-transparent border-none shadow-none transition-all duration-500 flex items-center">
      <div className="w-full flex items-center justify-between relative">
        {/* Top Left: Logo */}
        <div className="flex items-center justify-start min-w-[150px]">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Play fill="currentColor" size={16} className="text-white ml-0.5" />
            </div>
            <span className="text-xl font-headline font-bold tracking-tighter hidden sm:block">
              RojXO<span className="text-primary">Stream</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation Options */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-10 text-[10px] font-black tracking-[0.25em] uppercase">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent whitespace-nowrap group",
              pathname === "/" ? "text-accent" : "text-white"
            )}
          >
            <Home size={14} className="group-hover:animate-bounce" /> Explore
          </Link>
          <Link 
            href="/shorts" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent whitespace-nowrap group",
              pathname === "/shorts" ? "text-accent" : "text-white"
            )}
          >
            <Layers size={14} className="group-hover:animate-pulse" /> Shorts
          </Link>
          <Link 
            href="/about" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-pink-400 whitespace-nowrap group",
              pathname === "/about" ? "text-pink-400" : "text-white"
            )}
          >
            <Heart size={14} className="group-hover:scale-125 transition-transform" /> About
          </Link>
        </div>

        {/* Top Right: Search Bar */}
        <div className="flex items-center justify-end min-w-[150px]">
          <div className="relative hidden lg:block group">
            {/* Cute Outer Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-primary/20 to-accent/20 rounded-full blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500" />
            
            <div className="relative flex items-center">
              {/* Stylish Light Purple Search Icon */}
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/50 group-focus-within:text-accent transition-colors duration-300" size={16} />
              <Input 
                placeholder="Find your universe..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-48 xl:w-64 pl-12 h-11 bg-white/10 border-white/10 focus:bg-white/15",
                  "focus-visible:ring-2 focus-visible:ring-purple-400/30 rounded-full backdrop-blur-xl",
                  "placeholder:text-white/30 text-sm transition-all duration-500",
                  "focus:w-72 xl:focus:w-80 shadow-2xl group-hover:border-white/20",
                  "font-medium"
                )}
              />
              <Sparkles 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-500/0 group-focus-within:text-pink-500/50 transition-all duration-700 pointer-events-none" 
                size={14} 
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
