
"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Loader2 } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { WishlistButton } from "@/components/WishlistButton";

const staticHotels = [
  {
    id: "hotel-1",
    name: "Niyibituronsa Hotel",
    description: "A central Rumonge landmark known for its traditional hospitality and business-friendly amenities.",
    address: "Rumonge Town Center",
    price: "$$$",
    rating: 4.5,
    imageUrl: "https://picsum.photos/seed/hotel1/800/600",
    amenities: ["Wifi", "Restaurant", "Conference Rooms"]
  },
  {
    id: "hotel-2",
    name: "Sunrise Hotel",
    description: "Experience breathtaking morning views over Lake Tanganyika in this serene lakeside retreat.",
    address: "Lakeside Drive",
    price: "$$$$",
    rating: 4.8,
    imageUrl: "https://picsum.photos/seed/hotel2/800/600",
    amenities: ["Lake View", "Pool", "Wifi"]
  }
];

export function StaysList() {
  const firestore = useFirestore();

  const staysQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "accommodations"), orderBy("updatedAt", "desc"));
  }, [firestore]);

  const { data: dbStays, isLoading } = useCollection(staysQuery);

  const allStays = React.useMemo(() => {
    const combined = [...(dbStays || []), ...staticHotels];
    return combined.filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i);
  }, [dbStays]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {allStays.map((hotel, idx) => {
        return (
          <Card key={hotel.id || idx} className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden bg-white">
            <div className="relative h-56 overflow-hidden">
              <Image
                src={hotel.imageUrl || "https://picsum.photos/seed/hotel/800/600"}
                alt={hotel.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                data-ai-hint="hotel resort"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
                  {hotel.price || "$$$"}
                </div>
                <WishlistButton 
                  entityId={hotel.id} 
                  entityType="Accommodation" 
                  entityName={hotel.name} 
                />
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-1 text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                <MapPin size={12} className="text-primary" />
                {hotel.address || "Rumonge"}
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{hotel.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {hotel.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {(hotel.amenities || ["Wifi", "Lakeside", "Service"]).map((amenity: string, aIdx: number) => (
                  <Badge key={aIdx} variant="secondary" className="bg-secondary/50 text-[10px] uppercase font-bold px-2 py-0">
                    {amenity}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-sm">{hotel.rating || "4.5"}</span>
                </div>
                <Link 
                  href={`/stays/${hotel.id}`}
                  className="text-primary text-sm font-bold hover:underline"
                >
                  View Details
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
