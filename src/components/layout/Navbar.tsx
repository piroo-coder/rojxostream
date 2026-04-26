
"use client";

import Link from 'next/link';
import { Play, Home, Layers, Search, Heart, Menu, Sparkles, X, ChevronRight, User, Users, LogOut, Stars } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useMedia } from '@/context/MediaContext';
import { useState, useRef, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { MediaItem } from '@/app/types/media';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array.from({ length: b.length + 1 }, () => 0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[a.length][b.length];
};

const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <span>{text}</span>;
  
  const regex = new RegExp(`(${highlight.split('').join('|')})`, 'gi');
  const parts = text.split(regex);
  
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <span key={i} className="text-accent font-black drop-shadow-[0_0_8px_rgba(var(--accent),0.5)]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { library, searchTerm, setSearchTerm, setCurrentlyPlaying, userName, setUserName, onlineUsers } = useMedia();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localInput, setLocalInput] = useState(searchTerm);
  const searchRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/', icon: Home, label: 'Explore', activeColor: 'text-accent' },
    { href: '/shorts', icon: Layers, label: 'Shorts', activeColor: 'text-accent' },
    { href: '/about', icon: Heart, label: 'About', activeColor: 'text-pink-400' },
  ];

  useEffect(() => {
    setLocalInput(searchTerm);
  }, [searchTerm]);

  const getSuggestions = () => {
    if (localInput.length === 0) return [];
    const query = localInput.toLowerCase();
    const searchableLibrary = pathname === '/shorts' 
      ? library.filter(item => item.type === 'short')
      : library;
    const directMatches = searchableLibrary.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );
    if (directMatches.length > 0) return directMatches.slice(0, 6);
    const fuzzyMatches = searchableLibrary.filter(item => {
      const title = item.title.toLowerCase();
      const maxDistance = query.length < 4 ? 1 : query.length < 7 ? 2 : 3;
      const titleWords = title.split(' ');
      return titleWords.some(word => getLevenshteinDistance(query, word.substring(0, query.length)) <= maxDistance);
    });
    return fuzzyMatches.slice(0, 6);
  };

  const suggestions = getSuggestions();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearSearch = () => {
    setLocalInput("");
    setSearchTerm("");
    setShowSuggestions(false);
    if (pathname !== '/shorts' && pathname !== '/') {
      router.push('/');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && localInput.trim()) {
      setSearchTerm(localInput);
      setShowSuggestions(false);
      if (pathname !== '/' && pathname !== '/shorts') {
        router.push('/');
      }
    }
  };

  const handleSuggestionClick = (item: MediaItem) => {
    setLocalInput("");
    setSearchTerm("");
    setShowSuggestions(false);
    if (item.type === 'short') {
      router.push(`/shorts?id=${item.id}`);
    } else {
      setCurrentlyPlaying(item);
      if (pathname !== '/') router.push('/');
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center px-4 md:px-10 h-16 md:h-20",
      "bg-background/40 backdrop-blur-xl border-b border-white/5",
      "hover:bg-background/60"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className={cn("flex items-center gap-2 flex-shrink-0 transition-all duration-300", isSearchOpen && "scale-0 w-0 opacity-0 overflow-hidden sm:scale-100 sm:w-auto sm:opacity-100")}>
          <Link href="/" className="flex items-center gap-2 group" onClick={handleClearSearch}>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Play fill="currentColor" size={14} className="text-white ml-0.5" />
            </div>
            <span className="text-base md:text-xl font-headline font-bold tracking-tighter block text-white">
              RojXO<span className="text-primary">Stream</span>
            </span>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black tracking-[0.25em] uppercase">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href} 
              className={cn(
                "flex items-center gap-2 transition-all duration-300 hover:text-accent whitespace-nowrap group",
                pathname === link.href ? link.activeColor : "text-white/70"
              )}
            >
              <link.icon size={14} className="group-hover:animate-bounce" /> {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end" ref={searchRef}>
          <div className="hidden sm:flex relative items-center w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/40" size={18} />
            <Input 
              placeholder="Find universe..."
              value={localInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setLocalInput(e.target.value);
                setShowSuggestions(true);
                if (e.target.value === "") handleClearSearch();
              }}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 h-10 bg-white/5 border-white/10 rounded-full backdrop-blur-xl text-white placeholder:text-white/20"
            />
            {showSuggestions && localInput.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-[100]">
                {suggestions.map((item) => (
                  <button key={item.id} onClick={() => handleSuggestionClick(item)} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 text-left">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <Image src={item.thumbnailUrl} alt="" width={40} height={40} className="w-full h-full object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate"><HighlightText text={item.title} highlight={localInput} /></p>
                      <p className="text-[10px] text-white/40 uppercase font-black">{item.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Presence & Identity */}
          {userName && (
            <div className="flex items-center gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="h-10 px-3 md:px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-2 group transition-all">
                    <div className="relative">
                      <Users size={16} className="text-accent group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-background animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 hidden sm:block">
                      {onlineUsers.length + 1} Souls Active
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-background/95 backdrop-blur-3xl border-white/10 rounded-[2rem] p-6 shadow-2xl z-[100]">
                   <div className="space-y-6">
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent border-b border-white/5 pb-2 flex items-center gap-2">
                        <Stars size={12} className="animate-spin-slow" />
                        Active in Multiverse
                     </h4>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                            <User size={14} className="text-primary" />
                          </div>
                          <p className="text-xs font-bold text-white">{userName} <span className="text-[8px] uppercase tracking-widest text-white/20">(You)</span></p>
                        </div>
                        {onlineUsers.map((u, i) => (
                          <div key={i} className="flex items-center gap-3 group/soul">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover/soul:border-accent/30 transition-all">
                              <User size={14} className="text-white/60 group-hover/soul:text-accent transition-colors" />
                            </div>
                            <p className="text-xs font-bold text-white/80 group-hover/soul:text-white transition-colors">{u}</p>
                          </div>
                        ))}
                     </div>
                   </div>
                </PopoverContent>
              </Popover>

              <div className="hidden md:flex items-center gap-3 pl-2 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center border border-accent/40 shadow-lg">
                  <User size={14} className="text-accent" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{userName}</span>
                  <button onClick={() => setUserName(null)} className="text-[8px] uppercase font-black tracking-widest text-white/20 hover:text-destructive transition-colors text-left flex items-center gap-1">
                    <LogOut size={8} /> Logout
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="lg:hidden flex-shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 backdrop-blur-2xl border-white/10 text-white w-[280px]">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="text-2xl font-headline font-bold text-white">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} className={cn("flex items-center gap-4 text-xl font-headline font-bold py-3 px-4 rounded-2xl", pathname === link.href ? "bg-white/10 " + link.activeColor : "text-white/60")}>
                      <link.icon size={24} /> {link.label}
                    </Link>
                  ))}
                  {userName && (
                    <button onClick={() => setUserName(null)} className="flex items-center gap-4 text-xl font-headline font-bold py-3 px-4 rounded-2xl text-destructive/60">
                      <LogOut size={24} /> Logout
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
