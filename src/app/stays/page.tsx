
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StaysList } from "@/components/StaysList";
import { ChatGuide } from "@/components/ChatGuide";
import { Bed } from "lucide-react";

export default function StaysPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <div className="bg-secondary/20 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-[0.2em] text-sm mb-4">
            <Bed size={20} />
            Accommodations
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">
            Where to <span className="text-primary italic">Stay</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed">
            From historic landmarks to modern lakeside resorts, find the perfect base for your Rumonge adventure.
          </p>
        </div>
      </div>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="font-headline text-3xl font-bold">Premier Hotels & Resorts</h2>
            <div className="hidden md:flex gap-4">
              <span className="text-sm font-bold text-muted-foreground italic">* Prices vary by season</span>
            </div>
          </div>
          <StaysList />
        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
