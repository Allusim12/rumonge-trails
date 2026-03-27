"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { EntityManagement } from "@/components/admin/EntityManagement";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, ShieldAlert, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("wonderAttractions");

  const adminDocRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, "roles_admin", user.uid) : null
  , [firestore, user?.uid]);

  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminDocRef);

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
    <main className="min-h-screen pt-16 bg-secondary/5 flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full p-6 gap-8">
        {/* Admin Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        </aside>

        {/* Management Area */}
        <section className="flex-1 min-w-0">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-headline font-bold">Admin <span className="text-primary italic">Console</span></h1>
              <p className="text-muted-foreground">Managing data for {activeTab.replace(/([A-Z])/g, ' $1').trim()}</p>
            </div>
            <div className="bg-primary/10 px-4 py-2 rounded-full flex items-center gap-2 text-primary font-bold text-sm">
              <Lock size={14} />
              Secured Session
            </div>
          </div>
          
          <EntityManagement collectionName={activeTab} />
        </section>
      </div>

      <Footer />
    </main>
  );
}