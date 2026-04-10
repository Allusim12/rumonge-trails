"use client";

import React, { useState, useEffect } from "react";
import { useFirestore, useCollection, useUser, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, Loader2, User, Send } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function TrendingList() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const newsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "trendingUpdates"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: news, isLoading } = useCollection(newsQuery);

  const handleLike = async (postId: string, liked: boolean) => {
    if (!user || !firestore) return;
    const postRef = doc(firestore, "trendingUpdates", postId);
    await updateDoc(postRef, {
      likedBy: liked ? arrayRemove(user.uid) : arrayUnion(user.uid)
    });
  };

  const handlePostComment = async (postId: string) => {
    if (!user || !commentText.trim() || !firestore) return;
    const commentsRef = collection(firestore, "trendingUpdates", postId, "comments");
    
    addDocumentNonBlocking(commentsRef, {
      userId: user.uid,
      userName: user.displayName || user.email?.split('@')[0] || "Anonymous",
      text: commentText.trim(),
      createdAt: serverTimestamp(),
    });
    
    setCommentText("");
    setCommentingOn(null);
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {news?.map((post) => (
        <Card key={post.id} className="border-none shadow-xl bg-white overflow-hidden rounded-3xl group">
          <div className="relative h-64">
            <Image
              src={post.imageUrl || "https://picsum.photos/seed/news/800/600"}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-white border-none px-3 py-1 font-bold">
                {post.category}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2">
              {mounted && post.createdAt?.seconds ? format(new Date(post.createdAt.seconds * 1000), "PPP") : "Just now"}
            </div>
            <CardTitle className="font-headline text-3xl group-hover:text-primary transition-colors">{post.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">{post.content}</p>
            
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => handleLike(post.id, post.likedBy?.includes(user?.uid || ""))}
                  className={cn(
                    "flex items-center gap-2 text-sm font-bold transition-colors",
                    post.likedBy?.includes(user?.uid || "") ? "text-accent" : "text-muted-foreground hover:text-accent"
                  )}
                >
                  <Heart size={20} className={post.likedBy?.includes(user?.uid || "") ? "fill-current" : ""} />
                  {post.likedBy?.length || 0}
                </button>
                <button 
                  onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                  className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle size={20} />
                  Comment
                </button>
              </div>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Share2 size={20} />
              </button>
            </div>

            {commentingOn === post.id && (
              <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
                {user ? (
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Share your thoughts..." 
                      className="rounded-xl min-h-[80px] bg-secondary/30 border-none"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button onClick={() => handlePostComment(post.id)} size="icon" className="shrink-0 h-auto">
                      <Send size={18} />
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic bg-secondary/20 p-3 rounded-lg text-center">
                    Please log in to participate in the conversation.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {!news?.length && (
        <div className="col-span-full py-24 text-center bg-white rounded-3xl border-2 border-dashed border-muted">
          <p className="text-muted-foreground">No news updates at the moment. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
