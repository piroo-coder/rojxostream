"use client";

import Link from 'next/link';
import { Play, Home, Layers, Search, Heart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useMedia } from '@/context/MediaContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { searchTerm, setSearchTerm } = useMedia();

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl h-14 bg-transparent border-none shadow-none transition-all duration-500 flex items-center overflow-hidden">
      <div className="w-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
            <Play fill="currentColor" size={14} className="text-white ml-0.5" />
          </div>
          <span className="text-lg font-headline font-bold tracking-tighter hidden sm:block">
            RojXO<span className="text-primary">Stream</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[9px] font-black tracking-[0.2em] uppercase">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent",
              pathname === "/" ? "text-accent" : "text-white"
            )}
          >
            <Home size={12} /> Explore
          </Link>
          <Link 
            href="/shorts" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent",
              pathname === "/shorts" ? "text-accent" : "text-white"
            )}
          >
            <Layers size={12} /> Shorts
          </Link>
          <Link 
            href="/about" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-pink-400",
              pathname === "/about" ? "text-pink-400" : "text-white"
            )}
          >
            <Heart size={12} /> About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={12} />
            <Input 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-32 xl:w-44 pl-8 h-8 bg-white/5 border-white/5 focus-visible:ring-1 focus-visible:ring-accent rounded-full backdrop-blur-md placeholder:text-white/20 text-xs transition-all focus:w-56"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
