
"use client";

import Link from 'next/link';
import { Play, Home, Layers, Heart, LogOut, MoreVertical, ShieldCheck, User, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useMedia } from '@/context/MediaContext';
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
  const { userName, setUserName, isOtherOnline, otherUser } = useMedia();

  const navLinks = [
    { href: '/', icon: Home, label: 'Control Hub' },
    { href: '/about', icon: Heart, label: 'About' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center px-4 md:px-10 h-16 md:h-20",
      "bg-background/40 backdrop-blur-xl border-b border-white/5"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg group-hover:rotate-3 transition-all">
              <Play fill="currentColor" size={14} className="text-white ml-0.5" />
            </div>
            <span className="text-base md:text-xl font-headline font-bold tracking-tighter text-white">
              RojXO<span className="text-primary">Stream</span>
            </span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black tracking-[0.25em] uppercase">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn("flex items-center gap-2 transition-all hover:text-accent", pathname === link.href ? "text-accent" : "text-white/70")}>
              <link.icon size={14} /> {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          {/* Partner Status */}
          <div className="flex items-center gap-2 md:gap-3 bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5">
             <div className="relative flex h-2 w-2">
                <div className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", isOtherOnline ? "animate-ping bg-emerald-400" : "bg-white/20")}></div>
                <div className={cn("relative inline-flex h-2 w-2 rounded-full", isOtherOnline ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-white/20")}></div>
             </div>
             <span className={cn("text-[9px] font-black uppercase tracking-widest hidden sm:block", isOtherOnline ? "text-white" : "text-white/20")}>
               {otherUser} {isOtherOnline ? "Online" : "Offline"}
             </span>
             <span className={cn("text-[9px] font-black uppercase tracking-widest sm:hidden", isOtherOnline ? "text-emerald-400" : "text-white/20")}>
               {otherUser.charAt(0)}
             </span>
          </div>

          {/* Identity & Mobile Menu */}
          {userName && (
            <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-white/10">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">{userName}</span>
                <button onClick={() => setUserName(null)} className="text-[8px] uppercase font-black text-white/20 hover:text-destructive flex items-center gap-1">
                  Exit <LogOut size={8} />
                </button>
              </div>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <MoreVertical size={18} className="text-white/40" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background/95 backdrop-blur-3xl border-white/10 w-[280px] p-0 overflow-hidden rounded-l-[2rem]">
                  <SheetHeader className="p-10 border-b border-white/5 bg-primary/5">
                    <SheetTitle className="text-2xl font-headline font-bold text-white tracking-tighter">Portal Menu</SheetTitle>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30">
                        <User size={18} className="text-accent" />
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Traveler Identity</p>
                        <p className="text-base font-bold text-white">{userName}</p>
                      </div>
                    </div>
                  </SheetHeader>
                  <div className="p-8 space-y-4">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">Navigation</div>
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className={cn(
                        "flex items-center gap-4 text-lg font-headline font-bold p-4 rounded-2xl transition-all",
                        pathname === link.href ? "bg-white/10 text-accent" : "text-white/60 hover:bg-white/5"
                      )}>
                        <link.icon size={20} /> {link.label}
                      </Link>
                    ))}
                    <div className="pt-8 mt-8 border-t border-white/5">
                      <button onClick={() => setUserName(null)} className="flex items-center gap-4 text-lg font-headline font-bold p-4 rounded-2xl text-destructive hover:bg-destructive/10 w-full text-left">
                        <LogOut size={20} /> Close Connection
                      </button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
