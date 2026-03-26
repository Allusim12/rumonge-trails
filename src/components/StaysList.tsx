
"use client";

import React from "react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hotel, Wifi, Coffee, Waves, MapPin, Star } from "lucide-react";

const hotels = [
  {
    name: "Niyibituronsa Hotel",
    description: "A central Rumonge landmark known for its traditional hospitality and business-friendly amenities.",
    location: "Rumonge Town Center",
    price: "$$$",
    rating: 4.5,
    imageId: "hotel-niyibituronsa",
    amenities: ["Wifi", "Restaurant", "Conference Rooms"]
  },
  {
    name: "Sunrise Hotel",
    description: "Experience breathtaking morning views over Lake Tanganyika in this serene lakeside retreat.",
    location: "Lakeside Drive",
    price: "$$$$",
    rating: 4.8,
    imageId: "hotel-sunrise",
    amenities: ["Lake View", "Pool", "Wifi"]
  },
  {
    name: "Eden Hotel",
    description: "A lush, green sanctuary offering peace and quiet amidst tropical gardens.",
    location: "Rumonge East",
    price: "$$",
    rating: 4.3,
    imageId: "hotel-eden",
    amenities: ["Gardens", "Breakfast", "Quiet Area"]
  },
  {
    name: "Mawimbi Hotel",
    description: "Modern beach-inspired architecture with direct access to the vibrant shoreline.",
    location: "Saga Coastline",
    price: "$$$",
    rating: 4.6,
    imageId: "hotel-mawimbi",
    amenities: ["Beach Access", "Bar", "Modern Design"]
  },
  {
    name: "Sunbeach Hotel",
    description: "The perfect spot for leisure travelers looking to enjoy the sun and sand of Saga Beach.",
    location: "Saga Beach Area",
    price: "$$$",
    rating: 4.4,
    imageId: "rumonge-beach",
    amenities: ["Pool", "Restaurant", "Sands"]
  },
  {
    name: "Bluebay Hotel",
    description: "An upscale coastal resort offering premium service and stunning panoramic bay views.",
    location: "Bluebay Shore",
    price: "$$$$$",
    rating: 4.9,
    imageId: "rumonge-hero",
    amenities: ["Luxury Spa", "Private Beach", "Fine Dining"]
  },
  {
    name: "Galaxy Hotel",
    description: "Chic, central, and convenient. Galaxy Hotel offers a stellar experience for urban travelers.",
    location: "Main Street",
    price: "$$$",
    rating: 4.2,
    imageId: "local-market",
    amenities: ["City View", "Parking", "Wifi"]
  },
  {
    name: "Ganisqua Hotel",
    description: "A charming local favorite that blends authentic Burundian style with modern comforts.",
    location: "Cultural District",
    price: "$$",
    rating: 4.1,
    imageId: "palm-oil",
    amenities: ["Local Cuisine", "Friendly Staff", "Comfort"]
  }
];

export function StaysList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {hotels.map((hotel, idx) => {
        const img = PlaceHolderImages.find(p => p.id === hotel.imageId);
        return (
          <Card key={idx} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
            <div className="relative h-56 overflow-hidden">
              <Image
                src={img?.imageUrl || "https://picsum.photos/seed/hotel/800/600"}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                data-ai-hint="hotel resort"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
                {hotel.price}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-1 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                <MapPin size={12} className="text-primary" />
                {hotel.location}
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{hotel.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {hotel.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {hotel.amenities.map((amenity, aIdx) => (
                  <Badge key={aIdx} variant="secondary" className="bg-secondary/50 text-[10px] uppercase font-bold px-2 py-0">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-sm">{hotel.rating}</span>
                </div>
                <button className="text-primary text-sm font-bold hover:underline">View Details</button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
