
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  User, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Stars, 
  Music, 
  Send, 
  Copy, 
  Check, 
  X,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef, Suspense } from 'react';
import { MediaItem } from '@/app/types/media';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { useSearchParams, useRouter } from 'next/navigation';

const ShortItem = ({ 
  short, 
  isActive, 
  isMuted, 
  onToggleMute 
}: { 
  short: MediaItem; 
  isActive: boolean; 
  isMuted: boolean;
  onToggleMute: () => void;
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartPop, setShowHeartPop] = useState(false);
  const [flyingHearts, setFlyingHearts] = useState<{ id: number }[]>([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [flyingComments, setFlyingComments] = useState<{ id: number; text: string }[]>([]);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const isYoutube = short.mediaUrl.includes('youtube.com');
  
  const getYoutubeEmbedUrl = (url: string, active: boolean, muted: boolean) => {
    let id = '';
    if (url.includes('/shorts/')) {
      id = url.split('/shorts/')[1].split('?')[0];
    } else if (url.includes('v=')) {
      id = url.split('v=')[1].split('&')[0];
    }
    
    const muteParam = muted ? 1 : 0;
    return `https://www.youtube.com/embed/${id}?autoplay=${active ? 1 : 0}&mute=${muteParam}&controls=0&rel=0&modestbranding=1&enablejsapi=1&loop=1&playlist=${id}`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (!isLiked) {
      setShowHeartPop(true);
      const newHeart = { id: Date.now() };
      setFlyingHearts(prev => [...prev, newHeart]);
      setTimeout(() => setShowHeartPop(false), 800);
      setTimeout(() => {
        setFlyingHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = { id: Date.now(), text: commentText };
    setFlyingComments(prev => [...prev, newComment]);
    setCommentText("");
    setIsCommenting(false);

    setTimeout(() => {
      setFlyingComments(prev => prev.filter(c => c.id !== newComment.id));
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(short.mediaUrl);
    setCopied(true);
    toast({ title: "Portal Linked", description: "The link has been copied to your clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  const sharePlatforms = [
    { name: 'Instagram', icon: Instagram, color: 'hover:text-pink-400 hover:shadow-pink-500/20' },
    { name: 'YouTube', icon: Youtube, color: 'hover:text-red-500 hover:shadow-red-500/20' },
    { name: 'Twitter', icon: Twitter, color: 'hover:text-blue-400 hover:shadow-blue-400/20' },
    { name: 'Facebook', icon: Facebook, color: 'hover:text-blue-600 hover:shadow-blue-600/20' },
  ];

  return (
    <div 
      className="short-item relative flex items-center justify-center bg-black w-full h-full overflow-hidden"
      data-short-id={short.id}
    >
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 opacity-80 blur-[120px] scale-[1.8] saturate-[250%] transition-all duration-1000">
           {isActive && (
             <div className="w-full h-full">
               {isYoutube ? (
                 <iframe
                   src={getYoutubeEmbedUrl(short.mediaUrl, true, true)} 
                   className="w-full h-full pointer-events-none"
                   title="ambient-bg"
                   frameBorder="0"
                 />
               ) : (
                 <video 
                   src={short.mediaUrl} 
                   className="w-full h-full object-cover"
                   loop
                   autoPlay
                   muted
                   playsInline
                 />
               )}
             </div>
           )}
           {!isActive && (
             <img 
               src={short.thumbnailUrl} 
               alt="" 
               className="w-full h-full object-cover"
             />
           )}
        </div>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className={cn(
        "relative z-10 w-full h-full max-w-[360px] aspect-[9/16] bg-black shadow-[0_0_150px_rgba(0,0,0,1)]",
        "flex items-center justify-center sm:rounded-[2.5rem] overflow-hidden border border-white/20 group transition-all duration-500"
      )}>
        {showHeartPop && (
          <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <Heart size={100} fill="currentColor" className="text-pink-500 animate-heart-pop" />
          </div>
        )}

        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          {flyingComments.map(comment => (
            <div 
              key={comment.id} 
              className="absolute left-1/2 bottom-20 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl text-white text-sm font-medium animate-text-fly"
            >
              {comment.text}
            </div>
          ))}
        </div>
        
        {isActive ? (
          <div className="w-full h-full">
            {isYoutube ? (
              <iframe
                src={getYoutubeEmbedUrl(short.mediaUrl, isActive, isMuted)}
                className="w-full h-full scale-[1.05]"
                title={short.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <video 
                src={short.mediaUrl} 
                className="w-full h-full object-cover"
                loop
                autoPlay
                muted={isMuted}
                playsInline
              />
            )}
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            <img 
              src={short.thumbnailUrl} 
              alt={short.title} 
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        )}

        <button 
          className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-2xl border border-white/20 text-white hover:bg-white/30 transition-all shadow-xl"
          onClick={onToggleMute}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-6 z-20">
          <div className="flex items-end justify-between w-full">
            <div className="flex-1 pointer-events-auto text-white space-y-3 mb-2 drop-shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full bg-neutral-800 border-2 border-white/40 overflow-hidden">
                  <User size={20} className="m-auto mt-2" />
                </div>
                <span className="font-headline font-bold text-sm tracking-tight">@{short.creator || 'Creator'}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium leading-snug line-clamp-2 text-white/95 max-w-[90%]">{short.title}</p>
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 w-fit">
                  <Music size={10} className="animate-pulse text-pink-400" />
                  <span className="text-[10px] font-bold tracking-tight truncate max-w-[140px]">Original Sound • {short.title}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 pointer-events-auto mb-2 items-center pl-2 relative">
              {flyingHearts.map(heart => (
                <div key={heart.id} className="absolute -top-10 text-pink-500 animate-float-up pointer-events-none">
                  <Heart size={20} fill="currentColor" />
                </div>
              ))}

              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleLike}
                  className={cn(
                    "rounded-full backdrop-blur-3xl transition-all w-12 h-12 border border-white/10 group active:scale-90 shadow-lg",
                    isLiked ? "bg-pink-500 border-pink-500" : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <Heart size={24} className={cn("text-white transition-transform", isLiked && "fill-current scale-110")} />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">24.5K</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setIsCommenting(!isCommenting)}
                  className={cn(
                    "rounded-full bg-white/10 backdrop-blur-3xl hover:bg-white/20 transition-all w-12 h-12 border border-white/10 group active:scale-90 shadow-lg",
                    isCommenting && "bg-accent border-accent"
                  )}
                >
                  <MessageCircle size={24} className="text-white" />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">1.2K</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setShowShare(true)}
                  className="rounded-full bg-white/10 backdrop-blur-3xl hover:bg-white/20 transition-all w-12 h-12 border border-white/10 group active:scale-90 shadow-lg"
                >
                  <Share2 size={22} className="text-white" />
                </Button>
                <span className="text-[10px] font-black text-white drop-shadow-md">Share</span>
              </div>
            </div>
          </div>
          
          {isCommenting && (
            <form onSubmit={handleSendComment} className="mt-4 flex items-center gap-2 pointer-events-auto animate-in slide-in-from-bottom-2 duration-300">
              <Input 
                autoFocus
                placeholder="Share your soul..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="h-10 bg-black/60 border-white/20 rounded-xl text-xs placeholder:text-white/30 backdrop-blur-2xl"
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-xl bg-accent hover:bg-accent/80 flex-shrink-0">
                <Send size={16} />
              </Button>
            </form>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
      </div>

      <Dialog open={showShare} onOpenChange={setShowShare}>
        <DialogContent className="bg-gradient-to-br from-background via-background/95 to-pink-500/10 backdrop-blur-3xl border-white/10 text-white rounded-[2rem] sm:rounded-[3rem] w-[92vw] max-w-md p-6 sm:p-10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] border overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles size={120} className="text-pink-500 animate-pulse" />
          </div>
          <div className="absolute bottom-[-20%] left-[-10%] p-8 opacity-10 pointer-events-none">
            <Heart size={200} className="text-primary animate-pulse-slow" fill="currentColor" />
          </div>

          <DialogHeader className="mb-6 sm:mb-8 relative z-10">
            <DialogTitle className="font-headline font-bold text-xl sm:text-3xl text-center tracking-tight text-white drop-shadow-md flex items-center justify-center gap-3">
              <Stars className="text-pink-400" size={16} />
              Share the Magic
              <Stars className="text-pink-400" size={16} />
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 sm:space-y-8 relative z-10">
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/5 border border-white/10 p-2 sm:p-4 rounded-[1.25rem] sm:rounded-[2rem] group hover:border-pink-500/30 transition-all duration-500 backdrop-blur-md">
              <div className="flex-1 w-full truncate font-code text-[10px] sm:text-xs font-medium text-white/50 group-hover:text-white/80 transition-colors px-2">
                {short.mediaUrl}
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={handleCopyLink}
                className={cn(
                  "h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl transition-all duration-500 shadow-xl flex-shrink-0",
                  copied 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30 scale-105" 
                    : "bg-white/10 text-white/40 hover:text-white hover:bg-pink-500/20 border border-white/5"
                )}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-2 sm:gap-6 px-1">
              {sharePlatforms.map((platform, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 group">
                  <button className={cn(
                    "w-10 h-10 sm:w-16 sm:h-16 rounded-[1rem] sm:rounded-[1.75rem] bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-500",
                    "hover:bg-white/10 hover:scale-110 hover:-translate-y-1 active:scale-95 shadow-xl",
                    platform.color
                  )}>
                    <platform.icon size={18} strokeWidth={1.5} className="sm:size-7" />
                  </button>
                  <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60 transition-colors">
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10 space-y-4">
            <p className="text-[9px] font-headline font-bold text-white/20 uppercase tracking-[0.4em]">
              Spread Love Across the Multiverse
            </p>
            <DialogClose asChild>
              <Button variant="ghost" className="sm:hidden text-white/40 hover:text-white hover:bg-white/5 h-10 w-full rounded-xl">
                Dismiss
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function ShortsPageContent() {
  const { library, searchTerm } = useMedia();
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetId = searchParams.get('id');
  const idsFilter = searchParams.get('ids'); // Comma-separated list of IDs
  
  const [isMuted, setIsMuted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter shorts based on type, search term, and optional ID list
  const shorts = library.filter(item => {
    const isShort = item.type === 'short';
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.creator?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIds = idsFilter ? idsFilter.split(',').includes(item.id) : true;
    
    return isShort && matchesSearch && matchesIds;
  });

  useEffect(() => {
    if (shorts.length > 0) {
      if (targetId) {
        const timer = setTimeout(() => {
          const element = document.querySelector(`[data-short-id="${targetId}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
            setActiveId(targetId);
          }
        }, 50);
        return () => clearTimeout(timer);
      } else if (!activeId) {
        setActiveId(shorts[0].id);
      }
    }
  }, [shorts.length, targetId, idsFilter]);

  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      threshold: 0.8,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('data-short-id');
          if (id) {
            setActiveId(id);
          }
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.short-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [shorts]);

  return (
    <main className="h-svh bg-black overflow-hidden relative">
      <Navbar />
      
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] text-white/5 animate-pulse">
          <Stars size={120} />
        </div>
        <div className="absolute bottom-[10%] right-[5%] text-white/5 animate-pulse delay-1000">
          <Sparkles size={100} />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80rem] h-[80rem] bg-white/5 rounded-full blur-[200px] animate-pulse-slow" />
      </div>

      {/* Exit Button for Related Shorts */}
      {idsFilter && (
        <div className="fixed top-20 left-4 md:left-10 z-[40] animate-in slide-in-from-left-4 duration-500">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-3 group shadow-2xl"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Universe</span>
          </Button>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={cn(
          "shorts-container h-full pt-16 md:pt-20",
          "snap-y snap-mandatory scroll-smooth relative z-10 scrollbar-hide",
          "scroll-pt-16 md:scroll-pt-20"
        )}
      >
        {shorts.length > 0 ? (
          <>
            {shorts.map((short) => (
              <div 
                key={short.id} 
                className="w-full h-full snap-start snap-always"
              >
                <ShortItem 
                  short={short} 
                  isActive={activeId === short.id} 
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
                />
              </div>
            ))}
            {/* End of Multiverse Footer Item */}
            <div className="w-full h-full snap-start snap-always flex flex-col items-center justify-center p-8 bg-black">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                <div className="relative w-32 h-32 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 backdrop-blur-3xl shadow-2xl">
                  <Stars size={48} className="text-white/20 animate-pulse" />
                </div>
              </div>
              <h3 className="text-3xl font-headline font-bold mb-4 text-white text-center tracking-tighter">End of Multiverse</h3>
              <p className="text-white/40 text-sm max-w-xs font-light text-center leading-relaxed">
                You have reached the boundary of this archive. No more shorts are available in this collection.
              </p>
              <div className="mt-12 flex flex-col items-center gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-full border-white/10 text-white/40 hover:text-white hover:bg-white/5 gap-3 h-12 px-8 uppercase tracking-widest font-black text-[10px]"
                  onClick={() => {
                    if (containerRef.current) {
                      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                >
                  Return to Origin <ChevronDown size={14} className="rotate-180" />
                </Button>
                {idsFilter && (
                   <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="text-accent hover:text-accent/80 font-black text-[10px] uppercase tracking-[0.2em]"
                  >
                    Back to Universe
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center pt-32">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10">
              <Sparkles size={48} className="text-white/10" />
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2 text-white">No Shorts Found</h3>
            <p className="text-sm max-w-xs font-light">The multiverse is quiet. Try another search!</p>
            {idsFilter && (
              <Button 
                variant="link" 
                onClick={() => router.back()}
                className="mt-6 text-accent"
              >
                Back to Universe
              </Button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ShortsPage() {
  return (
    <Suspense fallback={<div className="h-svh bg-black flex items-center justify-center text-white/20 font-headline font-bold uppercase tracking-[0.5em]">Loading Multiverse...</div>}>
      <ShortsPageContent />
    </Suspense>
  );
}
