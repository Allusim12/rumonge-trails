"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

export function Hero() {
  const firestore = useFirestore();
  const heroImage = PlaceHolderImages.find((img) => img.id === "rumonge-hero");

  // Fetch Hero content from Firestore
  const heroDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, "site_content", "hero") : null
  , [firestore]);

  const { data: heroData, isLoading } = useDoc(heroDocRef);

  // Fallback content
  const content = {
    title: heroData?.title || "Where Heritage Meets",
    titleItalic: heroData?.titleItalic || "The Great Lake",
    subtitle: heroData?.subtitle || "Discover Rumonge: A vibrant commune on the shores of Lake Tanganyika, rich in palm oil traditions, world-class fishing, and untouched natural beauty.",
    badge: heroData?.badge || "Burundi's Tropical Paradise",
    imageUrl: heroData?.imageUrl || heroImage?.imageUrl || "https://picsum.photos/seed/rumonge1/1920/1080"
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 scale-105">
        <Image
          src={content.imageUrl}
          alt="Rumonge Coastline"
          fill
          className="object-cover brightness-75 transition-opacity duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 mb-8 border border-white/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <MapPin size={16} className="text-primary" />
          <span className="text-sm font-medium tracking-wide uppercase">{content.badge}</span>
        </div>
        
        <h1 className="font-headline text-5xl md:text-8xl text-white font-bold leading-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          {content.title} <br />
          <span className="text-primary italic">{content.titleItalic}</span>
        </h1>
        
        <p className="font-body text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          {content.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
          <Link
            href="/wonders"
            className="group flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-105"
          >
            Explore Wonders
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/itinerary"
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
          >
            Start Planning
          </Link>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-white rounded-full" />
        </div>
      </div>
    </section>
  );
}
