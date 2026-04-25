
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Heart, Stars, ArrowLeft, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PlansPage() {
  const sideImage = "https://wallpapercave.com/wp/wp12944056.jpg";
  const videoUrl = "https://motionbgs.com/media/1980/hinata-hyuga-with-naruto.960x540.mp4";

  return (
    <main className="h-screen w-full overflow-hidden relative bg-black">
      <Navbar />
      
      {/* Live Wallpaper Background Video - Full Screen & Looping */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <video
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 scale-105"
          style={{ filter: 'brightness(0.6) contrast(1.1) saturate(1.2)' }}
        />
        
        {/* Immersive Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        
        {/* Left Side Content - Specific Side Image with Floating Effect */}
        <div className="hidden lg:flex w-1/3 h-full items-center justify-center p-12">
          <div className="relative w-full h-[70vh] rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] animate-in slide-in-from-left-20 duration-1000">
            <Image 
              src={sideImage}
              alt="Our Story"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl">
                <Sparkles className="text-white" size={24} />
              </div>
              <span className="text-white font-headline font-bold text-2xl tracking-tighter">Our Journey</span>
            </div>
          </div>
        </div>

        {/* Right Side / Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-16 max-w-5xl">
          <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-right-20 duration-1000">
            
            <header className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full backdrop-blur-3xl shadow-2xl">
                <Stars size={14} className="text-indigo-400 animate-pulse" />
                <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white/80">Eternity Manifested</span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-headline font-bold text-white tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                Our <span className="text-indigo-400">Plans</span>
              </h1>
            </header>

            <div className="relative group">
              <div className="absolute -top-12 sm:-top-16 -left-8 sm:-left-12 text-indigo-500/5 transition-transform group-hover:scale-110 duration-1000 pointer-events-none">
                <Heart size={150} fill="currentColor" className="sm:size-[200px]" />
              </div>
              <p className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-light text-white leading-[1.3] sm:leading-[1.2] italic tracking-tight relative z-10 max-w-3xl drop-shadow-2xl">
                "Muje ni pta ki mei agle hi pal rahu ya na par mei tumhe aapni aakhri saans tak sachhe dil se pyaar krugi. I always love you Abhi♥."
              </p>
            </div>

            <footer className="pt-8 sm:pt-12 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
              <Link href="/love">
                <button className="h-16 sm:h-20 px-8 sm:px-12 rounded-2xl sm:rounded-[2rem] bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-3xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group">
                  <ArrowLeft className="text-white group-hover:-translate-x-2 transition-transform" size={20} />
                  <span className="text-white font-bold tracking-[0.2em] uppercase text-[10px] sm:text-xs">Return to Abhi</span>
                </button>
              </Link>
            </footer>
          </div>
        </div>

        {/* Mobile View Visual (Small floating polaroid style) - Adjusted for responsiveness */}
        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:hidden w-24 h-36 sm:w-36 sm:h-52 rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl rotate-[6deg] opacity-60 sm:opacity-100 transition-opacity pointer-events-none">
           <Image 
              src={sideImage}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-indigo-500/10 mix-blend-overlay" />
        </div>
      </div>
    </main>
  );
}
