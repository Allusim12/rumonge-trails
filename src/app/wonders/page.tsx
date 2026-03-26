
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AttractionsGrid } from "@/components/AttractionsGrid";
import { ChatGuide } from "@/components/ChatGuide";

export default function WondersPage() {
  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <div className="bg-secondary/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-5xl font-bold mb-4">Natural <span className="text-primary italic">Wonders</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Explore the breathtaking landscapes and unique natural sites of Rumonge.</p>
        </div>
      </div>
      <AttractionsGrid />
      <ChatGuide />
      <Footer />
    </main>
  );
}
