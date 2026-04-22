
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { Heart, Music, Code, Gamepad2, Stars, Sparkles, MessageSquareHeart } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const profileImage = PlaceHolderImages.find(img => img.id === 'priya-profile')?.imageUrl || "https://i.pinimg.com/736x/04/4d/26/044d2642935fb665c6cd6bb72e06b264.jpg";

  const hobbies = [
    { name: 'Chess', icon: Gamepad2, color: 'text-blue-400' },
    { name: 'Coding', icon: Code, color: 'text-emerald-400' },
    { name: 'Dancing', icon: Sparkles, color: 'text-pink-400' },
    { name: 'Singing', icon: Music, color: 'text-purple-400' },
  ];

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 overflow-x-hidden relative">
      <Navbar />
      
      {/* Romantic Background Elements */}
      <div className="absolute top-40 left-10 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="flex flex-col items-center text-center space-y-12">
          
          {/* Profile Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-primary rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <Image 
                src={profileImage}
                alt="Priya - Hinata"
                fill
                className="object-cover"
                data-ai-hint="hinata cute"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-pink-500 p-3 rounded-2xl shadow-xl animate-bounce">
              <Heart className="text-white fill-current" size={24} />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-headline font-bold tracking-tighter text-white">
              Priya
            </h1>
            <Badge variant="outline" className="px-6 py-2 rounded-full border-pink-500/30 text-pink-400 font-bold tracking-widest uppercase">
              Dreamer • Creator • Lover
            </Badge>
          </div>

          {/* About Text */}
          <div className="max-w-2xl">
            <p className="text-2xl font-light text-white/70 italic leading-relaxed">
              "just a little girl with big dreams and a heart full of stories."
            </p>
          </div>

          {/* Hobbies Grid */}
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {hobbies.map((hobby) => (
              <Card key={hobby.name} className="bg-white/5 border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 group cursor-default">
                <CardContent className="p-6 flex flex-col items-center gap-3">
                  <hobby.icon className={`${hobby.color} group-hover:scale-125 transition-transform duration-500`} size={32} />
                  <span className="font-headline font-semibold text-lg">{hobby.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* The Aim Card */}
          <div className="w-full max-w-xl mt-12 p-10 rounded-[3rem] bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 shadow-inner group relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/40 transition-all duration-700" />
            
            <h3 className="text-2xl font-headline font-bold flex items-center justify-center gap-3 text-pink-400 mb-6">
              <Stars size={28} />
              My Aim
            </h3>
            
            <p className="text-3xl md:text-4xl font-headline font-extrabold text-white leading-tight">
              To spread <span className="text-pink-500 animate-pulse">lovee ♥</span>
            </p>
            
            <div className="mt-10 flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <MessageSquareHeart key={i} className={`text-pink-500/30 animate-pulse`} style={{ animationDelay: `${i * 200}ms` }} size={20} />
              ))}
            </div>
          </div>

          {/* Footer Quote */}
          <div className="pt-20 opacity-40 text-sm uppercase tracking-[0.5em] font-bold">
            Crafted with Love & Code
          </div>
        </div>
      </div>
    </main>
  );
}
