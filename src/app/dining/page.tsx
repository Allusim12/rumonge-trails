
"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { Utensils, Star, MapPin, ChefHat, Loader2 } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WishlistButton } from "@/components/WishlistButton";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";

const fallbackDining = [
  {
    id: "cuisine-1",
    name: "Lake View Restaurant",
    description: "Famous for its fresh Lake Tanganyika Tilapia, served with local cassava and palm oil-infused greens.",
    locationName: "Saga Shoreline",
    type: "Restaurant",
    specialties: ["Grilled Tilapia", "Ndagala"],
    rating: 4.8
  },
  {
    id: "cuisine-2",
    name: "Mama's Kitchen",
    description: "Authentic Burundian home cooking in the heart of Rumonge center.",
    locationName: "Rumonge Market Area",
    type: "Local Eatery",
    specialties: ["Beans & Plantains"],
    rating: 4.6
  }
];

export default function DiningPage() {
  const firestore = useFirestore();
  const cuisineImg = PlaceHolderImages.find(img => img.id === "cuisine");

  const diningQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "localCuisineSpots"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: dbDining, isLoading } = useCollection(diningQuery);

  const displayDining = React.useMemo(() => {
    if (dbDining && dbDining.length > 0) return dbDining;
    return fallbackDining;
  }, [dbDining]);

  return (
    <main className="min-h-screen pt-20 bg-background">
      <Navigation />
      
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src={cuisineImg?.imageUrl || "https://picsum.photos/seed/food/1920/1080"}
          alt="Rumonge Cuisine"
          fill
          className="object-cover brightness-50"
          data-ai-hint="local cuisine food"
        />
        <div className="relative z-10 text-center text-white px-6">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-4 rounded-2xl">
              <Utensils size={40} />
            </div>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-4">
            A Taste of <span className="text-primary italic">Rumonge</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 font-body">
            From the deep blue of Tanganyika to the lush palm estates, 
            discover the authentic flavors of the South.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 items-center">
          <div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">Gourmet Guide</span>
            <h2 className="font-headline text-4xl font-bold mb-6">Culinary <span className="text-accent italic">Treasures</span></h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Rumonge is the culinary heart of southern Burundi. Our cuisine is defined by the 
              richness of Lake Tanganyika and the ubiquitous presence of high-quality palm oil.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <ChefHat className="text-primary shrink-0" />
                <div>
                  <h4 className="font-bold">Authentic Ingredients</h4>
                  <p className="text-sm text-muted-foreground">Every dish tells a story of the land and the lake. Taste the freshness in every bite.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl">
             <Image
              src="https://picsum.photos/seed/tilapia/800/600"
              alt="Grilled Fish"
              fill
              className="object-cover"
              data-ai-hint="grilled tilapia fish"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayDining.map((spot) => (
              <Card key={spot.id} className="border-none shadow-xl overflow-hidden group hover:-translate-y-2 transition-all duration-300 bg-white">
                <div className="relative h-48">
                  <Image
                    src={`https://picsum.photos/seed/${spot.id}/800/600`}
                    alt={spot.name}
                    fill
                    className="object-cover"
                    data-ai-hint="restaurant interior"
                  />
                  <div className="absolute top-4 right-4">
                    <WishlistButton entityId={spot.id} entityType="LocalCuisineSpot" entityName={spot.name} />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-2">{spot.type}</Badge>
                  <h3 className="font-headline text-xl font-bold mb-2 group-hover:text-primary transition-colors">{spot.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{spot.description}</p>
                  
                  {spot.specialties && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {spot.specialties.slice(0, 3).map((s: string, idx: number) => (
                        <span key={idx} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">{s}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t pt-4 text-xs font-bold text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-primary" />
                      {spot.locationName || spot.address || "Rumonge"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-yellow-500 text-yellow-500" />
                      {spot.rating || "4.7"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
