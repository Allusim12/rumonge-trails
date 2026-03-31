
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Video, Sparkles, Download, Wand2, PlayCircle, Clock } from "lucide-react";
import { generatePromoVideo } from "@/ai/flows/generate-promo-video";
import { useToast } from "@/hooks/use-toast";

export function AIStudio() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setVideoUrl(null);
    
    try {
      const { videoDataUri } = await generatePromoVideo({ 
        prompt: prompt.trim(),
        aspectRatio: '16:9'
      });
      setVideoUrl(videoDataUri);
      toast({
        title: "Video Ready!",
        description: "Your AI Rumonge promo has been rendered.",
      });
    } catch (error) {
      console.error("Video error", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "Veo models are high-demand. Please try again in a few minutes.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadVideo = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `rumonge-promo-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Generator Controls */}
        <Card className="lg:col-span-5 border-none shadow-2xl bg-white rounded-3xl overflow-hidden">
          <div className="h-2 bg-accent" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Wand2 className="text-accent" />
              Veo <span className="text-accent italic">Studio</span>
            </CardTitle>
            <CardDescription>
              Generate high-quality cinematic clips of Rumonge for social media.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Scene Description
                </label>
                <Input
                  placeholder="e.g. Traditional drummers performing at sunset near Saga Beach..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="rounded-2xl h-14"
                  disabled={isGenerating}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl font-bold text-lg bg-accent hover:bg-accent/90"
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Rendering (takes ~60s)...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" />
                    Generate Promo Clip
                  </>
                )}
              </Button>
            </form>

            <div className="p-6 bg-secondary/20 rounded-2xl border border-dashed border-accent/20">
              <h4 className="font-bold flex items-center gap-2 mb-2 text-accent">
                <Clock size={16} />
                Studio Notes
              </h4>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• Clips are 5 seconds long by default.</li>
                <li>• Best for: Landscapes, cultural displays, and lake views.</li>
                <li>• Note: Video AI is computationally expensive; please allow up to 2 minutes for processing.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Video Preview */}
        <Card className="lg:col-span-7 border-none shadow-xl bg-background rounded-3xl overflow-hidden min-h-[400px] flex flex-col">
          <div className="bg-white p-6 border-b flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <PlayCircle className="text-primary" />
              Preview Window
            </h3>
            {videoUrl && (
              <Button variant="outline" size="sm" onClick={downloadVideo} className="rounded-full border-primary text-primary">
                <Download size={14} className="mr-2" /> Download MP4
              </Button>
            )}
          </div>
          <div className="flex-1 flex items-center justify-center p-8 bg-black/5">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <div className="relative">
                   <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
                   <Video size={64} className="relative text-accent animate-bounce" />
                </div>
                <p className="font-bold animate-pulse">Our AI is filming in Rumonge...</p>
              </div>
            ) : videoUrl ? (
              <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full rounded-2xl shadow-2xl border-4 border-white"
              />
            ) : (
              <div className="text-center text-muted-foreground/40">
                <Video size={80} className="mx-auto mb-4 opacity-10" />
                <p className="text-sm font-bold">Describe a scene to start the studio</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
