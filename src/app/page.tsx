
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AttractionsGrid } from "@/components/AttractionsGrid";
import { HeritageSection } from "@/components/HeritageSection";
import { ItineraryPlanner } from "@/components/ItineraryPlanner";
import { InfoHub } from "@/components/InfoHub";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { Calendar, Music, TreePalm } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <Hero />

      {/* Intro Stats/Highlights */}
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

      {/* Wonders & Attractions */}
      <AttractionsGrid />

      {/* Cultural Heritage */}
      <HeritageSection />

      {/* AI Planner */}
      <ItineraryPlanner />

      {/* Dynamic Gallery */}
      <Gallery />

      {/* Information Hub */}
      <InfoHub />

      {/* Upcoming Events - Simplified for this iteration */}
      <section id="events" className="py-24 px-6 bg-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Save the Date</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">Upcoming <span className="text-primary italic">Festivals</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-primary flex gap-6 items-center">
              <div className="text-center min-w-[80px]">
                <span className="block text-4xl font-headline font-bold text-primary">15</span>
                <span className="block text-sm uppercase font-bold text-muted-foreground">July</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Lake Tanganyika Harvest Festival</h3>
                <p className="text-muted-foreground text-sm">Celebrating the annual bounty with traditional boat races and communal feasts.</p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-accent flex gap-6 items-center">
              <div className="text-center min-w-[80px]">
                <span className="block text-4xl font-headline font-bold text-accent">22</span>
                <span className="block text-sm uppercase font-bold text-muted-foreground">Aug</span>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Rumonge Drums Ensemble</h3>
                <p className="text-muted-foreground text-sm">A night of rhythmic mastery featuring top drummers from the southern region.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
