
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Heart, Stars, ArrowLeft, Sparkles, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PlansPage() {
  const sideImage = "https://wallpapercave.com/wp/wp12944056.jpg";
  // A high-quality, aesthetic cinematic background video
  const bgVideo = "https://cdn.pixabay.com/video/2021/08/04/83901-584742466_tiny.mp4";

  return (
    <main className="h-screen w-full overflow-hidden relative bg-black">
      <Navbar />
      
      {/* Live Wallpaper Background Video - Full Screen & Looping */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        
        {/* Immersive Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        
        {/* Subtle animated light patches */}
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse-slow" />
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
        <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-16 max-w-5xl">
          <div className="space-y-12 animate-in fade-in slide-in-from-right-20 duration-1000">
            
            <header className="space-y-6">
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 px-6 py-2 rounded-full backdrop-blur-3xl shadow-2xl">
                <Stars size={16} className="text-indigo-400 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-[0.5em] text-white/80">Eternity Manifested</span>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-headline font-bold text-white tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                Our <span className="text-indigo-400">Plans</span>
              </h1>
            </header>

            <div className="relative group">
              <div className="absolute -top-16 -left-12 text-indigo-500/5 transition-transform group-hover:scale-110 duration-1000">
                <Heart size={200} fill="currentColor" />
              </div>
              <p className="text-2xl md:text-4xl lg:text-5xl font-light text-white leading-[1.2] italic tracking-tight relative z-10 max-w-3xl drop-shadow-2xl">
                "Muje ni pta ki mei agle hi pal rahu ya na par mei tumhe aapni aakhri saans tak sachhe dil se pyaar krugi. I always love you Abhi♥."
              </p>
            </div>

            <footer className="pt-12 flex flex-col sm:flex-row items-center gap-10">
              <Link href="/love">
                <button className="h-20 px-12 rounded-[2rem] bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-3xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 group">
                  <ArrowLeft className="text-white group-hover:-translate-x-2 transition-transform" />
                  <span className="text-white font-bold tracking-[0.2em] uppercase text-xs">Return to Abhi</span>
                </button>
              </Link>
              
              <div className="flex items-center gap-5 opacity-50">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center animate-spin-slow">
                    <Play size={18} className="text-white ml-1" />
                  </div>
                  <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-indigo-500/30 animate-ping opacity-20" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Wallpaper</span>
                  <span className="text-[10px] text-white/50">Continuous Looping Eternity</span>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* Mobile View Visual (Small floating polaroid style) */}
        <div className="absolute bottom-8 right-8 lg:hidden w-36 h-52 rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-[6deg] animate-bounce-slow">
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
