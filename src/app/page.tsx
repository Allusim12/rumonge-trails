
"use client";

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
import { Calendar, Music, TreePalm, ArrowRight, Quote, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="relative">
        <Hero />
        <div className="absolute bottom-12 left-0 right-0 px-6 hidden md:block">
          <GlobalSearch />
        </div>
      </div>

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
          <Button variant="ghost" className="text-accent font-bold hover:bg-accent/10 rounded-full px-8 py-6 h-auto border-2 border-accent/20" asChild>
            <Link href="/guide">Explore Language Hub</Link>
          </Button>
        </div>
      </section>

      {/* Preview Sections */}
      <div className="space-y-0">
        <section className="relative">
          <AttractionsGrid />
          <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-center">
            <Button variant="outline" className="rounded-full px-10 py-6 h-auto text-lg group border-primary text-primary hover:bg-primary hover:text-white" asChild>
              <Link href="/wonders">
                Explore All Wonders
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-secondary/10">
          <HeritageSection />
          <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-center">
             <Button className="rounded-full px-10 py-6 h-auto text-lg group shadow-xl" asChild>
              <Link href="/heritage">
                Deep Dive into Culture
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        <LanguageGuide />

        <Gallery />

        <section id="events" className="py-24 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Save the Date</span>
              <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">Upcoming <span className="text-primary italic">Festivals</span></h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Join the local celebrations that make Rumonge vibrant year-round.</p>
            </div>
            <EventsList />
            <div className="mt-20 flex justify-center">
              <Button variant="outline" className="rounded-full px-10 py-6 h-auto border-2 group" asChild>
                <Link href="/events" className="flex items-center gap-2">
                  Full Events Calendar
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-all" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ChatGuide />
      <Footer />
    </main>
  );
}
