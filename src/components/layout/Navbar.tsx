
"use client";

import Link from 'next/link';
import { Play, Home, Film, Music, Layers, LayoutDashboard, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/60 backdrop-blur-xl border-b border-white/5">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Play fill="currentColor" size={20} className="text-white ml-1" />
          </div>
          <span className="text-2xl font-headline font-bold tracking-tighter hidden sm:block">
            RojXO<span className="text-primary">Stream</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <Home size={18} /> Library
          </Link>
          <Link href="/shorts" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
            <Layers size={18} /> Shorts
          </Link>
          <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
            <LayoutDashboard size={18} /> Admin
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search content..." 
              className="w-64 pl-10 h-10 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full"
            />
          </div>
          <Button variant="outline" className="rounded-full px-6 border-white/10 hover:bg-white/5">
            Log In
          </Button>
        </div>
      </div>
    </nav>
  );
};
