
"use client";

import { Navbar } from '@/components/layout/Navbar';
import { ShieldAlert, Mail, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DMCAPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20 relative overflow-hidden">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 max-w-3xl relative z-10">
        <header className="text-center mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
            <ShieldAlert className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight">
            DMCA Policy
          </h1>
          <p className="text-white/50 text-lg font-light italic">
            Respecting intellectual property across the multiverse.
          </p>
        </header>

        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 p-8">
              <CardTitle className="text-xl font-headline font-bold text-white flex items-center gap-3">
                <FileText className="text-accent" size={20} />
                Statement of Ownership
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-white/70 leading-relaxed font-body">
              <p>
                This website, <span className="text-white font-bold italic">RojXOStream</span>, is owned and operated by <span className="text-primary font-bold">Priya</span>. We respect the intellectual property rights of others and expect our users to do the same.
              </p>
              <p>
                In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement that are reported to our designated owner.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-xl rounded-[2rem] overflow-hidden shadow-2xl">
            <CardHeader className="border-b border-white/5 p-8">
              <CardTitle className="text-xl font-headline font-bold text-white flex items-center gap-3">
                <ShieldAlert className="text-pink-500" size={20} />
                Takedown Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6 text-white/70 leading-relaxed">
              <p>
                If you are a copyright owner, or are authorized to act on behalf of one, please report alleged copyright infringements taking place on or through the site by contacting <span className="text-white font-bold">Priya</span>.
              </p>
              
              <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  Required Information
                </h4>
                <ul className="text-sm space-y-3 list-disc pl-5">
                  <li>Clear identification of the copyrighted work claimed to have been infringed.</li>
                  <li>Identification of the material that is claimed to be infringing and where it is located on the site (URLs).</li>
                  <li>Your contact information (Email, Phone number).</li>
                  <li><span className="text-white font-bold italic">Crucial:</span> Valid proof of ownership or authorization to act for the owner.</li>
                  <li>A statement that you have a good faith belief that use of the material is not authorized.</li>
                </ul>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                  <Mail className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-black text-white/40">Contact for Takedowns</p>
                  <p className="text-lg font-headline font-bold text-white">Contact Priya directly via social channels.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <footer className="text-center pt-10 pb-20 opacity-30 select-none">
            <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-white">
              Safeguarding Creativity • 2026
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}
