"use client";

import { useState } from 'react';
import { useMedia } from '@/context/MediaContext';
import { Lock, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

const CREDENTIALS = {
  Priyu: 'priyakaur',
  Abhi: 'abhi'
};

export const LoginGate = () => {
  const { userName, setUserName } = useMedia();
  const [inputName, setInputName] = useState('');
  const [inputPass, setInputPass] = useState('');
  const [loading, setLoading] = useState(false);

  if (userName) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = Object.keys(CREDENTIALS).find(k => k.toLowerCase() === inputName.toLowerCase());
    if (user && CREDENTIALS[user as keyof typeof CREDENTIALS] === inputPass) {
      setTimeout(() => {
        setUserName(user);
        toast({ title: `Welcome back, ${user}!`, description: "The Multiverse is now unlocked." });
        setLoading(false);
      }, 1000);
    } else {
      toast({ 
        variant: "destructive", 
        title: "Access Denied", 
        description: "Your dimensional key is invalid." 
      });
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6 animate-in fade-in duration-1000 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images8.alphacoders.com/744/thumb-1920-744721.png"
          alt=""
          fill
          className="object-cover opacity-20 blur-xl scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 duration-700">
        <Card className="bg-white/5 border-white/10 backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden border">
          <CardContent className="p-10 sm:p-12 space-y-10">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                <Lock className="text-primary" size={28} />
              </div>
              <h2 className="text-3xl font-headline font-bold text-white tracking-tighter">Identity Verification</h2>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">Multiverse Security Protocol</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <Input 
                  placeholder="Username"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl placeholder:text-white/20 text-center font-bold"
                  required
                />
                <Input 
                  type="password"
                  placeholder="Dimensional Key"
                  value={inputPass}
                  onChange={(e) => setInputPass(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl placeholder:text-white/20 text-center font-bold"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-2xl group transition-all">
                {loading ? "Decrypting..." : "Unlock Multiverse"}
                {!loading && <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>

            <div className="pt-4 flex items-center justify-center gap-2 opacity-30">
               <ShieldCheck size={14} className="text-emerald-400" />
               <span className="text-[8px] font-black uppercase tracking-widest text-white">Encrypted Local Sync Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
