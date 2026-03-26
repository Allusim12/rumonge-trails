
"use client";

import React from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Music, Palette, Users, Heart } from "lucide-react";

const traditions = [
  {
    icon: <Music className="text-accent" size={32} />,
    title: "Traditional Dance & Drumming",
    desc: "The heartbeat of Rumonge, where local troops perform the vibrant dances of the lakeside people."
  },
  {
    icon: <Palette className="text-accent" size={32} />,
    title: "Artisanal Basketry",
    desc: "Intricate weaving techniques passed down through generations, creating functional and artistic pieces."
  },
  {
    icon: <Users className="text-accent" size={32} />,
    title: "Community Festivals",
    desc: "Vibrant celebrations of the harvest and the lake's bounty, uniting visitors and locals."
  }
];

export function HeritageSection() {
  const heritageImg = PlaceHolderImages.find(img => img.id === "burundi-drums");

  return (
    <section id="heritage" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <Image
                src={heritageImg?.imageUrl || "https://picsum.photos/seed/drums/800/1000"}
                alt="Burundian Heritage"
                fill
                className="object-cover"
                data-ai-hint={heritageImg?.imageHint}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <p className="font-headline text-2xl font-bold italic">"Culture is the soul of our people."</p>
                <p className="text-sm opacity-80 mt-2">— Local Rumonge Proverb</p>
              </div>
            </div>
            {/* Floating Element */}
            <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl hidden md:block max-w-[200px] border">
              <Heart className="text-accent mb-2" fill="currentColor" />
              <p className="font-bold text-sm">Recognized by tourists as the most welcoming commune.</p>
            </div>
          </div>

          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Cultural Spotlight</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8 leading-tight">
              A Legacy Carved in <span className="text-accent italic">Tradition</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
              Rumonge isn't just a location; it's a living museum of Burundian culture. 
              From the rhythmic resonance of the drums to the delicate hands of local weavers, 
              every corner of our commune tells a story of resilience and beauty.
            </p>

            <div className="space-y-8">
              {traditions.map((t, idx) => (
                <div key={idx} className="flex gap-6 items-start group">
                  <div className="bg-accent/10 p-4 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all duration-300">
                    {t.icon}
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-bold mb-2">{t.title}</h3>
                    <p className="font-body text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-12 bg-accent text-white px-8 py-4 rounded-full font-bold hover:shadow-lg transition-all hover:scale-105">
              Discover Local Stories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
