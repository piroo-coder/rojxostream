
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
import { Sparkles, Plus, Loader2, Trash2 } from 'lucide-react';
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
    <main className="min-h-screen pb-20 pt-24 bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 max-w-5xl">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-bold mb-2">Content Manager</h1>
          <p className="text-muted-foreground">Add new media or manage your existing library.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-white/5 bg-card shadow-2xl overflow-hidden">
              <CardHeader className="bg-primary/5">
                <CardTitle className="font-headline">Upload Media</CardTitle>
                <CardDescription>Fill in the details below. Use the AI tool to generate summaries.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Content Title</Label>
                      <Input 
                        placeholder="e.g. Inception" 
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Media Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={v => setFormData({...formData, type: v as MediaType})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="movie">Movie</SelectItem>
                          <SelectItem value="song">Song</SelectItem>
                          <SelectItem value="short">Short</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Media URL (Direct Link)</Label>
                    <Input 
                      placeholder="https://..." 
                      value={formData.mediaUrl} 
                      onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Thumbnail URL</Label>
                      <Input 
                        placeholder="https://..." 
                        value={formData.thumbnailUrl} 
                        onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{formData.type === 'song' ? 'Singer' : 'Director / Channel'}</Label>
                      <Input 
                        placeholder="Name" 
                        value={formData.creator} 
                        onChange={e => setFormData({...formData, creator: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Description</Label>
                      {(formData.type === 'movie' || formData.type === 'anime') && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="text-accent hover:text-accent-foreground flex items-center gap-1"
                          onClick={handleAiAssist}
                          disabled={isGenerating}
                        >
                          {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                          AI Summarize
                        </Button>
                      )}
                    </div>
                    <Textarea 
                      placeholder="Add a detailed description..." 
                      rows={3} 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  {(formData.type === 'movie' || formData.type === 'anime') && (
                    <>
                      <div className="space-y-2">
                        <Label>AI Summary (4-5 Sentences)</Label>
                        <Textarea 
                          value={formData.summary} 
                          onChange={e => setFormData({...formData, summary: e.target.value})}
                          placeholder="Wait for AI or type manually..."
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Moral / Lesson</Label>
                        <Input 
                          value={formData.moral} 
                          onChange={e => setFormData({...formData, moral: e.target.value})}
                          placeholder="The lesson learned..."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>IMDb Rating</Label>
                          <Input 
                            placeholder="8.5" 
                            value={formData.imdbRating} 
                            onChange={e => setFormData({...formData, imdbRating: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Rotten Tomatoes</Label>
                          <Input 
                            placeholder="90%" 
                            value={formData.rottenTomatoesRating} 
                            onChange={e => setFormData({...formData, rottenTomatoesRating: e.target.value})}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-lg">
                    <Plus className="mr-2" /> Add Media to Library
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-headline font-semibold">Live Library</h3>
            <div className="space-y-4">
              {library.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-white/5">
                  <div className="w-12 h-12 rounded bg-muted overflow-hidden relative flex-shrink-0">
                    <img src={item.thumbnailUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground uppercase">{item.type}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              {library.length > 5 && (
                <p className="text-center text-sm text-muted-foreground">and {library.length - 5} others...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
