"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useUser, useAuth, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { collection, query, orderBy, limit, doc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, Heart, Map, Clock, ChevronRight, Sparkles, ShieldCheck, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { format } from "date-fns";
import { setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { auth } = useAuth();
  const { firestore } = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [isPromoting, setIsPromoting] = useState(false);

  const adminDocRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, "roles_admin", user.uid) : null
  , [firestore, user?.uid]);

  const { data: adminRole } = useDoc(adminDocRef);

  const itinerariesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "itineraries"), 
      orderBy("createdAt", "desc"), 
      limit(5)
    );
  }, [firestore, user?.uid]);

  const { data: itineraries, isLoading: isItinerariesLoading } = useCollection(itinerariesQuery);

  const wishlistQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "users", user.uid, "savedItems"),
      orderBy("savedAt", "desc")
    );
  }, [firestore, user?.uid]);

  const { data: wishlist, isLoading: isWishlistLoading } = useCollection(wishlistQuery);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  const handleDeleteSavedItem = (id: string) => {
    if (!firestore || !user) return;
    deleteDocumentNonBlocking(doc(firestore, "users", user.uid, "savedItems", id));
    toast({ title: "Removed", description: "Item removed from your wishlist." });
  };

  const handleBecomeAdmin = async () => {
    if (!firestore || !user) return;
    setIsPromoting(true);
    
    try {
      const adminRef = doc(firestore, "roles_admin", user.uid);
      await setDocumentNonBlocking(adminRef, {
        id: user.uid,
        email: user.email,
        promotedAt: serverTimestamp(),
      }, { merge: true });
      
      toast({
        title: "Admin Access Granted",
        description: "You now have access to the Admin Dashboard.",
      });
    } finally {
      setIsPromoting(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <main className="min-h-screen pt-20 bg-secondary/10">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl bg-white">
              <CardContent className="pt-10 pb-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-headline text-2xl font-bold">{user.displayName || "Explorer"}</h2>
                <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
                <div className="flex flex-col gap-3">
                  {!adminRole ? (
                    <Button 
                      onClick={handleBecomeAdmin} 
                      disabled={isPromoting}
                      variant="outline" 
                      className="rounded-xl border-primary text-primary hover:bg-primary/10"
                    >
                      {isPromoting ? <Loader2 className="animate-spin mr-2" size={16} /> : <ShieldCheck size={16} className="mr-2" />}
                      Grant Admin Access
                    </Button>
                  ) : (
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border border-primary/20">
                      <ShieldCheck size={16} />
                      Administrator Account
                    </div>
                  )}
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <Settings size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl" onClick={handleLogout}>
              <LogOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-headline text-3xl font-bold mb-4">My <span className="text-primary italic">Journey</span></h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Itineraries */}
              <Card className="border-none shadow-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Map className="text-primary" size={20} />
                      Saved Itineraries
                    </CardTitle>
                    <CardDescription>Your personalized plans for Rumonge</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => router.push('/itinerary')}>
                    New Plan <Sparkles size={14} className="ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {isItinerariesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  ) : itineraries && itineraries.length > 0 ? (
                    <div className="space-y-4">
                      {itineraries.map((it) => (
                        <div 
                          key={it.id} 
                          className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                              <Map size={20} className="text-primary" />
                            </div>
                            <div>
                              <h4 className="font-bold group-hover:text-primary transition-colors">{it.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {it.lengthOfStayDays} Days • Created {it.createdAt?.seconds ? format(new Date(it.createdAt.seconds * 1000), "PPP") : "Recent"}
                              </p>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground italic text-sm">
                      No saved itineraries yet.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Wishlist */}
              <Card className="border-none shadow-md bg-white">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="text-accent" size={20} />
                    Wishlist
                  </CardTitle>
                  <CardDescription>Attractions and spots you want to visit</CardDescription>
                </CardHeader>
                <CardContent>
                  {isWishlistLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="animate-spin text-accent" />
                    </div>
                  ) : wishlist && wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl bg-background hover:border-accent transition-all group">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-accent tracking-widest">{item.savedEntityType}</span>
                            <h4 className="font-bold">{item.savedEntityName}</h4>
                          </div>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => handleDeleteSavedItem(item.id)}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground italic text-sm bg-secondary/10 rounded-xl border border-dashed border-secondary">
                      Your wishlist is empty. Start exploring the wonders!
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
