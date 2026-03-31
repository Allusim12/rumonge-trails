
"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { EntityManagement } from "@/components/admin/EntityManagement";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Loader2, 
  ShieldAlert, 
  Lock, 
  Database, 
  Sparkles, 
  MapPin, 
  MessageSquare, 
  ClipboardList, 
  TrendingUp,
  Menu,
  Settings2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { seedInitialData } from "@/lib/seed-data";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("wonderAttractions");
  const [isSeeding, setIsSeeding] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminDocRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, "roles_admin", user.uid) : null
  , [firestore, user?.uid]);

  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminDocRef);

  // Stats fetching
  const wondersQuery = useMemoFirebase(() => firestore ? collection(firestore, "wonderAttractions") : null, [firestore]);
  const reviewsQuery = useMemoFirebase(() => firestore ? collection(firestore, "reviews") : null, [firestore]);
  const bookingsQuery = useMemoFirebase(() => firestore ? collection(firestore, "bookingRequests") : null, [firestore]);

  const { data: wonders } = useCollection(wondersQuery);
  const { data: reviews } = useCollection(reviewsQuery);
  const { data: bookings } = useCollection(bookingsQuery);

  const handleSeedData = async () => {
    if (!firestore) return;
    setIsSeeding(true);
    try {
      await seedInitialData(firestore);
      toast({
        title: "Database Seeded!",
        description: "Initial Rumonge content has been added to your database.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Seed Failed",
        description: "There was an error populating the database."
      });
    } finally {
      setIsSeeding(false);
    }
  };

  if (isUserLoading || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  if (!user || !adminRole) {
    return (
      <main className="min-h-screen pt-20 flex flex-col items-center justify-center p-6 bg-secondary/10 text-center">
        <Navigation />
        <Card className="max-w-md border-none shadow-2xl">
          <CardHeader>
            <div className="mx-auto bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center text-destructive mb-4">
              <ShieldAlert size={32} />
            </div>
            <CardTitle className="text-2xl font-headline">Access Restricted</CardTitle>
            <CardDescription>
              This area is reserved for Rumonge Cultural Trails administrators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              If you believe you should have access, please contact the system administrator.
            </p>
            <button 
              onClick={() => router.push("/")}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-all"
            >
              Return to Home
            </button>
          </CardContent>
        </Card>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16 bg-secondary/10 flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-4 md:p-8 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          
          <Card className="mt-6 border-primary/20 bg-primary/5 overflow-hidden rounded-3xl">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                <Database size={14} />
                Database Tools
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Sync all hardcoded Rumonge features into Firestore to make them fully editable.
              </p>
              <Button 
                onClick={handleSeedData} 
                disabled={isSeeding}
                variant="outline" 
                className="w-full h-11 rounded-xl text-xs font-bold border-primary text-primary hover:bg-primary/10"
              >
                {isSeeding ? <Loader2 className="animate-spin h-4 w-4" /> : <><Sparkles size={14} className="mr-2" /> Seed Initial Data</>}
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Management Area */}
        <section className="flex-1 min-w-0">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Hamburger for Mobile - Ensuring background is NOT transparent */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="lg:hidden rounded-xl border-primary bg-white shadow-md hover:bg-white active:scale-95 transition-all"
                  >
                    <Menu className="text-primary h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80 bg-white shadow-2xl border-r">
                  <AdminSidebar 
                    activeTab={activeTab} 
                    onTabChange={setActiveTab} 
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                  <div className="p-6 border-t mt-auto">
                    <Button 
                      onClick={handleSeedData} 
                      disabled={isSeeding}
                      className="w-full h-12 rounded-xl"
                    >
                      {isSeeding ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                      Seed Initial Data
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div>
                <h1 className="text-3xl md:text-4xl font-headline font-bold">Admin <span className="text-primary italic">Console</span></h1>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Settings2 size={14} className="text-primary" />
                  Managing {activeTab.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm border px-6 py-2 rounded-full flex items-center gap-2 text-primary font-bold text-sm shadow-sm">
              <Lock size={14} />
              Secure Administrative Access
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Wonders", value: wonders?.length || 0, icon: <MapPin className="text-primary" />, bg: "bg-primary/10" },
              { label: "Reviews", value: reviews?.length || 0, icon: <MessageSquare className="text-accent" />, bg: "bg-accent/10" },
              { label: "Bookings", value: bookings?.length || 0, icon: <ClipboardList className="text-blue-600" />, bg: "bg-blue-50" },
              { label: "Pulse", value: "Active", icon: <TrendingUp className="text-green-600" />, bg: "bg-green-50" }
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-2xl">
                <CardContent className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-xl`}>
                    {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-white rounded-3xl p-1 md:p-0 shadow-sm border overflow-hidden">
             <EntityManagement collectionName={activeTab} />
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
