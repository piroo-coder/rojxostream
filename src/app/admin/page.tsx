
"use client";

import { useState } from 'react';
import { useMedia } from '@/context/MediaContext';
import { Navbar } from '@/components/layout/Navbar';
import { generateMediaSummaryAndMoral } from '@/ai/flows/admin-generates-media-summary-and-moral';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Sparkles, Plus, Loader2, Trash2, LayoutDashboard } from 'lucide-react';
import { MediaType } from '@/app/types/media';
import { toast } from '@/hooks/use-toast';

export default function AdminPage() {
  const { library, addToLibrary } = useMedia();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'movie' as MediaType,
    mediaUrl: '',
    thumbnailUrl: '',
    creator: '',
    description: '',
    summary: '',
    moral: '',
    imdbRating: '',
    rottenTomatoesRating: '',
  });

  const handleAiAssist = async () => {
    if (!formData.title && !formData.description) {
      toast({ title: "Missing Information", description: "Provide at least a title or description for AI analysis." });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateMediaSummaryAndMoral({
        mediaContent: `${formData.title}: ${formData.description}`
      });
      setFormData(prev => ({
        ...prev,
        summary: result.summary,
        moral: result.moral
      }));
      toast({ title: "AI Generation Success", description: "Summary and Moral have been populated." });
    } catch (error) {
      toast({ title: "AI Generation Failed", description: "Could not generate content at this time." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
    };
    addToLibrary(newItem);
    toast({ title: "Content Added", description: `${formData.title} has been added to the library.` });
    setFormData({
      title: '',
      type: 'movie',
      mediaUrl: '',
      thumbnailUrl: '',
      creator: '',
      description: '',
      summary: '',
      moral: '',
      imdbRating: '',
      rottenTomatoesRating: '',
    });
  };

  return (
    <main className="min-h-screen pb-20 pt-24 bg-background px-4 md:px-10">
      <Navbar />
      
      <div className="container mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-headline font-bold text-white tracking-tight">Content Studio</h1>
            <p className="text-muted-foreground text-lg font-light">Direct the multiverse. Add new media or manage existing artifacts.</p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-4 rounded-3xl backdrop-blur-xl">
             <LayoutDashboard className="text-accent" />
             <div className="flex flex-col">
               <span className="text-xs uppercase tracking-widest text-white/40 font-black">Library Size</span>
               <span className="text-xl font-headline font-bold">{library.length} Items</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2">
            <Card className="border-white/5 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 p-8 border-b border-white/5">
                <CardTitle className="font-headline text-2xl">Deploy New Universe</CardTitle>
                <CardDescription className="text-base">Fill in the dimensional coordinates. Use AI to refine the narrative.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest font-black text-white/50">Core Title</Label>
                      <Input 
                        placeholder="e.g. Interstellar" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest font-black text-white/50">Media Archetype</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={v => setFormData({...formData, type: v as MediaType})}
                      >
                        <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-background/95 backdrop-blur-3xl border-white/10">
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="song">Song</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs uppercase tracking-widest font-black text-white/50">Portal URL (Direct Content Link)</Label>
                    <Input 
                      placeholder="https://youtube.com/..." 
                      value={formData.mediaUrl} 
                      onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest font-black text-white/50">Thumbnail URL</Label>
                      <Input 
                        placeholder="https://images.unsplash.com/..." 
                        value={formData.thumbnailUrl} 
                        onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-widest font-black text-white/50">{formData.type === 'song' ? 'Singer' : 'Director / Origin'}</Label>
                      <Input 
                        placeholder="Name" 
                        value={formData.creator} 
                        onChange={e => setFormData({...formData, creator: e.target.value})}
                        className="h-14 bg-white/5 border-white/10 rounded-2xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs uppercase tracking-widest font-black text-white/50">Primary Description</Label>
                      {(formData.type === 'movie' || formData.type === 'anime') && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="text-accent hover:text-accent-foreground font-black uppercase text-[10px] tracking-widest"
                          onClick={handleAiAssist}
                          disabled={isGenerating}
                        >
                          {isGenerating ? <Loader2 className="animate-spin mr-2" size={14} /> : <Sparkles className="mr-2" size={14} />}
                          AI Enchant
                        </Button>
                      )}
                    </div>
                    <Textarea 
                      placeholder="The raw narrative of this media..." 
                      rows={3} 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="bg-white/5 border-white/10 rounded-2xl p-4 min-h-[120px]"
                    />
                  </div>

                  {(formData.type === 'movie' || formData.type === 'anime') && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                      <div className="space-y-3">
                        <Label className="text-xs uppercase tracking-widest font-black text-white/50">AI Summary (Chronicle)</Label>
                        <Textarea 
                          value={formData.summary} 
                          onChange={e => setFormData({...formData, summary: e.target.value})}
                          placeholder="Wait for AI assist or craft the chronicle..."
                          rows={4}
                          className="bg-white/5 border-white/10 rounded-2xl p-4 min-h-[140px]"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-3">
                          <Label className="text-xs uppercase tracking-widest font-black text-white/50">The Moral / Essence</Label>
                          <Input 
                            value={formData.moral} 
                            onChange={e => setFormData({...formData, moral: e.target.value})}
                            placeholder="The underlying truth..."
                            className="h-14 bg-white/5 border-white/10 rounded-2xl"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-xs uppercase tracking-widest font-black text-white/50">IMDb Grade</Label>
                          <Input 
                            placeholder="8.5" 
                            value={formData.imdbRating} 
                            onChange={e => setFormData({...formData, imdbRating: e.target.value})}
                            className="h-14 bg-white/5 border-white/10 rounded-2xl"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button type="submit" className="w-full h-16 bg-primary hover:bg-primary/90 text-xl font-bold rounded-2xl shadow-2xl shadow-primary/20 transition-all active:scale-95">
                    <Plus className="mr-3" /> Commit to Multiverse
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-headline font-bold text-white px-2">Manifested Content</h3>
            <div className="space-y-4">
              {library.slice(0, 8).map((item) => (
                <div key={item.id} className="group flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-muted overflow-hidden relative flex-shrink-0 border border-white/10">
                    <img src={item.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate text-white">{item.title}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">{item.type}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-xl text-white/20 hover:text-destructive hover:bg-destructive/10">
                    <Trash2 size={20} />
                  </Button>
                </div>
              ))}
              {library.length > 8 && (
                <div className="text-center p-6 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-sm text-white/30 font-bold uppercase tracking-widest">+{library.length - 8} Additional Realms</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
