
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { InfoHub } from "@/components/InfoHub";
import { LanguageGuide } from "@/components/LanguageGuide";
import { ChatGuide } from "@/components/ChatGuide";

export default function GuidePage() {
  return (
    <main className="min-h-screen pt-20">
      <Navigation />
      <div className="bg-secondary/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-5xl font-bold mb-4">Visitor <span className="text-primary italic">Guide</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Essential information for a seamless and respectful travel experience in Rumonge.</p>
        </div>
      </div>
      <InfoHub />
      <LanguageGuide />
      <ChatGuide />
      <Footer />
    </main>
  );
}
