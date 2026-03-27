
"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase";
import { collection, serverTimestamp, query, orderBy, limit } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageSquare, User, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function CommunityPage() {
  const { firestore } = useFirestore();
  const { user } = useUser();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [isPosting, setIsPosting] = useState(false);

  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "reviews"), orderBy("createdAt", "desc"), limit(20));
  }, [firestore]);

  const { data: reviews, isLoading } = useCollection(reviewsQuery);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim() || !firestore || isPosting) return;

    setIsPosting(true);
    try {
      await addDocumentNonBlocking(collection(firestore, "reviews"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous Traveler",
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
    <main className="min-h-screen pt-20">
      <Navigation />
      <div className="bg-secondary/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-5xl font-bold mb-4">Traveler <span className="text-primary italic">Community</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Share your experiences and connect with fellow adventurers visiting Rumonge.</p>
        </div>
      </div>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Review Form */}
          <div className="lg:col-span-4">
            <Card className="sticky top-28 shadow-xl border-none">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <MessageSquare className="text-primary" />
                  Leave a Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="flex gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRating(s)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={24}
                            className={s <= rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                    <Textarea
                      placeholder="Tell us about your trip..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[150px] rounded-xl"
                      disabled={isPosting}
                    />
                    <Button type="submit" className="w-full rounded-xl font-bold" disabled={isPosting}>
                      {isPosting ? <Loader2 className="animate-spin mr-2" /> : "Post Review"}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Please log in to share your experience.</p>
                    <Button variant="outline" className="rounded-xl w-full" asChild>
                      <a href="/login">Login to Rumonge Trails</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-headline text-3xl font-bold mb-8">What People Are Saying</h2>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-primary w-10 h-10" />
              </div>
            ) : reviews && reviews.length > 0 ? (
              reviews.map((review: any) => (
                <Card key={review.id} className="border-none shadow-md overflow-hidden bg-white hover:shadow-lg transition-all">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold">{review.userName}</h4>
                          <p className="text-xs text-muted-foreground">
                            {review.createdAt?.seconds 
                              ? format(new Date(review.createdAt.seconds * 1000), "PPP")
                              : "Just now"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={14}
                            className={s <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-200"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="font-body text-foreground leading-relaxed italic">"{review.comment}"</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 bg-secondary/10 rounded-3xl border-2 border-dashed border-secondary">
                <p className="text-muted-foreground">No reviews yet. Be the first to share!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
