
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
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl h-16 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] transition-all duration-500 flex items-center overflow-hidden">
      <div className="w-full px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform duration-300">
            <Play fill="currentColor" size={18} className="text-white ml-0.5" />
          </div>
          <span className="text-xl font-headline font-bold tracking-tighter hidden sm:block">
            RojXO<span className="text-primary">Stream</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-[10px] font-black tracking-[0.2em] uppercase">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent",
              pathname === "/" ? "text-accent" : "text-white/60"
            )}
          >
            <Home size={14} /> Explore
          </Link>
          <Link 
            href="/shorts" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent",
              pathname === "/shorts" ? "text-accent" : "text-white/60"
            )}
          >
            <Layers size={14} /> Shorts
          </Link>
          <Link 
            href="/about" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-pink-400",
              pathname === "/about" ? "text-pink-400" : "text-white/60"
            )}
          >
            <Heart size={14} /> About
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <Input 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-40 xl:w-56 pl-9 h-9 bg-white/5 border-white/5 focus-visible:ring-1 focus-visible:ring-accent rounded-full backdrop-blur-md placeholder:text-white/10 text-xs transition-all focus:w-64"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
