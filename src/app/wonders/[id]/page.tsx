"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, query, where, orderBy } from "firebase/firestore";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Star, Calendar, ArrowLeft, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { WishlistButton } from "@/components/WishlistButton";
import { format } from "date-fns";

export default function WonderDetailPage() {
  const { id } = useParams();
  const firestore = useFirestore();

  const wonderRef = useMemoFirebase(() => 
    firestore ? doc(firestore, "wonderAttractions", id as string) : null
  , [firestore, id]);

  const { data: wonder, isLoading } = useDoc(wonderRef);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "reviews"),
      where("targetEntityId", "==", id),
      orderBy("createdAt", "desc")
    );
  }, [firestore, id]);

  const { data: reviews, isLoading: isReviewsLoading } = useCollection(reviewsQuery);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!wonder) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <Navigation />
        <h1 className="text-2xl font-bold mb-4">Wonder Not Found</h1>
        <Link href="/wonders" className="text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Back to Wonders
        </Link>
        <Footer />
      </div>
    );
  }

  const heroImg = PlaceHolderImages.find(img => img.id === "rumonge-hero");

  return (
    <main className="min-h-screen bg-secondary/5">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <Image
          src={heroImg?.imageUrl || "https://picsum.photos/seed/rumonge1/1920/1080"}
          alt={wonder.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
              <Link href="/wonders" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-4 text-sm font-bold uppercase tracking-widest transition-colors">
                <ArrowLeft size={16} /> Back to Wonders
              </Link>
              <Badge className="bg-primary text-white border-none mb-4">{wonder.type}</Badge>
              <h1 className="font-headline text-5xl md:text-7xl font-bold">{wonder.name}</h1>
              <div className="flex items-center gap-4 mt-4 text-sm font-bold">
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-primary" />
                  {wonder.address}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-500 text-yellow-500" />
                  {wonder.rating || "4.8"}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <WishlistButton 
                entityId={wonder.id} 
                entityType="WonderAttraction" 
                entityName={wonder.name} 
                className="w-14 h-14 bg-white/20 hover:bg-white text-white hover:text-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-headline text-3xl font-bold mb-6">About the <span className="text-primary italic">Wonder</span></h2>
            <p className="text-muted-foreground text-xl leading-relaxed whitespace-pre-wrap">
              {wonder.description}
            </p>
          </div>

          <div className="bg-white p-12 rounded-[2rem] shadow-xl border border-primary/10">
            <h3 className="font-headline text-2xl font-bold mb-8 flex items-center gap-3">
              <MessageSquare className="text-primary" />
              Traveler Reviews
            </h3>
            
            {isReviewsLoading ? (
              <Loader2 className="animate-spin text-primary" />
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-8">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-8 last:pb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-primary">
                          {review.userName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold">{review.userName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            {review.createdAt?.seconds ? format(new Date(review.createdAt.seconds * 1000), "PPP") : "Recent"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={cn(s <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-200")} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No reviews yet for this wonder. Be the first to share your experience!</p>
            )}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-xl bg-white overflow-hidden rounded-[2rem]">
            <CardHeader className="bg-primary/5 p-8 border-b">
              <CardTitle className="font-headline text-2xl">Location <span className="text-primary italic">Details</span></CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary h-fit">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Coordinates</p>
                  <p className="font-bold">{wonder.latitude?.toFixed(4)}, {wonder.longitude?.toFixed(4)}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 p-3 rounded-2xl text-primary h-fit">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Best Time to Visit</p>
                  <p className="font-bold">Year-round, Sunset preferred</p>
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
