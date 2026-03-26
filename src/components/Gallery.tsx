
"use client";

import React, { useState } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Play, Maximize2 } from "lucide-react";

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");

  const galleryItems = [
    { id: "rumonge-hero", category: "Nature" },
    { id: "rumonge-beach", category: "Leisure" },
    { id: "burundi-drums", category: "Culture" },
    { id: "fishing-boats", category: "Nature" },
    { id: "local-market", category: "Culture" },
    { id: "cuisine", category: "Food" },
  ];

  const filteredItems = activeFilter === "all" 
    ? galleryItems 
    : galleryItems.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="py-24 px-6 bg-secondary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6">
            Rumonge <span className="text-accent italic">Through The Lens</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["all", "Nature", "Culture", "Leisure", "Food"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter.toLowerCase())}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  activeFilter === filter.toLowerCase()
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white text-muted-foreground hover:bg-primary/10"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => {
            const img = PlaceHolderImages.find(p => p.id === item.id);
            return (
              <div
                key={idx}
                className={`relative group overflow-hidden rounded-3xl cursor-pointer ${
                  idx === 0 ? "sm:col-span-2 sm:row-span-2 h-[600px]" : "h-[288px]"
                }`}
              >
                <Image
                  src={img?.imageUrl || "https://picsum.photos/seed/gall/800/600"}
                  alt={img?.description || "Rumonge Gallery"}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  data-ai-hint={img?.imageHint}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/40 transition-all">
                    <Maximize2 size={24} />
                  </div>
                  {idx === 0 && (
                    <div className="bg-primary p-4 rounded-full text-white hover:scale-110 transition-all">
                      <Play size={24} fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">{item.category}</span>
                  <h3 className="text-white font-headline text-xl font-bold">{img?.description}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
