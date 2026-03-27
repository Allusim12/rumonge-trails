
"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { GlobalSearch } from "@/components/GlobalSearch";
import { AttractionsGrid } from "@/components/AttractionsGrid";
import { HeritageSection } from "@/components/HeritageSection";
import { Gallery } from "@/components/Gallery";
import { LanguageGuide } from "@/components/LanguageGuide";
import { ChatGuide } from "@/components/ChatGuide";
import { Footer } from "@/components/Footer";
import { EventsList } from "@/components/EventsList";
import { Calendar, Music, TreePalm, ArrowRight, Quote, Sparkles, Newspaper, TrendingUp, Loader2, Volume2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingList } from "@/components/TrendingList";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { getCommunityBuzz, type CommunityBuzzOutput } from "@/ai/flows/community-buzz";
import { speakKirundi } from "@/ai/flows/kirundi-tts";

export default function Home() {
  const firestore = useFirestore();
  const [buzz, setBuzz] = useState<CommunityBuzzOutput | null>(null);
  const [isBuzzLoading, setIsBuzzLoading] = useState(false);
  const [isPlayingPhrase, setIsPlayingPhrase] = useState(false);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "reviews"), orderBy("createdAt", "desc"), limit(5));
  }, [firestore]);

  const { data: reviews } = useCollection(reviewsQuery);

  useEffect(() => {
    if (reviews && reviews.length > 0 && !buzz && !isBuzzLoading) {
      setIsBuzzLoading(true);
      const recentReviews = reviews.map(r => ({
        userName: r.userName || "Traveler",
        comment: r.comment,
        rating: r.rating
      }));
      
      getCommunityBuzz({ reviews: recentReviews })
        .then(setBuzz)
        .catch(console.error)
        .finally(() => setIsBuzzLoading(false));
    }
  }, [reviews, buzz, isBuzzLoading]);

  const handlePlayPhrase = async () => {
    setIsPlayingPhrase(true);
    try {
      const { audioDataUri } = await speakKirundi("Amahoro asage");
      const audio = new Audio(audioDataUri);
      audio.play();
      audio.onended = () => setIsPlayingPhrase(false);
    } catch (error) {
      console.error("TTS error", error);
      setIsPlayingPhrase(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="relative">
        <Hero />
        <div className="absolute bottom-12 left-0 right-0 px-6 hidden md:block">
          <GlobalSearch />
        </div>
      </div>

      {/* Community Pulse - AI Insight */}
      {buzz && (
        <section className="py-20 px-6 bg-secondary/10 border-y">
          <div className="max-w-7xl mx-auto">
            <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
              <CardContent className="p-0 flex flex-col lg:flex-row">
                <div className="bg-primary p-12 lg:w-1/3 text-primary-foreground flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    <Sparkles size={14} /> AI Insight
                  </div>
                  <h3 className="font-headline text-4xl font-bold mb-4">Community <span className="italic">Pulse</span></h3>
                  <p className="opacity-80 text-sm leading-relaxed">
                    Our digital guide Amahoro has synthesized recent traveler stories to give you a snapshot of Rumonge right now.
                  </p>
                </div>
                <div className="p-12 lg:w-2/3 flex flex-col justify-center">
                  <Quote className="text-primary/20 mb-6" size={48} />
                  <p className="font-headline text-2xl md:text-3xl font-bold italic mb-8 text-foreground/80 leading-snug">
                    "{buzz.summary}"
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {buzz.trendingTopics.map((topic, i) => (
                      <span key={i} className="bg-secondary text-primary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-primary/10">
                        #{topic.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Trending Updates Preview */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Real-time Pulse</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold">Trending <span className="text-accent italic">in Rumonge</span></h2>
            </div>
            <Button variant="outline" className="rounded-full px-8 hidden md:flex" asChild>
              <Link href="/news">All Updates <Newspaper className="ml-2" size={16} /></Link>
            </Button>
          </div>
          <TrendingList />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white/10 p-6 rounded-[2rem] hover:scale-110 transition-transform duration-500">
              <TreePalm size={48} />
            </div>
            <div>
              <h3 className="font-headline text-3xl font-bold italic mb-2">Lush Landscapes</h3>
              <p className="text-xs opacity-80 uppercase font-bold tracking-[0.2em] leading-relaxed">Tropical Perfection & Lakeside Bliss</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white/10 p-6 rounded-[2rem] hover:scale-110 transition-transform duration-500">
              <Calendar size={48} />
            </div>
            <div>
              <h3 className="font-headline text-3xl font-bold italic mb-2">Ancient Rhythms</h3>
              <p className="text-xs opacity-80 uppercase font-bold tracking-[0.2em] leading-relaxed">Living Traditions & Drum Beats</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white/10 p-6 rounded-[2rem] hover:scale-110 transition-transform duration-500">
              <Music size={48} />
            </div>
            <div>
              <h3 className="font-headline text-3xl font-bold italic mb-2">Warm Hospitality</h3>
              <p className="text-xs opacity-80 uppercase font-bold tracking-[0.2em] leading-relaxed">The Authentic Heart of Burundi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Phrase of the Day Spotlight */}
      <section className="py-20 bg-accent/5 border-y relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-[10px] mb-6 bg-accent/10 px-4 py-2 rounded-full">
            <Sparkles size={12} />
            Kirundi Phrase of the Day
          </div>
          <h2 className="font-headline text-5xl md:text-6xl font-bold text-foreground mb-4">"Amahoro asage"</h2>
          <p className="text-xl text-muted-foreground italic mb-10 leading-relaxed font-body">Translation: "Peace be with you always"</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={handlePlayPhrase}
              disabled={isPlayingPhrase}
              className="bg-accent text-white font-bold hover:bg-accent/90 rounded-full px-8 py-6 h-auto shadow-lg"
            >
              {isPlayingPhrase ? <Loader2 className="animate-spin mr-2" /> : <Volume2 size={20} className="mr-2" />}
              Listen in Kirundi
            </Button>
            <Button variant="ghost" className="text-accent font-bold hover:bg-accent/10 rounded-full px-8 py-6 h-auto border-2 border-accent/20" asChild>
              <Link href="/guide">Explore Language Hub</Link>
            </Button>
          </div>
        </div>
      </section>

      <AttractionsGrid />
      <HeritageSection />
      <Gallery />
      <LanguageGuide />

      <section id="events" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Save the Date</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">Upcoming <span className="text-primary italic">Festivals</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Join the local celebrations that make Rumonge vibrant year-round.</p>
          </div>
          <EventsList />
        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
