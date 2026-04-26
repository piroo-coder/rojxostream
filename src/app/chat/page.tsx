"use client";

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, User, LogOut, MessageSquare, Lock, ShieldCheck, Sparkles, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { getChatState, sendMessage, updatePresence, ChatMessage } from '@/app/actions/chat-actions';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ChatPage() {
  const [user, setUser] = useState<'Abhi' | 'Priya' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Polling for State and Presence
  useEffect(() => {
    if (!user) return;

    const syncChat = async () => {
      // Update our own presence
      await updatePresence(user);
      
      // Get global chat state
      const state = await getChatState(user);
      setMessages(state.messages);
      setIsOtherOnline(state.isOtherOnline);
    };

    syncChat();
    const interval = setInterval(syncChat, 3000); // Sync every 3 seconds
    return () => clearInterval(interval);
  }, [user]);

  // Persistent login check
  useEffect(() => {
    const savedUser = localStorage.getItem('chat_user');
    if (savedUser === 'Abhi' || savedUser === 'Priya') {
      setUser(savedUser as 'Abhi' | 'Priya');
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'priyu_abhi' && password === 'abhi') {
      setUser('Abhi');
      localStorage.setItem('chat_user', 'Abhi');
      setLoginError('');
    } else if (username === 'priyu_abhi' && password === 'priya_kaur') {
      setUser('Priya');
      localStorage.setItem('chat_user', 'Priya');
      setLoginError('');
    } else {
      setLoginError('Invalid dimensional coordinates.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chat_user');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || isSending || !isOtherOnline) return;

    setIsSending(true);
    const result = await sendMessage(user, inputText);
    if (result.success) {
      setInputText('');
      const state = await getChatState(user);
      setMessages(state.messages);
    } else if (result.error) {
      alert(result.error);
    }
    setIsSending(false);
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-background relative flex items-center justify-center p-6 overflow-hidden">
        <Navbar />
        
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images8.alphacoders.com/744/thumb-1920-744721.png"
            alt=""
            fill
            className="object-cover opacity-40 blur-sm"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-700">
          <Card className="bg-white/5 border-white/10 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl overflow-hidden">
            <CardContent className="p-10 space-y-8">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Lock className="text-primary" size={32} />
                </div>
                <h2 className="text-3xl font-headline font-bold text-white tracking-tighter">Secure Portal</h2>
                <p className="text-white/40 text-xs font-black uppercase tracking-widest">Identify Yourself to Enter</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={18} />
                    <Input 
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all placeholder:text-white/20"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" size={18} />
                    <Input 
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 pl-12 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all placeholder:text-white/20"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <p className="text-destructive text-xs font-bold text-center uppercase tracking-widest bg-destructive/10 py-2 rounded-xl border border-destructive/20">
                    {loginError}
                  </p>
                )}

                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-lg shadow-2xl transition-all active:scale-95">
                  Access Live Session
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-background relative flex flex-col pt-16 md:pt-20 overflow-hidden">
      <Navbar />
      
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images8.alphacoders.com/744/thumb-1920-744721.png"
          alt=""
          fill
          className="object-cover opacity-50"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 md:p-8 overflow-hidden">
        {/* Chat Header with Online Status */}
        <div className="flex items-center justify-between mb-6 p-4 md:p-6 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2rem] shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center shadow-xl">
                <User className="text-accent" />
              </div>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                isOtherOnline ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"
              )} />
            </div>
            <div>
              <h3 className="text-xl font-headline font-bold text-white tracking-tight flex items-center gap-2">
                {user} <Sparkles className="text-accent" size={14} />
              </h3>
              <div className="flex items-center gap-1.5">
                {isOtherOnline ? (
                  <span className="flex items-center gap-1 text-[9px] uppercase font-black tracking-widest text-emerald-400">
                    <Wifi size={10} /> {user === 'Abhi' ? 'Priya' : 'Abhi'} is Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[9px] uppercase font-black tracking-widest text-white/30">
                    <WifiOff size={10} /> Waiting for {user === 'Abhi' ? 'Priya' : 'Abhi'}...
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="rounded-full h-12 w-12 hover:bg-destructive/20 hover:text-destructive text-white/40"
          >
            <LogOut size={20} />
          </Button>
        </div>

        {/* Messages Area / Offline State */}
        {!isOtherOnline ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
            <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
              <Loader2 size={48} className="text-white/20 animate-spin" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-headline font-bold text-white">Searching for Connection</h4>
              <p className="text-white/40 text-sm max-w-xs mx-auto italic">
                "Real-time session is only active when both souls are present in the portal."
              </p>
            </div>
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 scroll-smooth scrollbar-hide mask-fade-top"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                <MessageSquare size={48} className="text-white" />
                <p className="text-sm font-black uppercase tracking-[0.4em] text-white">Session Started</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[80%] md:max-w-[70%] animate-in slide-in-from-bottom-2 duration-300",
                    msg.sender === user ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "px-6 py-4 rounded-[1.75rem] text-sm md:text-base shadow-xl",
                    msg.sender === user 
                      ? "bg-primary text-white rounded-tr-sm" 
                      : "bg-white/10 backdrop-blur-3xl text-white border border-white/10 rounded-tl-sm"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-white/20 mt-1.5 px-2">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Input Area (Disabled when offline) */}
        <form onSubmit={handleSendMessage} className={cn(
          "p-2 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-3xl flex items-center gap-2 shadow-2xl transition-all duration-500",
          !isOtherOnline && "opacity-20 pointer-events-none grayscale"
        )}>
          <Input 
            placeholder={isOtherOnline ? "Whisper to the soul..." : "Establishing link..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isSending || !isOtherOnline}
            className="flex-1 h-14 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/20 text-base"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSending || !inputText.trim() || !isOtherOnline}
            className="h-12 w-12 rounded-2xl bg-accent hover:bg-accent/80 text-background transition-all active:scale-90 shadow-xl"
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </main>
  );
}
