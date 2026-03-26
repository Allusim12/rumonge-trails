
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AttractionsGrid } from "@/components/AttractionsGrid";
import { HeritageSection } from "@/components/HeritageSection";
import { ItineraryPlanner } from "@/components/ItineraryPlanner";
import { InfoHub } from "@/components/InfoHub";
import { Gallery } from "@/components/Gallery";
import { LanguageGuide } from "@/components/LanguageGuide";
import { ChatGuide } from "@/components/ChatGuide";
import { Footer } from "@/components/Footer";
import { EventsList } from "@/components/EventsList";
import { Calendar, Music, TreePalm } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      <Hero />

      <section className="py-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <TreePalm size={32} />
            <h3 className="font-headline text-2xl font-bold italic">Lush Landscapes</h3>
            <p className="text-sm opacity-80 uppercase tracking-widest">Tropical Perfection</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Calendar size={32} />
            <h3 className="font-headline text-2xl font-bold italic">Ancient Rhythms</h3>
            <p className="text-sm opacity-80 uppercase tracking-widest">Living Traditions</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Music size={32} />
            <h3 className="font-headline text-2xl font-bold italic">Warm Hospitality</h3>
            <p className="text-sm opacity-80 uppercase tracking-widest">Heart of Burundi</p>
          </div>
        </div>
      </section>

      <AttractionsGrid />
      <HeritageSection />
      <ItineraryPlanner />
      <LanguageGuide />
      <Gallery />
      <InfoHub />

      <section id="events" className="py-24 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Save the Date</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">Upcoming <span className="text-primary italic">Festivals</span></h2>
          </div>
          <EventsList />
        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
