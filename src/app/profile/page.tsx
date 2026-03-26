
"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useUser, useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, Heart, Map, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const { auth } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/");
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
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
            <Card className="border-none shadow-xl">
              <CardContent className="pt-10 pb-8 text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-white shadow-lg">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback className="text-2xl bg-primary text-white">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-headline text-2xl font-bold">{user.displayName || "Explorer"}</h2>
                <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm" className="rounded-full">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="text-accent" size={20} />
                    Saved Wonders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground italic text-sm">
                    No saved wonders yet. Explore Rumonge and heart your favorites!
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Map className="text-primary" size={20} />
                    My Itineraries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground italic text-sm">
                    Generate an AI itinerary to get started.
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock size={20} />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-xl">
                    <div className="bg-primary/10 p-2 rounded-full text-primary">
                      <Map size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Joined Rumonge Cultural Trails</p>
                      <p className="text-xs text-muted-foreground">Welcome to the commune!</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
