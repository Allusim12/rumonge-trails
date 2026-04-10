"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MessageSquare, User, Loader2, Sparkles, Lightbulb, MapPin, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { getCommunityBuzz, type CommunityBuzzOutput } from "@/ai/flows/community-buzz";

export default function CommunityPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isPosting, setIsPosting] = useState(false);
  const [buzz, setBuzz] = useState<CommunityBuzzOutput | null>(null);
  const [isBuzzLoading, setIsBuzzLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "reviews"), orderBy("createdAt", "desc"), limit(30));
  }, [firestore]);

  const { data: reviews, isLoading: isReviewsLoading } = useCollection(reviewsQuery);

  const tipsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "travelTips"), orderBy("updatedAt", "desc"), limit(10));
  }, [firestore]);

  const { data: tips, isLoading: isTipsLoading } = useCollection(tipsQuery);

  // AI Buzz Generator
  useEffect(() => {
    if (reviews && reviews.length > 0 && !buzz && !isBuzzLoading) {
      setIsBuzzLoading(true);
      const recentReviews = reviews.slice(0, 5).map(r => ({
        userName: r.userName || "Traveler",
        comment: r.comment,
        rating: r.rating
      }));
      
      getCommunityBuzz({ reviews: recentReviews })
        .then(setBuzz)
        .catch(console.error)
        .finally(() => setIsBuzzLoading(false));
    }
  }, [reviews, buzz, isBuzzLoading]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || !firestore || isPosting) return;

    setIsPosting(true);
    try {
      addDocumentNonBlocking(collection(firestore, "reviews"), {
        userId: user.uid,
        userName: user.displayName || user.email?.split('@')[0] || "Anonymous Traveler",
        targetEntityType: "General",
        targetEntityId: "rumonge-commune",
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setComment("");
      setRating(5);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-secondary/5">
      <Navigation />
      
      {/* Header Spotlight */}
      <section className="bg-primary text-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <TrendingUp size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Community Pulse</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">
              The Traveler <span className="text-secondary italic">Exchange</span>
            </h1>
            <p className="text-xl opacity-90 leading-relaxed max-w-xl">
              Connect with adventurers, share your discoveries, and learn the local secrets 
              that make Rumonge unforgettable.
            </p>
          </div>

          <Card className="flex-1 bg-white/10 backdrop-blur-xl border-white/20 text-white shadow-2xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="text-secondary" />
                Traveler Buzz
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isBuzzLoading ? (
                <div className="flex items-center gap-2 text-sm italic py-4">
                  <Loader2 className="animate-spin" size={16} />
                  Amahoro is analyzing recent reviews...
                </div>
              ) : buzz ? (
                <div className="space-y-6">
                  <p className="font-body text-lg italic leading-relaxed">"{buzz.summary}"</p>
                  <div className="flex flex-wrap gap-2">
                    {buzz.trendingTopics.map((topic, i) => (
                      <span key={i} className="bg-secondary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        #{topic.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm opacity-60">Waiting for reviews to generate insights...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-8">
            <Tabs defaultValue="reviews" className="w-full">
              <div className="flex justify-between items-center mb-8">
                <TabsList className="bg-white p-1 rounded-xl shadow-sm border h-auto">
                  <TabsTrigger value="reviews" className="rounded-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                    Feed
                  </TabsTrigger>
                  <TabsTrigger value="tips" className="rounded-lg py-2 px-6 data-[state=active]:bg-primary data-[state=active]:text-white">
                    Pro Tips
                  </TabsTrigger>
                </TabsList>
                <div className="hidden md:flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live Updates
                </div>
              </div>

              <TabsContent value="reviews" className="space-y-6 focus-visible:outline-none">
                {isReviewsLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
                ) : reviews && reviews.length > 0 ? (
                  reviews.map((review: any) => (
                    <Card key={review.id} className="border-none shadow-sm hover:shadow-md transition-all bg-white group overflow-hidden">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-secondary/50 p-2 rounded-xl text-primary font-bold w-12 h-12 flex items-center justify-center">
                              {review.userName?.[0].toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{review.userName}</h4>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1">
                                <MapPin size={10} /> {review.targetEntityType || "General"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={14} className={s <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-100"} />
                            ))}
                          </div>
                        </div>
                        <p className="font-body text-foreground/80 leading-relaxed text-lg border-l-4 border-primary/20 pl-6 italic">
                          "{review.comment}"
                        </p>
                        <div className="mt-6 pt-6 border-t flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                          <span>Verified Traveler</span>
                          <span>
                            {mounted && review.createdAt?.seconds 
                              ? format(new Date(review.createdAt.seconds * 1000), "PPP")
                              : "Recently Posted"}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-muted">
                    <p className="text-muted-foreground">No stories shared yet. Be the first!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tips" className="space-y-6 focus-visible:outline-none">
                {isTipsLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
                ) : tips && tips.length > 0 ? (
                  tips.map((tip: any) => (
                    <Card key={tip.id} className="border-none shadow-sm bg-white overflow-hidden group">
                      <div className="h-1 bg-accent group-hover:h-2 transition-all" />
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4">
                          <div className="bg-accent/10 p-3 rounded-2xl text-accent">
                            <Lightbulb size={24} />
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-accent mb-1 block">{tip.category}</span>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">{tip.title || tip.name}</h3>
                            <p className="text-muted-foreground leading-relaxed">{tip.content || tip.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-muted">
                    <p className="text-muted-foreground">Local tips are being gathered. Check back soon!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Review Form */}
            <Card className="shadow-xl border-none sticky top-28 bg-white overflow-hidden">
               <div className="h-2 bg-primary" />
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <MessageSquare className="text-primary" />
                  Share Your Story
                </CardTitle>
                <CardDescription>How was your journey through the Cultural Trails?</CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="flex justify-center gap-2 mb-4 bg-secondary/20 p-4 rounded-2xl">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="focus:outline-none hover:scale-125 transition-transform"
                        >
                          <Star
                            size={32}
                            className={s <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="What was the highlight of your trip?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[150px] rounded-2xl border-none bg-secondary/30 focus-visible:ring-primary"
                      disabled={isPosting}
                    />
                    <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg" disabled={isPosting}>
                      {isPosting ? <Loader2 className="animate-spin mr-2" /> : "Post to Exchange"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                      <User size={32} />
                    </div>
                    <h4 className="font-bold mb-2 text-lg">Traveler Login Required</h4>
                    <p className="text-muted-foreground text-sm mb-6">Join the community to share your reviews and tips.</p>
                    <Button variant="outline" className="rounded-xl w-full h-12 border-primary text-primary hover:bg-primary/5" asChild>
                      <a href="/login">Login / Join</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Community Stats */}
            <Card className="border-none shadow-md bg-white">
              <CardContent className="p-8">
                <h4 className="font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="text-primary" size={18} />
                  Community Activity
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Reviews</span>
                    <span className="font-bold">{reviews?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pro Tips Shared</span>
                    <span className="font-bold">{tips?.length || 0}</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center text-xs font-bold text-primary uppercase tracking-widest">
                    <span>Average Rating</span>
                    <span>4.8 / 5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
