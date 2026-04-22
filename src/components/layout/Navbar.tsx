
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform duration-300">
            <Play fill="currentColor" size={20} className="text-white ml-1" />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tighter hidden sm:block">
            RojXO<span className="text-primary">Stream</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
          <Link 
            href="/" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent",
              pathname === "/" ? "text-accent" : "text-white/70"
            )}
          >
            <Home size={18} /> Explore
          </Link>
          <Link 
            href="/shorts" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-accent",
              pathname === "/shorts" ? "text-accent" : "text-white/70"
            )}
          >
            <Layers size={18} /> Shorts
          </Link>
          <Link 
            href="/about" 
            className={cn(
              "flex items-center gap-2 transition-all duration-300 hover:text-pink-400",
              pathname === "/about" ? "text-pink-400" : "text-white/70"
            )}
          >
            <Heart size={18} /> About
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
            <Input 
              placeholder="Search universe..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-72 pl-12 h-11 bg-white/5 border-white/10 focus-visible:ring-1 focus-visible:ring-accent rounded-full backdrop-blur-md placeholder:text-white/20"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
