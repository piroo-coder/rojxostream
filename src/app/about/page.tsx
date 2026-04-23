
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

          {/* Minimalist Social Stats */}
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

          {/* Hobbies Grid - Compact with Hover Descriptions */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {hobbies.map((hobby) => (
              <Card 
                key={hobby.name} 
                className="bg-white/5 border-white/10 backdrop-blur-xl transition-all duration-500 group cursor-default relative overflow-hidden h-32"
              >
                <CardContent className="p-4 flex flex-col items-center gap-2 h-full justify-center transition-all duration-500 group-hover:scale-90 group-hover:blur-sm">
                  <hobby.icon className={`${hobby.color}`} size={24} />
                  <span className="font-headline font-bold text-xs text-white/80 uppercase tracking-widest">
                    {hobby.name}
                  </span>
                </CardContent>

                {/* Description Hover Overlay */}
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-3 text-center">
                   <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-md rounded-xl border border-pink-500/20" />
                   <p className="relative z-20 text-[10px] text-white font-medium italic leading-tight drop-shadow-md">
                    {hobby.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* The Aim Card - With Calm Love Animation */}
          <div className="w-full max-w-xl mt-8 p-10 rounded-[2.5rem] bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-white/10 shadow-2xl group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />
            
            {/* Drifting Hearts Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-40">
              <Heart className="absolute top-4 left-10 text-pink-500/20 animate-pulse delay-150" size={24} fill="currentColor" />
              <Heart className="absolute bottom-6 right-12 text-purple-500/20 animate-pulse delay-500" size={16} fill="currentColor" />
              <Heart className="absolute top-1/2 left-1/4 text-pink-400/10 animate-pulse delay-700" size={20} fill="currentColor" />
            </div>
            
            <h3 className="text-sm font-headline font-black flex items-center justify-center gap-3 text-pink-400/60 mb-6 uppercase tracking-[0.4em]">
              <Stars size={16} />
              My Aim
            </h3>
            
            <div className="relative z-10 flex flex-col items-center">
              <p className="text-3xl md:text-4xl font-headline font-extrabold text-white leading-tight tracking-tighter">
                To spread <span className="text-pink-500 animate-pulse">lovee ♥</span>
              </p>
              
              {/* Subtle Realaxing Bounce Icon */}
              <div className="mt-6 text-pink-500/30 animate-bounce duration-[3000ms]">
                <Heart size={32} />
              </div>
            </div>
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
