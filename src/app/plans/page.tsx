
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Heart, Stars, ArrowLeft, Sparkles, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PlansPage() {
  const sideImage = "https://wallpapercave.com/wp/wp12944056.jpg";
  // Aesthetic background video URL
  const bgVideo = "https://cdn.pixabay.com/video/2021/08/04/83901-584742466_tiny.mp4";

  return (
    <main className="h-screen w-full overflow-hidden relative bg-black">
      <Navbar />
      
      {/* Live Wallpaper Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-60 scale-105"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        {/* Immersive Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex h-full w-full">
        
        {/* Left Side Content - Specific Side Image */}
        <div className="hidden lg:flex w-1/3 h-full items-center justify-center p-12">
          <div className="relative w-full h-[70vh] rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl animate-in slide-in-from-left-20 duration-1000">
            <Image 
              src={sideImage}
              alt="Our Story"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-10 left-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-xl shadow-xl">
                  <Sparkles className="text-white" size={20} />
                </div>
                <span className="text-white font-headline font-bold text-xl tracking-tight">Our Journey</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side / Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-12 max-w-4xl">
          <div className="space-y-12 animate-in fade-in slide-in-from-right-20 duration-1000">
            
            <header className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-indigo-500/20 border border-indigo-500/30 px-6 py-2 rounded-full backdrop-blur-3xl shadow-2xl">
                <Stars size={16} className="text-indigo-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white">Eternity Manifested</span>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline font-bold text-white tracking-tighter leading-none drop-shadow-2xl">
                Our <span className="text-indigo-400">Plans</span>
              </h1>
            </header>

            <div className="relative">
              <div className="absolute -top-12 -left-8 text-indigo-500/10" size={160}>
                <Heart size={160} fill="currentColor" />
              </div>
              <p className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-tight italic tracking-tight relative z-10 max-w-3xl drop-shadow-lg">
                "Muje ni pta ki mei agle hi pal rahu ya na par mei tumhe aapni aakhri saans tak sachhe dil se pyaar krugi. I always love you Abhi♥."
              </p>
            </div>

            <footer className="pt-12 flex flex-col sm:flex-row items-center gap-8">
              <Link href="/love">
                <button className="h-16 px-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-3xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group">
                  <ArrowLeft className="text-white group-hover:-translate-x-2 transition-transform" />
                  <span className="text-white font-bold tracking-widest uppercase text-xs">Return to Abhi</span>
                </button>
              </Link>
              
              <div className="flex items-center gap-4 opacity-40">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-spin-slow">
                  <Play size={16} className="text-white ml-1" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Wallpaper</span>
                  <span className="text-[10px] text-white/50">Our Infinite Loop</span>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Mobile View Image (Only visible on small screens) */}
        <div className="absolute bottom-10 right-10 lg:hidden w-32 h-48 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-3">
           <Image 
              src={sideImage}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
        </div>
      </div>
    </main>
  );
}
