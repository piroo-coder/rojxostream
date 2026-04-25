
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Heart, Stars, ArrowRight, ShieldCheck, Sparkles, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LovePage() {
  const abhiImage = "https://wallpapers.com/images/featured/naruto-face-hpracgzord0mm3tv.jpg";

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 overflow-hidden relative">
      <Navbar />
      
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-blue-500/5 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[5%] right-[5%] w-[45rem] h-[45rem] bg-indigo-500/5 rounded-full blur-[160px] animate-pulse-slow delay-700" />
      </div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Profile Header */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-1000" />
            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white/5 shadow-2xl">
              <Image 
                src={abhiImage}
                alt="Abhi"
                fill
                sizes="(max-width: 768px) 192px, 224px"
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-3 rounded-2xl shadow-xl">
              <ShieldCheck className="text-white" size={24} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-headline font-bold tracking-tighter text-white drop-shadow-2xl">
              Abhi
            </h1>
            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 text-white/40 text-[10px] uppercase font-black tracking-widest">
              <Sparkles size={12} className="text-indigo-400" />
              The Light of My Life
            </div>
          </div>

          {/* Love Description Card */}
          <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-[3rem] overflow-hidden p-8 md:p-12 shadow-2xl">
              <CardContent className="p-0 space-y-8">
                <div className="relative">
                  <Heart className="absolute -top-10 -left-10 text-pink-500/10" size={120} fill="currentColor" />
                  <p className="text-3xl md:text-4xl font-headline font-bold text-white leading-tight tracking-tight italic relative z-10">
                    "Mera payara abhi. Mei hamesa tumse hi pyaar krna chaugi."
                  </p>
                </div>
                
                <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                  <Link href="/plans">
                    <Button className="h-16 px-12 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-xl font-bold shadow-2xl shadow-indigo-500/20 group transition-all hover:scale-105 active:scale-95 text-white">
                      Our Plans <ArrowRight size={24} className="ml-3 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
                    Building our eternity
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="pt-12">
            <Link href="/about" className="text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-2">
              <User size={14} /> Back to Priya
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
