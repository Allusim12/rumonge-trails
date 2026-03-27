"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Star, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { WishlistButton } from "@/components/WishlistButton";

const staticWonders = [
  {
    id: "static-5",
    name: "Amashuha (Mugara Hot Springs)",
    type: "Natural Wonder",
    address: "Zone Mugara, Rumonge",
    description: "Famous natural hot springs located in Mugara zone. These therapeutic thermal waters are a must-visit for relaxation and health, situated beautifully near the lake.",
    image: "nature-trail",
    rating: 4.9
  },
  {
    id: "static-1",
    name: "Saga Resort Beach",
    type: "Relaxation",
    address: "Saga Shoreline",
    description: "Pristine golden sands meeting the crystal waters of Lake Tanganyika.",
    image: "rumonge-beach",
    rating: 4.9
  },
  {
    id: "static-2",
    name: "Tanganyika Fishing Hub",
    type: "Adventure",
    address: "Lake Tanganyika",
    description: "Experience the traditional fishing methods and the legendary biodiversity of the world's longest lake.",
    image: "fishing-boats",
    rating: 4.8
  },
  {
    id: "static-3",
    name: "Palm Oil Estates",
    type: "Culture",
    address: "Rural Rumonge",
    description: "The economic heart of the commune, showing centuries-old extraction traditions.",
    image: "palm-oil",
    rating: 4.7
  },
  {
    id: "static-4",
    name: "Rumonge Hill Trails",
    type: "Nature",
    address: "Eastern Hills",
    description: "Panoramic views of the lake and lush tropical vegetation ideal for hiking.",
    image: "nature-trail",
    rating: 4.6
  }
];

const categories = ["All", "Natural Wonder", "Relaxation", "Adventure", "Culture", "Nature", "Beach"];

export function AttractionsGrid() {
  const firestore = useFirestore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const wondersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "wonderAttractions"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: dbWonders, isLoading } = useCollection(wondersQuery);

  const allWonders = useMemo(() => {
    const combined = [...(dbWonders || []), ...staticWonders];
    return combined.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
  }, [dbWonders]);

  const filteredWonders = useMemo(() => {
    return allWonders.filter(w => {
      const matchesSearch = w.name.toLowerCase().includes(search.toLowerCase()) || 
                            (w.description || "").toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || w.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, allWonders]);

  return (
    <section id="wonders" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-4">
              Rumonge's <span className="text-primary italic">Hidden Wonders</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              Explore our curated selection of natural and cultural landmarks. 
              Search or filter to find your next adventure.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-12 items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search wonders..." 
              className="pl-10 rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold transition-all border",
                  activeCategory === cat 
                    ? "bg-primary text-white border-primary" 
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : filteredWonders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredWonders.map((wonder) => {
              const imgData = PlaceHolderImages.find(img => img.id === wonder.image || img.id === "rumonge-hero");
              return (
                <Card key={wonder.id} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-background">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={imgData?.imageUrl || "https://picsum.photos/seed/placeholder/800/600"}
                      alt={wonder.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      data-ai-hint={imgData?.imageHint || "rumonge landscape"}
                    />
                    <Badge className="absolute top-4 left-4 bg-white/90 text-primary border-none font-bold">
                      {wonder.type}
                    </Badge>
                    <div className="absolute top-4 right-4">
                      <WishlistButton 
                        entityId={wonder.id} 
                        entityType="WonderAttraction" 
                        entityName={wonder.name} 
                      />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 text-primary mb-2">
                      <MapPin size={14} />
                      <span className="text-xs font-bold uppercase tracking-wider">{wonder.address}</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {wonder.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
                      {wonder.description}
                    </p>
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-bold">{wonder.rating || "4.5"}</span>
                      </div>
                      <Link 
                        href={`/wonders/${wonder.id}`}
                        className="text-accent text-sm font-bold hover:underline"
                      >
                        Explore More
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed border-secondary/30">
            <p className="text-muted-foreground text-lg">No wonders match your current search or filter.</p>
            <button 
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-4 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
