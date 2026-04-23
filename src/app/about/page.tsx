
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Heart, Music, Code, Gamepad2, Stars, Sparkles, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const profileImage = PlaceHolderImages.find(img => img.id === 'priya-profile')?.imageUrl || "https://i.pinimg.com/736x/04/4d/26/044d2642935fb665c6cd6bb72e06b264.jpg";

  const hobbies = [
    { 
      name: 'Chess', 
      icon: Gamepad2, 
      color: 'text-blue-400',
      description: 'very fond of chess, i just feel good'
    },
    { 
      name: 'Coding', 
      icon: Code, 
      color: 'text-emerald-400',
      description: 'really , its just i get lost in to and hours feels like seconds'
    },
    { 
      name: 'Dancing', 
      icon: Sparkles, 
      color: 'text-pink-400',
      description: 'just to be free from everything'
    },
    { 
      name: 'Singing', 
      icon: Music, 
      color: 'text-purple-400',
      description: 'can sing quite well , i guess so , but shy '
    },
  ];

  const socialStats = [
    { platform: 'Instagram', icon: Instagram, count: '2.5k', color: 'text-pink-400' },
    { platform: 'YouTube', icon: Youtube, count: '8', color: 'text-red-400' },
    { platform: 'Facebook', icon: Facebook, count: '2.1k', color: 'text-blue-500' },
    { platform: 'Twitter', icon: Twitter, count: '1k', color: 'text-blue-400' },
  ];

  return (
    <main className="min-h-screen bg-background pt-24 pb-20 overflow-hidden relative">
      <Navbar />
      
      {/* Calm & Romantic Background Animations */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Ambient Pulsing Blobs */}
        <div className="absolute top-[5%] left-[10%] w-[45rem] h-[45rem] bg-pink-500/10 rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[10%] right-[10%] w-[55rem] h-[55rem] bg-purple-500/10 rounded-full blur-[160px] animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow delay-500" />
        
        {/* Drifting Bokeh Sparkles */}
        <div className="absolute top-[15%] right-[25%] w-4 h-4 bg-pink-400/30 rounded-full blur-md animate-bounce duration-[15s] infinite" />
        <div className="absolute bottom-[25%] left-[20%] w-6 h-6 bg-purple-400/20 rounded-full blur-lg animate-pulse duration-[8s] infinite delay-1000" />
        
        {/* Subtle Star Particles */}
        <div className="absolute top-[10%] left-[40%] text-pink-500/20 animate-pulse">
          <Stars size={40} />
        </div>
      </div>
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Profile Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-primary rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000" />
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <Image 
                src={profileImage}
                alt="Priya"
                fill
                sizes="160px"
                className="object-cover"
                data-ai-hint="hinata cute"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-pink-500 p-2 rounded-xl shadow-xl animate-bounce">
              <Heart className="text-white fill-current" size={18} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-headline font-bold tracking-tighter text-white">
              Priya
            </h1>
            <Badge variant="outline" className="px-4 py-1 rounded-full border-pink-500/30 text-pink-400 font-bold tracking-widest uppercase text-[10px]">
              Dreamer • Creator • Lover
            </Badge>
          </div>

          {/* Social Stats Section - Minimalist */}
          <div className="flex justify-center gap-6 mt-4 w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {socialStats.map((stat) => (
              <div key={stat.platform} className="flex items-center gap-2 group transition-all duration-300 hover:scale-110">
                <div className="relative w-8 h-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-lg group-hover:border-white/30 transition-all">
                  <stat.icon className={`${stat.color}`} size={14} />
                </div>
                <span className="text-sm font-headline font-black tracking-tight text-white/80">
                  {stat.count}
                </span>
              </div>
            ))}
          </div>

          {/* About Text */}
          <div className="max-w-2xl">
            <p className="text-xl font-light text-white/70 italic leading-relaxed">
              "just a little girl with big dreams and a heart full of stories."
            </p>
          </div>

          {/* Hobbies Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {hobbies.map((hobby) => (
              <Card 
                key={hobby.name} 
                className="bg-white/5 border-white/10 backdrop-blur-xl transition-all duration-500 group cursor-default relative overflow-hidden h-full"
              >
                <CardContent className="p-6 flex flex-col items-center gap-3 h-full min-h-[140px] justify-center transition-all duration-500 group-hover:scale-90 group-hover:blur-sm">
                  <hobby.icon className={`${hobby.color}`} size={32} />
                  <span className="font-headline font-bold text-base text-white/80">
                    {hobby.name}
                  </span>
                </CardContent>

                {/* Translucent Hover Overlay Box */}
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-4 text-center">
                   <div className="absolute inset-2 bg-pink-500/20 backdrop-blur-md rounded-2xl border border-pink-500/30 shadow-xl" />
                   <p className="relative z-20 text-[11px] text-white font-medium italic leading-relaxed drop-shadow-md">
                    {hobby.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* The Aim Card */}
          <div className="w-full max-w-xl mt-8 p-8 rounded-[2.5rem] bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 shadow-inner group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl" />
            
            <h3 className="text-xl font-headline font-bold flex items-center justify-center gap-3 text-pink-400 mb-4">
              <Stars size={20} />
              My Aim
            </h3>
            
            <p className="text-2xl md:text-3xl font-headline font-extrabold text-white leading-tight">
              To spread <span className="text-pink-500 animate-pulse">lovee ♥</span>
            </p>
          </div>

          {/* Copyright Footer */}
          <div className="pt-20 pb-10 space-y-2 opacity-30 select-none cursor-default">
            <p className="text-[9px] uppercase tracking-[0.5em] font-bold text-white">
              © 2026 Priya • All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
