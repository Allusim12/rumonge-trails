
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, CheckCircle2, Map, Loader2, Share2, Printer } from "lucide-react";
import Link from "next/link";

export default function ItineraryDetailPage() {
  const { id } = useParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const itineraryRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, "users", user.uid, "itineraries", id as string) : null
  , [firestore, user?.uid, id]);

  const { data: itinerary, isLoading } = useDoc(itineraryRef);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center p-6 bg-secondary/5">
        <Navigation />
        <Card className="max-w-md p-8 text-center">
          <Map className="mx-auto mb-4 text-muted-foreground" size={48} />
          <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
          <p className="text-muted-foreground mb-6">This itinerary may have been deleted or is unavailable.</p>
          <Button onClick={() => router.push("/profile")} className="w-full">Return to Profile</Button>
        </Card>
        <Footer />
      </div>
    );
  }

  const result = itinerary.fullData;

  return (
    <main className="min-h-screen bg-secondary/5 pt-20">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link href="/profile" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-4 hover:underline">
              <ArrowLeft size={14} /> Back to Profile
            </Link>
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{itinerary.name}</h1>
            <p className="text-muted-foreground mt-2">Crafted by Amahoro AI on {itinerary.createdAt?.seconds ? new Date(itinerary.createdAt.seconds * 1000).toLocaleDateString() : 'Recently'}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">
              <Share2 size={16} className="mr-2" /> Share
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => window.print()}>
              <Printer size={16} className="mr-2" /> Print
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
          <div className="bg-primary p-10 text-primary-foreground">
             <div className="bg-white/10 w-fit px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Your AI Travel Summary</div>
             <p className="font-headline text-2xl md:text-3xl italic leading-relaxed">
               "{result?.summary || itinerary.description}"
             </p>
          </div>
          <CardContent className="p-10">
            <div className="space-y-12">
              {result?.itinerary ? result.itinerary.map((day: any, idx: number) => (
                <div key={idx} className="relative pl-12 border-l-2 border-primary/10 last:border-0 pb-4">
                  <div className="absolute -left-4 top-0 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ring-4 ring-white shadow-lg">
                    {day.day}
                  </div>
                  <div className="mb-6 flex items-center gap-2">
                    <Calendar size={20} className="text-primary" />
                    <h4 className="font-headline text-2xl font-bold">Day {day.day}</h4>
                  </div>
                  <div className="grid gap-4">
                    {day.activities.map((activity: string, aIdx: number) => (
                      <div key={aIdx} className="flex gap-4 items-start bg-secondary/10 p-6 rounded-2xl hover:bg-secondary/20 transition-all border border-transparent hover:border-primary/10">
                        <CheckCircle2 size={20} className="text-accent mt-1 shrink-0" />
                        <p className="font-body text-foreground/80 leading-relaxed text-lg">{activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="space-y-4">
                  {itinerary.items.map((item: string, i: number) => (
                    <div key={i} className="flex gap-4 p-4 bg-secondary/20 rounded-xl">
                       <CheckCircle2 size={18} className="text-primary mt-1" />
                       <p>{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ChatGuide />
      <Footer />
    </main>
  );
}
