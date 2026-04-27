"use client";

import Link from 'next/link';
import { Play, Home, Layers, Search, Heart, Menu, Sparkles, X, ChevronRight, User, LogOut, Stars, Smile, Share2, AlertCircle, CircleDot } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { updateSharingState } from '@/app/actions/sync-actions';
import { toast } from '@/hooks/use-toast';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { library, searchTerm, setSearchTerm, setCurrentlyPlaying, userName, setUserName, isOtherOnline, otherUser, syncData } = useMedia();
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
    if (syncData?.sharing.status === 'requesting' && syncData.sharing.leader !== userName) {
      const sharedItem = library.find(i => i.id === syncData.sharing.mediaId);
      if (sharedItem) {
        toast({
          title: "Watch Party Invitation",
          description: `${otherUser} wants to share "${sharedItem.title}". Accept?`,
          action: <Button size="sm" onClick={() => updateSharingState(otherUser, sharedItem.id, 'active')}>Accept</Button>
        });
      }
    }
  }, [syncData?.sharing.status, syncData?.sharing.mediaId, userName, library, otherUser]);

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

  const moods = [
    {
      name: "Heartfelt & Emotional",
      icon: "💖",
      description: "Stories that touch your soul.",
      items: library.filter(m => ['Suzume', 'I Want to Eat Your Pancreas', 'A Silent Voice'].includes(m.title))
    },
    {
      name: "Romantic & Ethereal",
      icon: "✨",
      description: "Lose yourself in magical connections.",
      items: library.filter(m => ['Your Name', 'Weathering with You', 'Half Girlfriend'].includes(m.title))
    }
  ];

  const handleStopSharing = () => {
    updateSharingState(null, null, 'idle');
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center px-4 md:px-10 h-16 md:h-20",
      "bg-background/40 backdrop-blur-xl border-b border-white/5"
    )}>
      <div className="container mx-auto flex items-center justify-between gap-4">
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

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-black tracking-[0.25em] uppercase">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={cn("flex items-center gap-2 transition-all hover:text-accent", pathname === link.href ? link.activeColor : "text-white/70")}>
              <link.icon size={14} /> {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
          {/* Active Partner Status */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5 mr-2">
             <div className="relative flex h-2 w-2">
                <div className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", isOtherOnline ? "animate-ping bg-emerald-400" : "bg-white/20")}></div>
                <div className={cn("relative inline-flex h-2 w-2 rounded-full", isOtherOnline ? "bg-emerald-500 shadow-[0_0_10px_#10b981]" : "bg-white/20")}></div>
             </div>
             <span className={cn("text-[9px] font-black uppercase tracking-widest", isOtherOnline ? "text-white" : "text-white/20")}>
               {otherUser} {isOtherOnline ? "Online" : "Away"}
             </span>
          </div>

          {/* Share Status */}
          {syncData?.sharing.status === 'active' && syncData.sharing.leader === userName && (
            <Button onClick={handleStopSharing} variant="destructive" size="sm" className="hidden sm:flex rounded-full px-4 h-9 text-[9px] font-black tracking-widest uppercase">
              Stop Sharing
            </Button>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="h-10 px-3 md:px-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-2">
                <Smile size={16} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 hidden sm:block">Mood</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-background/40 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-0 shadow-2xl z-[100] border">
              <div className="p-8 bg-primary/10 border-b border-white/5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-1">Your Mood</h4>
                <p className="text-lg font-headline font-bold text-white">How are you feeling?</p>
              </div>
              <ScrollArea className="h-[350px] p-6">
                {moods.map(m => (
                  <div key={m.name} className="space-y-4 mb-8 last:mb-0">
                    <h5 className="text-[10px] font-black text-white/40 uppercase tracking-widest px-2">{m.name}</h5>
                    <div className="grid gap-2">
                      {m.items.map(item => (
                        <button key={item.id} onClick={() => handleSuggestionClick(item)} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-left border border-transparent hover:border-accent/30 transition-all">
                          <Image src={item.thumbnailUrl} alt="" width={40} height={40} className="w-10 h-10 rounded-xl object-cover" unoptimized />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{item.title}</p>
                            <p className="text-[8px] text-white/40 uppercase font-black">{item.creator}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          {userName && (
            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">{userName}</span>
                </div>
                <button onClick={() => setUserName(null)} className="text-[8px] uppercase font-black text-white/20 hover:text-destructive flex items-center gap-1">
                  Logout <LogOut size={8} />
                </button>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 shadow-lg">
                <User size={16} className="text-primary" />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
