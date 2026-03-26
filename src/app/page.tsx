
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AttractionsGrid } from "@/components/AttractionsGrid";
import { HeritageSection } from "@/components/HeritageSection";
import { Gallery } from "@/components/Gallery";
import { LanguageGuide } from "@/components/LanguageGuide";
import { ChatGuide } from "@/components/ChatGuide";
import { Footer } from "@/components/Footer";
import { EventsList } from "@/components/EventsList";
import { Calendar, Music, TreePalm, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <Hero />

      {/* Value Proposition */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl">
              <TreePalm size={40} />
            </div>
            <h3 className="font-headline text-2xl font-bold italic">Lush Landscapes</h3>
            <p className="text-sm opacity-80 uppercase tracking-widest leading-relaxed">Tropical Perfection & Lakeside Bliss</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl">
              <Calendar size={40} />
            </div>
            <h3 className="font-headline text-2xl font-bold italic">Ancient Rhythms</h3>
            <p className="text-sm opacity-80 uppercase tracking-widest leading-relaxed">Living Traditions & Drum Beats</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl">
              <Music size={40} />
            </div>
            <h3 className="font-headline text-2xl font-bold italic">Warm Hospitality</h3>
            <p className="text-sm opacity-80 uppercase tracking-widest leading-relaxed">The Authentic Heart of Burundi</p>
          </div>
        </div>
      </section>

      {/* Preview Sections with Links to Full Pages */}
      <div className="space-y-0">
        <section className="relative">
          <AttractionsGrid />
          <div className="max-w-7xl mx-auto px-6 pb-24 flex justify-center">
            <Button variant="outline" className="rounded-full px-8 py-6 h-auto text-lg group" asChild>
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
             <Button className="rounded-full px-8 py-6 h-auto text-lg group" asChild>
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
            </div>
            <EventsList />
            <div className="mt-16 flex justify-center">
              <Button variant="outline" className="rounded-full px-8" asChild>
                <Link href="/events">Full Events Calendar</Link>
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
