
"use client";

import Link from 'next/link';
import { Play, Home, Layers, Search, Heart, Menu, Sparkles, X, ChevronRight, FileQuestion } from 'lucide-react';
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

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { library, searchTerm, setSearchTerm } = useMedia();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/', icon: Home, label: 'Explore', activeColor: 'text-accent' },
    { href: '/shorts', icon: Layers, label: 'Shorts', activeColor: 'text-accent' },
    { href: '/about', icon: Heart, label: 'About', activeColor: 'text-pink-400' },
  ];

  // Filter suggestions based on search term
  const suggestions = library
    .filter(item => 
      searchTerm.length > 0 && 
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(0, 6);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToTop = () => {
    const main = document.getElementById('home-main-container');
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    
    // If user clears the search
    if (value === "") {
      handleClearSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
    
    if (pathname !== '/') {
      router.push('/');
    } else {
      // Use requestAnimationFrame to ensure the hero section renders 
      // before attempting to scroll to the top of the container
      requestAnimationFrame(() => {
        scrollToTop();
      });
    }
  };

  const handleSuggestionClick = (title: string) => {
    setSearchTerm(title);
    setShowSuggestions(false);
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center px-4 md:px-10 h-16 md:h-20",
      "bg-background/40 backdrop-blur-xl border-b border-white/5",
      "hover:bg-background/60"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className={cn("flex items-center gap-2 flex-shrink-0 transition-all duration-300", isSearchOpen && "scale-0 w-0 opacity-0 overflow-hidden sm:scale-100 sm:w-auto sm:opacity-100")}>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Play fill="currentColor" size={14} className="text-white ml-0.5" />
            </div>
            <span className="text-base md:text-xl font-headline font-bold tracking-tighter block">
              RojXO<span className="text-primary">Stream</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
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

        {/* Search & Suggestions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end" ref={searchRef}>
          <div className="relative group flex items-center w-full max-w-sm sm:max-w-md">
            {/* Desktop Search UI */}
            <div className="hidden sm:flex relative items-center w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/40 group-focus-within:text-accent transition-colors duration-300" size={18} />
              <Input 
                placeholder="Find universe..." 
                value={searchTerm}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={cn(
                  "w-full pl-12 h-10 bg-white/5 border-white/10 focus:bg-white/10",
                  "focus-visible:ring-1 focus-visible:ring-purple-400/20 rounded-full backdrop-blur-xl",
                  "placeholder:text-white/20 text-sm transition-all duration-500",
                  "shadow-2xl group-hover:border-white/20",
                  "font-medium"
                )}
              />
              {searchTerm && (
                <button 
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  <X size={14} />
                </button>
              )}

              {/* Suggestions Dropdown (Desktop) */}
              {showSuggestions && searchTerm.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[100]">
                  <div className="py-2">
                    {suggestions.length > 0 ? (
                      suggestions.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSuggestionClick(item.title)}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left group/item"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0 border border-white/5">
                            <Image 
                              src={item.thumbnailUrl} 
                              alt="" 
                              width={48} 
                              height={48} 
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" 
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{item.title}</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{item.type}</p>
                          </div>
                          <ChevronRight size={14} className="text-white/10 group-hover/item:text-accent transition-colors" />
                        </button>
                      ))
                    ) : (
                      <div className="px-6 py-8 text-center space-y-2">
                        <FileQuestion className="mx-auto text-white/10" size={32} />
                        <p className="text-sm font-bold text-white/40 uppercase tracking-widest">No universes found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Button & Mobile Dropdown */}
            <div className={cn("flex sm:hidden items-center transition-all duration-300 w-full", isSearchOpen ? "flex-1" : "w-10")}>
              {isSearchOpen ? (
                <div className="flex items-center w-full gap-2 animate-in slide-in-from-right-4 duration-300 relative">
                  <Input 
                    autoFocus
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    className="h-10 bg-white/5 border-white/10 rounded-full pl-10 pr-10 focus:bg-white/10 w-full"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-white/40" 
                    onClick={() => {
                      setIsSearchOpen(false);
                      handleClearSearch();
                    }}
                  >
                    <X size={16} />
                  </Button>

                  {/* Suggestions Dropdown (Mobile) */}
                  {showSuggestions && searchTerm.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[100]">
                      {suggestions.length > 0 ? (
                        suggestions.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              handleSuggestionClick(item.title);
                              setIsSearchOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-3 border-b border-white/5 last:border-0"
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={item.thumbnailUrl} alt="" width={40} height={40} className="w-full h-full object-cover" unoptimized />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-xs font-bold text-white truncate">{item.title}</p>
                              <p className="text-[8px] text-white/40 uppercase font-black">{item.type}</p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-6 text-center text-white/40 text-[10px] font-black uppercase tracking-widest">
                          No matches
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white hover:text-accent"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation Trigger */}
          <div className="lg:hidden flex-shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-10 w-10">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 backdrop-blur-2xl border-white/10 text-white w-[280px] sm:w-[350px]">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="text-2xl font-headline font-bold">Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.href}
                      href={link.href} 
                      className={cn(
                        "flex items-center gap-4 text-xl font-headline font-bold tracking-tight py-3 px-4 rounded-2xl transition-all",
                        pathname === link.href ? "bg-white/10 " + link.activeColor : "text-white/60 hover:bg-white/5"
                      )}
                    >
                      <link.icon size={24} /> {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
