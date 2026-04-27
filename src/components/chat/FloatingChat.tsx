"use client";

import { useState, useEffect, useRef } from 'react';
import { useMedia } from '@/context/MediaContext';
import { MessageCircle, Send, X, User, Minus, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendSyncMessage, setTypingStatus } from '@/app/actions/sync-actions';
import { cn } from '@/lib/utils';

export const FloatingChat = () => {
  const { userName, syncData, isOtherOnline, isOtherTyping, otherUser } = useMedia();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [syncData?.messages, isOtherTyping]);

  if (!userName) return null;

  const handleTyping = () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setTypingStatus(userName, true);
    typingTimer.current = setTimeout(() => {
      setTypingStatus(userName, false);
    }, 2000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const text = message;
    setMessage('');
    if (typingTimer.current) clearTimeout(typingTimer.current);
    await sendSyncMessage(userName, text);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4 pointer-events-none">
      
      {isOpen && !isMinimized && (
        <Card className="w-[320px] sm:w-[380px] h-[550px] bg-background/60 backdrop-blur-3xl border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.5)] rounded-[2.5rem] overflow-hidden border flex flex-col pointer-events-auto animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="p-6 border-b border-white/5 bg-white/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={cn("w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30", isOtherOnline ? "animate-pulse" : "grayscale")}>
                   <User size={20} className="text-primary" />
                </div>
                {isOtherOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-background shadow-xl" />
                )}
              </div>
              <div>
                <CardTitle className="text-base font-headline font-bold">{otherUser}</CardTitle>
                <p className={cn("text-[9px] font-black uppercase tracking-widest", isOtherOnline ? "text-emerald-400" : "text-white/20")}>
                  {isOtherOnline ? "Active in Multiverse" : "Drifting Away"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/40 hover:text-white" onClick={() => setIsMinimized(true)}>
                <Minus size={18} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white/40 hover:text-white" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </Button>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-6" viewportRef={scrollRef}>
            <div className="space-y-4">
              {syncData?.messages.map((msg, i) => (
                <div key={i} className={cn("flex flex-col max-w-[80%]", msg.sender === userName ? "ml-auto items-end" : "items-start")}>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm font-medium shadow-lg",
                    msg.sender === userName ? "bg-primary text-white rounded-tr-none" : "bg-white/10 text-white/90 rounded-tl-none border border-white/5"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-white/20 mt-1 uppercase font-black tracking-widest">{msg.sender === userName ? "You" : msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              ))}
              
              {isOtherTyping && (
                <div className="flex items-center gap-2 animate-in fade-in duration-300">
                   <div className="bg-white/5 px-4 py-2 rounded-full border border-white/5">
                      <span className="text-[10px] text-accent font-black uppercase tracking-widest italic">{otherUser} is whispering...</span>
                   </div>
                </div>
              )}

              {(!syncData?.messages || syncData.messages.length === 0) && (
                <div className="h-40 flex flex-col items-center justify-center text-center opacity-20 italic space-y-3">
                  <Heart size={32} className="text-primary" />
                  <p className="text-xs">No echoes in the archive yet.</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/5 flex gap-3">
            <Input 
              placeholder="Whisper to the multiverse..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              className="h-12 bg-white/5 border-white/10 rounded-2xl text-xs placeholder:text-white/20 focus:bg-white/10 transition-all"
            />
            <Button type="submit" size="icon" className="h-12 w-12 rounded-2xl bg-primary hover:bg-primary/90 flex-shrink-0">
              <Send size={18} />
            </Button>
          </form>
        </Card>
      )}

      {isMinimized && isOpen && (
        <Button 
          className="h-12 px-6 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-2xl text-primary font-bold text-[10px] uppercase tracking-widest shadow-2xl pointer-events-auto animate-in zoom-in-95"
          onClick={() => setIsMinimized(false)}
        >
          <Sparkles size={14} className="mr-2" /> Restore Whispers
        </Button>
      )}

      {!isOpen && (
        <Button 
          size="icon" 
          className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-[0_20px_60px_-15px_rgba(var(--primary),0.5)] transition-all hover:scale-110 active:scale-95 group pointer-events-auto relative"
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        >
          <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
          {isOtherOnline && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>
      )}
    </div>
  );
};
