
"use client";

import Link from 'next/link';
import { Play, Home, Layers, Search, Heart, Menu, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useMedia } from '@/context/MediaContext';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { searchTerm, setSearchTerm } = useMedia();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { href: '/', icon: Home, label: 'Explore', activeColor: 'text-accent' },
    { href: '/shorts', icon: Layers, label: 'Shorts', activeColor: 'text-accent' },
    { href: '/about', icon: Heart, label: 'About', activeColor: 'text-pink-400' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center px-4 md:px-10 h-16 md:h-20",
      "bg-background/40 backdrop-blur-xl border-b border-white/5",
      "hover:bg-background/60"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo - Hidden on mobile if search is open */}
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

        {/* Search & Mobile Menu */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          {/* Mobile Search Toggle & Input */}
          <div className="relative group flex items-center">
            {/* Desktop Search */}
            <div className="hidden sm:flex relative items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400/40 group-focus-within:text-accent transition-colors duration-300" size={18} />
              <Input 
                placeholder="Find universe..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-36 md:w-48 lg:w-64 pl-12 h-10 bg-white/5 border-white/10 focus:bg-white/10",
                  "focus-visible:ring-1 focus-visible:ring-purple-400/20 rounded-full backdrop-blur-xl",
                  "placeholder:text-white/20 text-sm transition-all duration-500",
                  "focus:w-48 md:focus:w-72 lg:focus:w-80 shadow-2xl group-hover:border-white/20",
                  "font-medium"
                )}
              />
              {searchTerm && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-pulse">
                  <Sparkles size={12} className="text-accent" />
                </div>
              )}
            </div>

            {/* Mobile Search Button (Icon Only) */}
            <div className={cn("flex sm:hidden items-center transition-all duration-300 w-full", isSearchOpen ? "flex-1" : "w-10")}>
              {isSearchOpen ? (
                <div className="flex items-center w-full gap-2 animate-in slide-in-from-right-4 duration-300">
                  <Input 
                    autoFocus
                    placeholder="Search universes..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 bg-white/5 border-white/10 rounded-full pl-10 pr-10 focus:bg-white/10"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-white/40" 
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <X size={16} />
                  </Button>
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
