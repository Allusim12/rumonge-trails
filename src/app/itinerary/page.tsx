
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ItineraryPlanner } from "@/components/ItineraryPlanner";
import { ChatGuide } from "@/components/ChatGuide";

export default function ItineraryPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <div className="bg-secondary/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-5xl font-bold mb-4">AI <span className="text-primary italic">Travel Planner</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Let our AI craft the perfect personalized journey for your visit to Rumonge.</p>
        </div>
      </div>
      <ItineraryPlanner />
      <ChatGuide />
      <Footer />
    </main>
  );
}
