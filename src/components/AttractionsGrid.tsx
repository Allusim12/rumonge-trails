
"use client";

import React from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Star } from "lucide-react";

const wonders = [
  {
    title: "Saga Resort Beach",
    category: "Relaxation",
    location: "Saga Shoreline",
    description: "Pristine golden sands meeting the crystal waters of Lake Tanganyika.",
    image: "rumonge-beach",
    rating: 4.9
  },
  {
    title: "Tanganyika Fishing Hub",
    category: "Adventure",
    location: "Lake Tanganyika",
    description: "Experience the traditional fishing methods and the legendary biodiversity of the world's longest lake.",
    image: "fishing-boats",
    rating: 4.8
  },
  {
    title: "Palm Oil Estates",
    category: "Culture",
    location: "Rural Rumonge",
    description: "The economic heart of the commune, showing centuries-old extraction traditions.",
    image: "palm-oil",
    rating: 4.7
  },
  {
    title: "Rumonge Hill Trails",
    category: "Nature",
    location: "Eastern Hills",
    description: "Panoramic views of the lake and lush tropical vegetation ideal for hiking.",
    image: "nature-trail",
    rating: 4.6
  }
];

export function AttractionsGrid() {
  return (
    <section id="wonders" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-4">
              Rumonge's <span className="text-primary italic">Hidden Wonders</span>
            </h2>
            <p className="font-body text-muted-foreground text-lg">
              From the deep blue of Tanganyika to the golden palm estates, Rumonge offers 
              unparalleled beauty and authentic experiences.
            </p>
          </div>
          <button className="text-primary font-bold hover:underline flex items-center gap-2">
            View All Attractions <Star size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wonders.map((wonder, index) => {
            const imgData = PlaceHolderImages.find(img => img.id === wonder.image);
            return (
              <Card key={index} className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-background">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={imgData?.imageUrl || "https://picsum.photos/seed/placeholder/800/600"}
                    alt={wonder.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint={imgData?.imageHint}
                  />
                  <Badge className="absolute top-4 left-4 bg-white/90 text-primary border-none font-bold">
                    {wonder.category}
                  </Badge>
                  <div className="absolute top-4 right-4 bg-accent/90 text-white p-2 rounded-full">
                    <Camera size={16} />
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 text-primary mb-2">
                    <MapPin size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider">{wonder.location}</span>
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {wonder.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2">
                    {wonder.description}
                  </p>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-bold">{wonder.rating}</span>
                    </div>
                    <button className="text-accent text-sm font-bold hover:underline">Explore More</button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
