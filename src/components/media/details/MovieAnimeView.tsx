"use client";

import { MediaItem } from '@/app/types/media';
import { X, Info, Play, BookOpen, Sparkles, Users, BrainCircuit, Quote, Heart, ArrowLeft, Languages, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MovieAnimeViewProps {
  item: MediaItem;
  onClose: () => void;
}

export const MovieAnimeView: React.FC<MovieAnimeViewProps> = ({ item, onClose }) => {
  const [mode, setMode] = useState<'discovery' | 'playing' | 'analysis' | 'hindi-explanation' | 'wikipedia'>('discovery');
  const [showMangaConfirm, setShowMangaConfirm] = useState(false);

  const getEmbedSource = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let id = '';
      if (url.includes('watch?v=')) id = url.split('v=')[1].split('&')[0];
      else if (url.includes('youtu.be/')) id = url.split('be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
    }
    if (url.includes('dailymotion.com')) {
      const parts = url.split('/');
      const id = parts[parts.length - 1].split('?')[0];
      return `https://www.dailymotion.com/embed/video/${id}?autoplay=1`;
    }
    if (url.includes('vimeo.com')) {
      const parts = url.split('/');
      const id = parts[parts.length - 1].split('?')[0];
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    if (url.includes('dropbox.com')) {
      return url.replace('dl=0', 'raw=1');
    }
    return url;
  };

  const isDirectVideo = (url: string) => url?.includes('dropbox.com') || url?.endsWith('.mp4');

  const handleOpenManga = () => {
    if (item.mangaUrl) {
      window.open(item.mangaUrl, '_blank');
      setShowMangaConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background animate-in fade-in duration-500 overflow-hidden h-svh w-screen flex flex-col">
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <Image 
          src={item.thumbnailUrl} 
          alt=""
          fill
          className="object-cover opacity-30 scale-110 blur-2xl"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute top-[20%] left-[10%] w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-[50rem] h-[50rem] bg-accent/5 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 right-4 md:top-8 md:right-8 text-white z-[80] bg-white/5 hover:bg-white/20 rounded-full backdrop-blur-xl border border-white/10 w-12 h-12 shadow-2xl transition-all hover:scale-110 active:scale-90"
        onClick={onClose}
      >
        <X size={24} />
      </Button>

      <ScrollArea className="flex-1 w-full relative z-10">
        <div className="container mx-auto max-w-6xl px-4 py-20 md:py-32 flex flex-col items-center">
          
          {mode === 'discovery' ? (
            <div className="w-full space-y-16 animate-in slide-in-from-bottom-8 duration-700">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 bg-black/40 border border-primary/30 px-6 py-2 rounded-full backdrop-blur-3xl shadow-[0_0_20px_rgba(var(--primary),0.2)]">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Discovery Mode</span>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-8xl font-headline font-bold tracking-tighter leading-none text-white drop-shadow-2xl">
                  {item.title}
                </h1>
                <p className="text-xl md:text-2xl text-accent font-bold tracking-tight italic">{item.creator}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4 space-y-8">
                  <div className="p-8 rounded-[2.5rem] bg-card/60 border border-white/5 backdrop-blur-3xl shadow-2xl space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">The Architects</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] text-primary uppercase font-black tracking-widest">Director</p>
                          <p className="text-lg font-bold">{item.creator}</p>
                        </div>
                        {item.writers && (
                          <div>
                            <p className="text-[10px] text-primary uppercase font-black tracking-widest">Writers</p>
                            <p className="text-sm font-medium text-white/80">{item.writers}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">Resource Portals</h4>
                      <div className="flex flex-col gap-3">
                        {item.wikipediaUrl && (
                          <Button onClick={() => setMode('wikipedia')} variant="outline" className="justify-start gap-3 h-12 rounded-2xl bg-white/5 border-white/10 hover:border-primary/50 transition-all group">
                            <Info size={16} className="text-primary group-hover:animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Wikipedia</span>
                          </Button>
                        )}
                        {item.type === 'anime' && item.mangaUrl && (
                          <Button onClick={() => setShowMangaConfirm(true)} variant="outline" className="justify-start gap-3 h-12 rounded-2xl bg-white/5 border-white/10 hover:border-accent/50 transition-all group">
                            <BookOpen size={16} className="text-accent group-hover:animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Read Manga</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {item.type === 'anime' && (
                      <div className="space-y-4 pt-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 border-b border-white/5 pb-2">Archive Insights</h4>
                        <div className="flex flex-col gap-3">
                          {item.criticalAnalysis && (
                            <Button 
                              onClick={() => setMode('analysis')} 
                              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-purple-600 hover:shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all font-bold text-xs gap-2"
                            >
                              <BrainCircuit size={16} />
                              CRITICAL ANALYSIS
                            </Button>
                          )}
                          {item.hindiExplanationUrl && (
                            <Button 
                              onClick={() => setMode('hindi-explanation')} 
                              className="w-full h-14 rounded-2xl bg-gradient-to-r from-accent to-blue-600 hover:shadow-[0_0_20px_rgba(var(--accent),0.4)] transition-all font-bold text-xs gap-2"
                            >
                              <Languages size={16} />
                              HINDI EXPLANATION
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-12">
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary flex items-center gap-4">
                      <div className="h-px w-12 bg-primary/30" /> The Chronicle
                    </h3>
                    <p className="text-2xl md:text-3xl font-light text-white/90 leading-tight italic drop-shadow-md">
                      "{item.summary || item.description}"
                    </p>
                  </div>

                  {item.characters && item.characters.length > 0 && (
                    <div className="space-y-8">
                      <h3 className="text-xs font-black uppercase tracking-[0.4em] text-accent flex items-center gap-4">
                        <div className="h-px w-12 bg-accent/30" /> Manifested Souls
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.characters.map((char, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/10 hover:border-accent/30 transition-all group/char cursor-default">
                            <Avatar className="h-14 w-14 border-2 border-white/10 group-hover/char:border-accent/50 transition-all">
                              <AvatarImage src={char.image_url} alt={char.name} className="object-cover" />
                              <AvatarFallback><Users className="text-white/20" /></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-white group-hover/char:text-accent transition-colors">{char.name}</p>
                              <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Main Character</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.moral && (
                    <div className="p-10 rounded-[3rem] bg-primary/5 border border-primary/20 backdrop-blur-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles size={80} className="text-primary" />
                      </div>
                      <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-6">Core Essence</h3>
                      <p className="text-2xl md:text-4xl font-headline font-bold text-white italic leading-tight">
                        "{item.moral}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 pt-12">
                <button 
                  className="h-24 px-16 rounded-[2.5rem] bg-primary hover:bg-primary/90 text-2xl font-black shadow-[0_20px_60px_-15px_rgba(var(--primary),0.5)] transition-all hover:scale-105 active:scale-95 group flex items-center justify-center text-white"
                  onClick={() => setMode('playing')}
                >
                  <Play size={28} fill="currentColor" className="mr-4 group-hover:animate-pulse" />
                  Enter Universe
                </button>
                <button 
                  onClick={onClose}
                  className="text-white/30 hover:text-white uppercase tracking-[0.4em] font-black text-[10px] bg-transparent border-0 cursor-pointer"
                >
                  Exit to Explore
                </button>
              </div>
            </div>
          ) : mode === 'analysis' && item.criticalAnalysis ? (
            <div className="w-full max-w-4xl space-y-16 animate-in fade-in zoom-in-95 duration-700">
               <header className="text-center space-y-4">
                 <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 rounded-full backdrop-blur-3xl">
                    <BrainCircuit size={14} className="text-purple-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-200">Critical Analysis</span>
                 </div>
                 <h2 className="text-4xl md:text-6xl font-headline font-bold text-white tracking-tight">{item.title}</h2>
                 <button 
                  onClick={() => setMode('discovery')} 
                  className="text-white/40 hover:text-white gap-2 uppercase tracking-widest text-[10px] font-black bg-transparent border-0 flex items-center mx-auto"
                >
                   <ArrowLeft size={14} /> Return to Discovery
                 </button>
               </header>

               <div className="space-y-12">
                 <section className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary flex items-center gap-4">
                      <div className="h-px w-12 bg-primary/30" /> Character Psychology
                    </h3>
                    <div className="grid gap-4">
                      {item.criticalAnalysis.characterMotivations.map((m, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all space-y-2">
                          <p className="text-sm font-black text-primary uppercase tracking-widest">{m.topic}</p>
                          <p className="text-white/70 leading-relaxed italic">{m.explanation}</p>
                        </div>
                      ))}
                    </div>
                 </section>

                 <section className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-accent flex items-center gap-4">
                      <div className="h-px w-12 bg-accent/30" /> Narrative Significance
                    </h3>
                    <div className="grid gap-4">
                      {item.criticalAnalysis.narrativeEvents.map((e, i) => (
                        <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/20 transition-all space-y-2">
                          <p className="text-sm font-black text-accent uppercase tracking-widest">{e.event}</p>
                          <p className="text-white/70 leading-relaxed italic">{e.explanation}</p>
                        </div>
                      ))}
                    </div>
                 </section>

                 <section className="p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 relative overflow-hidden">
                    <Quote className="absolute -top-4 -left-4 text-white/5" size={160} />
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-6 relative z-10">The Writer's Conveyance</h3>
                    <p className="text-2xl md:text-3xl font-headline font-bold text-white leading-tight relative z-10">
                      {item.criticalAnalysis.writersMessage}
                    </p>
                 </section>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <section className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-4">
                      <h3 className="text-[10px] font-black text-accent uppercase tracking-widest flex items-center gap-2">
                        <Heart size={14} /> Real World Resonance
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {item.criticalAnalysis.realLifeRelation}
                      </p>
                    </section>
                    <section className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-4">
                      <h3 className="text-[10px] font-black text-pink-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} /> Human Importance
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed">
                        {item.criticalAnalysis.importanceToUs}
                      </p>
                    </section>
                 </div>
               </div>

               <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setMode('playing')}
                    className="h-16 px-12 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-2xl text-white"
                  >
                    Watch Now
                  </button>
               </div>
            </div>
          ) : mode === 'hindi-explanation' && item.hindiExplanationUrl ? (
            <div className="w-full flex flex-col items-center gap-12 animate-in zoom-in-95 duration-1000">
               <div className="text-center space-y-4">
                 <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 px-4 py-1.5 rounded-full backdrop-blur-3xl">
                    <Languages size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Hindi Narrative Summary</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-headline font-bold text-white drop-shadow-2xl">{item.title}</h2>
                 <button onClick={() => setMode('discovery')} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-transparent border-0 mx-auto">
                    <ArrowLeft size={14} /> Back to Discovery
                 </button>
               </div>
               
               <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] bg-black">
                 <iframe 
                    src={getEmbedSource(item.hindiExplanationUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
               </div>
            </div>
          ) : mode === 'wikipedia' && item.wikipediaUrl ? (
            <div className="w-full flex flex-col items-center gap-12 animate-in zoom-in-95 duration-1000">
               <div className="text-center space-y-4">
                 <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-3xl">
                    <Info size={14} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Wikipedia Archive</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-headline font-bold text-white drop-shadow-2xl">{item.title}</h2>
                 <button onClick={() => setMode('discovery')} className="text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-transparent border-0 mx-auto">
                    <ArrowLeft size={14} /> Back to Discovery
                 </button>
               </div>
               
               <div className="w-full max-w-6xl h-[70vh] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] bg-black relative">
                 <div className="absolute inset-0 z-0 bg-black pointer-events-none" />
                 <iframe 
                    src={`${item.wikipediaUrl}${item.wikipediaUrl?.includes('?') ? '&' : '?'}useskin=vector-2022&vector-skin-theme=dark`}
                    className="w-full h-full border-0 relative z-10"
                    title="Wikipedia"
                    style={{ filter: 'invert(0.9) hue-rotate(180deg) brightness(1.1)' }}
                  />
               </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-12 animate-in zoom-in-95 duration-1000">
               <div className="text-center space-y-4">
                 <h2 className="text-3xl md:text-5xl font-headline font-bold text-white drop-shadow-2xl">{item.title}</h2>
                 <button onClick={() => setMode('discovery')} className="text-accent hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-transparent border-0 mx-auto">
                    <Info size={14} /> Back to Discovery
                 </button>
               </div>
               
               <div className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] bg-black">
                 {isDirectVideo(item.mediaUrl) ? (
                   <video 
                    src={getEmbedSource(item.mediaUrl)} 
                    className="w-full h-full" 
                    controls 
                    autoPlay 
                  />
                 ) : (
                   <iframe 
                    src={getEmbedSource(item.mediaUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                 )}
               </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Manga Permission Alert Dialog */}
      <AlertDialog open={showMangaConfirm} onOpenChange={setShowMangaConfirm}>
        <AlertDialogContent className="bg-background/95 backdrop-blur-3xl border-white/10 rounded-[2rem]">
          <AlertDialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4 border border-accent/30">
              <ShieldAlert className="text-accent" size={24} />
            </div>
            <AlertDialogTitle className="text-center font-headline text-2xl">Permission Required</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-white/60">
              You are about to teleport to an external library to read the manga for <strong>{item.title}</strong>. This content will open in a new tab. Do you wish to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-4 mt-6">
            <AlertDialogCancel className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white min-w-[100px]">
              Stay Here
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleOpenManga}
              className="rounded-xl bg-accent hover:bg-accent/90 text-background font-bold min-w-[100px]"
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};