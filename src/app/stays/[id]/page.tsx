
"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { useFirestore, useDoc, useMemoFirebase, useUser } from "@/firebase";
import { doc, collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Wifi, Coffee, Phone, Globe, ArrowLeft, Loader2, Bed, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function StayDetailPage() {
  const { id } = useParams();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isBooking, setIsBooking] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const stayRef = useMemoFirebase(() => 
    firestore ? doc(firestore, "accommodations", id as string) : null
  , [firestore, id]);

  const { data: stay, isLoading } = useDoc(stayRef);

  const handleBookingRequest = async () => {
    if (!user || !firestore || !stay) {
      toast({
        title: "Login Required",
        description: "Please log in to express interest in this stay.",
      });
      return;
    }

    setIsBooking(true);
    try {
      await addDocumentNonBlocking(collection(firestore, "bookingRequests"), {
        userId: user.uid,
        userName: user.displayName || "Explorer",
        userEmail: user.email,
        hotelId: stay.id,
        hotelName: stay.name,
        status: "Pending",
        requestedAt: serverTimestamp(),
      });
      setHasRequested(true);
      toast({
        title: "Interest Registered!",
        description: "The hotel staff will be notified of your interest.",
      });
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!stay) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <Navigation />
        <h1 className="text-2xl font-bold mb-4">Accommodation Not Found</h1>
        <Link href="/stays" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Stays
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-secondary/5">
      <Navigation />
      
      <section className="relative h-[50vh] w-full overflow-hidden">
        <Image
          src={stay.imageUrl || "https://picsum.photos/seed/hotel/1920/1080"}
          alt={stay.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto">
            <Link href="/stays" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm font-bold uppercase tracking-widest transition-colors">
              <ArrowLeft size={16} /> All Stays
            </Link>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="text-white">
                <Badge className="bg-accent text-white border-none mb-4">{stay.type || "Hotel"}</Badge>
                <h1 className="font-headline text-5xl md:text-7xl font-bold">{stay.name}</h1>
                <div className="flex items-center gap-4 mt-4 text-sm font-bold">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-primary" />
                    {stay.address}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-500 text-yellow-500" />
                    {stay.rating || "4.5"} Rating
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleBookingRequest}
                disabled={isBooking || hasRequested}
                className="h-14 px-8 rounded-full text-lg font-bold shadow-xl"
              >
                {isBooking ? <Loader2 className="animate-spin mr-2" /> : hasRequested ? <CheckCircle2 className="mr-2" /> : null}
                {hasRequested ? "Interest Registered" : "Express Booking Interest"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-headline text-3xl font-bold mb-6">Experience <span className="text-primary italic">Excellence</span></h2>
            <p className="text-muted-foreground text-xl leading-relaxed">
              {stay.description}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center gap-3">
              <Wifi className="text-primary" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Free Wifi</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center gap-3">
              <Coffee className="text-primary" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Breakfast</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center gap-3">
              <Bed className="text-primary" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Premium Beds</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col items-center text-center gap-3">
              <Star className="text-primary" size={24} />
              <span className="text-xs font-bold uppercase tracking-widest">Top Rated</span>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-xl bg-white overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-accent/5 p-8 border-b">
              <CardTitle className="font-headline text-2xl">Contact <span className="text-accent italic">Info</span></CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex gap-4">
                <div className="bg-accent/10 p-3 rounded-2xl text-accent h-fit">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Phone Number</p>
                  <p className="font-bold">{stay.contactPhone || "+257 22 23 45 67"}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-accent/10 p-3 rounded-2xl text-accent h-fit">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Official Website</p>
                  <button className="font-bold text-primary hover:underline">Official Site Unavailable</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
