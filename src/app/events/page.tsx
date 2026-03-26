
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { EventsList } from "@/components/EventsList";
import { ChatGuide } from "@/components/ChatGuide";

export default function EventsPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Calendar</span>
            <h1 className="font-headline text-5xl font-bold mb-4">Upcoming <span className="text-primary italic">Festivals</span></h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Join us in celebrating the vibrant culture and seasons of Rumonge.</p>
          </div>
          <EventsList />
        </div>
      </section>
      <ChatGuide />
      <Footer />
    </main>
  );
}
