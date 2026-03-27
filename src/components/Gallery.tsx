
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Play, Maximize2, Camera, Info, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

const galleryCategories = [
  { id: "all", label: "All Stories" },
  { id: "nature", label: "Nature" },
  { id: "culture", label: "Culture" },
  { id: "leisure", label: "Leisure" },
  { id: "food", label: "Food" },
];

const fallbackGallery = [
  { id: "rumonge-hero", category: "nature", title: "Lush Coastlines", size: "large", url: "" },
  { id: "rumonge-beach", category: "leisure", title: "Saga Sands", size: "small", url: "" },
  { id: "burundi-drums", category: "culture", title: "Rhythms of Ancestors", size: "small", url: "" },
  { id: "fishing-boats", category: "nature", title: "Tanganyika Twilight", size: "medium", url: "" },
  { id: "local-market", category: "culture", title: "Vibrant Exchanges", size: "small", url: "" },
  { id: "cuisine", category: "food", title: "Traditional Flavors", size: "medium", url: "" },
  { id: "palm-oil", category: "culture", title: "Liquid Gold", size: "small", url: "" },
  { id: "nature-trail", category: "nature", title: "Green Sanctuaries", size: "small", url: "" },
];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState("all");
  const firestore = useFirestore();

  const mediaQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "mediaAssets"), orderBy("uploadedAt", "desc"));
  }, [firestore]);

  const { data: dbMedia, isLoading } = useCollection(mediaQuery);

  const displayItems = useMemo(() => {
    if (dbMedia && dbMedia.length > 0) {
      return dbMedia.map((m, idx) => ({
        id: m.id,
        category: m.mediaType || "nature",
        title: m.caption || m.altText || "Rumonge Moment",
        url: m.url,
        size: idx % 5 === 0 ? "large" : idx % 3 === 0 ? "medium" : "small"
      }));
    }
    return fallbackGallery;
  }, [dbMedia]);

  const filteredItems = activeFilter === "all" 
    ? displayItems 
    : displayItems.filter(item => item.category === activeFilter);

  return (
    <section className="py-24 px-6 bg-secondary/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
              <Camera size={16} />
              Visual Journey
            </div>
            <h2 className="font-headline text-4xl md:text-6xl font-bold">
              Rumonge <span className="text-accent italic">Through The Lens</span>
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 bg-white p-2 rounded-full shadow-sm border">
            {galleryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                  activeFilter === cat.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-secondary/50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-primary" size={48} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {filteredItems.map((item, idx) => {
              const staticImg = PlaceHolderImages.find(p => p.id === item.id);
              const isLarge = item.size === "large";
              const isMedium = item.size === "medium";
              
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className={cn(
                    "relative group overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 animate-in fade-in zoom-in-95",
                    isLarge && "sm:col-span-2 sm:row-span-2",
                    isMedium && "sm:col-span-2"
                  )}
                >
                  <Image
                    src={item.url || staticImg?.imageUrl || `https://picsum.photos/seed/${item.id}/800/600`}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    data-ai-hint="rumonge landscape"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-primary text-[10px] uppercase font-bold tracking-[0.2em] mb-1 block">
                          {item.category}
                        </span>
                        <h3 className="text-white font-headline text-2xl font-bold">{item.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-primary transition-colors">
                          <Maximize2 size={18} />
                        </div>
                        {isLarge && (
                          <div className="bg-accent p-3 rounded-full text-white hover:scale-110 transition-transform">
                            <Play size={18} fill="currentColor" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md p-2 rounded-full text-white md:hidden">
                    <Info size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground">No moments captured in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
