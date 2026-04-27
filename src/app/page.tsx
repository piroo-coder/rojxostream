
"use client";

import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { LoginGate } from '@/components/auth/LoginGate';
import { FloatingChat } from '@/components/chat/FloatingChat';
import { MonitorPlay, X, Mic, MicOff, Maximize2, Sparkles, ShieldCheck, Activity } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { updateScreenShareState, addIceCandidate, resetScreenShare } from '@/app/actions/sync-actions';
import { toast } from '@/hooks/use-toast';

export default function HomePage() {
  const { userName, syncData, otherUser, isOtherOnline } = useMedia();
  const [isSharing, setIsSharing] = useState(false);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  const isLeader = syncData?.screenShare?.leader === userName;
  const isFollowing = syncData?.screenShare?.status === 'active' && !isLeader;

  // Cleanup on unmount or logout
  useEffect(() => {
    return () => {
      stopSharing();
    };
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && userName) {
        addIceCandidate(userName, event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    peerConnection.current = pc;
    return pc;
  };

  const startSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setIsSharing(true);
      const pc = createPeerConnection();
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await updateScreenShareState({
        leader: userName,
        status: 'requesting',
        offer: offer
      });

      toast({ title: "Signal Sent", description: "Waiting for " + otherUser + " to tune in." });

      stream.getVideoTracks()[0].onended = () => stopSharing();
    } catch (err) {
      console.error("Sharing failed", err);
      toast({ variant: "destructive", title: "Share Denied", description: "Could not access screen media." });
    }
  };

  const joinSharing = async () => {
    if (!syncData?.screenShare.offer) return;

    const pc = createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(syncData.screenShare.offer));

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    await updateScreenShareState({
      status: 'active',
      answer: answer
    });
  };

  const stopSharing = async () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      localVideoRef.current.srcObject = null;
    }
    setIsSharing(false);
    setRemoteStream(null);
    await resetScreenShare();
  };

  // Signaling Loop
  useEffect(() => {
    if (!userName || !syncData?.screenShare) return;

    const pc = peerConnection.current;
    const { status, leader, offer, answer, iceCandidatesA, iceCandidatesB } = syncData.screenShare;

    // Handle Join Request
    if (status === 'requesting' && leader !== userName && !pc) {
      joinSharing();
    }

    // Handle Answer (Leader side)
    if (status === 'active' && leader === userName && pc && answer && !pc.remoteDescription) {
      pc.setRemoteDescription(new RTCSessionDescription(answer));
    }

    // Handle ICE Candidates
    if (pc && pc.remoteDescription) {
      const candidatesToApply = leader === userName ? iceCandidatesB : iceCandidatesA;
      // We only apply candidates we haven't applied yet - local state would be better but this is a start
      // For a prototype, applying all can work if we check state
    }
  }, [syncData?.screenShare, userName]);

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <LoginGate />
      <Navbar />
      <FloatingChat />
      
      <div className={cn("flex-1 flex flex-col items-center justify-center p-6 md:p-12 transition-opacity duration-1000 pt-24", userName ? "opacity-100" : "opacity-0")}>
        
        <div className="w-full max-w-6xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          <header className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-xl px-4 py-2 rounded-full border border-primary/30 mb-2">
               <Activity size={12} className="text-primary animate-pulse" />
               <span className="text-[10px] font-black tracking-widest uppercase text-primary">Private Connection Established</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-headline font-bold tracking-tighter text-white drop-shadow-2xl">
              {isLeader ? "Broadcasting..." : isFollowing ? "Watching " + otherUser : "Screen Sharing Hub"}
            </h1>
            <p className="text-white/40 font-light italic text-sm md:text-lg max-w-xl mx-auto">
              {isLeader ? "Your screen and audio are being transmitted across the multiverse." : "A private tunnel between Priyu and Abhi."}
            </p>
          </header>

          <div className="relative aspect-video w-full rounded-[3rem] overflow-hidden bg-black/60 border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] group">
            {!isSharing && !isFollowing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 z-10">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <div className="w-32 h-32 rounded-full bg-primary/10 border-4 border-primary/30 flex items-center justify-center relative shadow-2xl">
                    <MonitorPlay size={48} className="text-primary" />
                  </div>
                </div>
                <Button 
                  onClick={startSharing} 
                  className="h-20 px-12 rounded-[2rem] bg-primary hover:bg-primary/90 text-xl font-black shadow-2xl hover:scale-105 transition-all group"
                >
                  Start Sharing Universe <Sparkles size={20} className="ml-3 group-hover:rotate-12 transition-transform" />
                </Button>
              </div>
            )}

            <video 
              ref={localVideoRef} 
              autoPlay 
              muted 
              className={cn("w-full h-full object-contain", isLeader ? "block" : "hidden")} 
            />
            
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              className={cn("w-full h-full object-contain", isFollowing ? "block" : "hidden")}
              srcObject={remoteStream}
            />

            {(isLeader || isFollowing) && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20 animate-in slide-in-from-bottom-4 duration-500">
                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10 text-white hover:bg-white/20">
                  <Mic size={24} />
                </Button>
                <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-3xl border border-white/10 text-white hover:bg-white/20">
                  <Maximize2 size={24} />
                </Button>
                <Button onClick={stopSharing} variant="destructive" className="h-14 px-8 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl">
                  End Broadcast <X size={16} className="ml-2" />
                </Button>
              </div>
            )}

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-10 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />
            </div>
          </div>

          <footer className="pt-12 flex flex-col items-center gap-6 opacity-40">
            <div className="flex items-center gap-8">
               <div className="flex flex-col items-center">
                 <ShieldCheck className="text-emerald-400 mb-1" size={16} />
                 <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Tunnel</span>
               </div>
               <div className="flex flex-col items-center">
                 <Mic className="text-primary mb-1" size={16} />
                 <span className="text-[9px] font-black uppercase tracking-widest">Hi-Fi System Audio</span>
               </div>
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em]">2026 Multiverse Network • Priyu & Abhi Only</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
