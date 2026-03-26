
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeritageSection } from "@/components/HeritageSection";
import { ChatGuide } from "@/components/ChatGuide";

export default function HeritagePage() {
  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <div className="bg-secondary/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-5xl font-bold mb-4">Cultural <span className="text-accent italic">Heritage</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Discover the stories, traditions, and arts that define the soul of Rumonge.</p>
        </div>
      </div>
      <HeritageSection />
      <ChatGuide />
      <Footer />
    </main>
  );
}
