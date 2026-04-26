"use client";

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Send, User, LogOut, Lock, Sparkles, PenTool } from 'lucide-react';
import { getChatState, sendMessage, updatePresence, setTypingStatus, ChatMessage } from '@/app/actions/chat-actions';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [user, setUser] = useState<'Abhi' | 'Priya' | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Sync scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isOtherTyping]);

  // Handle initialization and polling
  useEffect(() => {
    const savedUser = localStorage.getItem('chat_user');
    if (savedUser === 'Abhi' || savedUser === 'Priya') {
      setUser(savedUser as 'Abhi' | 'Priya');
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const sync = async () => {
      try {
        const state = await getChatState(user);
        setMessages(state.messages);
        setIsOtherOnline(state.isOtherOnline);
        setIsOtherTyping(state.isOtherTyping);
      } catch (err) {
        console.error("Archive sync heartbeat failed.");
      }
    };

    sync();
    pollingRef.current = setInterval(sync, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const uname = username.trim();
    const pword = password.trim();

    if (uname === 'priyu_abhi' && pword === 'abhi') {
      setUser('Abhi');
      localStorage.setItem('chat_user', 'Abhi');
    } else if (uname === 'priyu_abhi' && pword === 'priya_kaur') {
      setUser('Priya');
      localStorage.setItem('chat_user', 'Priya');
    } else {
      setLoginError('Portal access denied. Check coordinates.');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('chat_user');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!user) return;

    setTypingStatus(user, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setTypingStatus(user, false);
    }, 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !user || isSending) return;

    setIsSending(true);
    setInputText('');

    // Optimistic Update
    const tempId = Math.random().toString();
    const optimisticMsg: ChatMessage = {
      id: tempId,
      sender: user,
      text: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await sendMessage(user, text);
      if (!res.success) throw new Error();
      
      // Refresh state to confirm message landed
      const state = await getChatState(user);
      setMessages(state.messages);
    } catch (err) {
      toast({ 
        title: "Transmission Failed", 
        description: "Echo could not be saved to archive.", 
        variant: "destructive" 
      });
      // Revert optimism
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setInputText(text);
    } finally {
      setIsSending(false);
      setTypingStatus(user, false);
    }
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
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Identity Yourself</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <Input 
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all placeholder:text-white/20"
                    required
                  />
                  <Input 
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl focus:bg-white/10 transition-all placeholder:text-white/20"
                    required
                  />
                </div>
                {loginError && <p className="text-destructive text-center text-xs font-bold uppercase">{loginError}</p>}
                <Button type="submit" className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-lg shadow-2xl">
                  Establish Link
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col max-w-5xl w-full mx-auto p-4 md:p-8 overflow-hidden">
        {/* Header */}
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
              <p className="text-[9px] uppercase font-black tracking-widest text-white/40">
                {isOtherOnline ? `${user === 'Abhi' ? 'Priya' : 'Abhi'} is Online` : 'Offline (History Saved)'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full h-12 w-12 hover:bg-destructive/20 text-white/40">
            <LogOut size={20} />
          </Button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 scroll-smooth scrollbar-hide"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 select-none">
              <Sparkles size={64} className="mb-4" />
              <p className="text-xs uppercase font-black tracking-[0.5em]">Archive is empty</p>
            </div>
          )}
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={cn(
                "flex flex-col max-w-[85%] md:max-w-[75%] animate-in slide-in-from-bottom-2 duration-300",
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
          ))}
          
          {/* Typing Indicator */}
          {isOtherTyping && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl w-fit animate-in fade-in slide-in-from-left-2 duration-300">
              <PenTool size={12} className="text-accent animate-bounce" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                {user === 'Abhi' ? 'Priya' : 'Abhi'} is typing...
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-2 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-3xl flex items-center gap-2 shadow-2xl">
          <Input 
            placeholder="Whisper to the archive..."
            value={inputText}
            onChange={handleInputChange}
            disabled={isSending}
            autoComplete="off"
            className="flex-1 h-14 bg-transparent border-0 focus-visible:ring-0 text-white placeholder:text-white/20 text-base"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isSending || !inputText.trim()}
            className="h-12 w-12 rounded-2xl bg-accent hover:bg-accent/80 text-background shadow-xl transition-all active:scale-90"
          >
            <Send size={20} />
          </Button>
        </form>
      </div>
    </main>
  );
}
