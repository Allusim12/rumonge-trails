
"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen pt-20 bg-secondary/5">
      <Navigation />
      
      <section className="bg-primary text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Shield size={48} className="mx-auto mb-6 opacity-80" />
          <h1 className="font-headline text-5xl font-bold mb-4">Privacy <span className="text-secondary italic">Policy</span></h1>
          <p className="text-xl opacity-90 leading-relaxed">
            How we protect your data and respect your journey through Rumonge.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-[2rem] p-12 shadow-xl border space-y-12">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Eye className="text-primary" />
              Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To provide a personalized travel experience, we collect information when you create a profile, 
              save itineraries, or post reviews. This includes your name, email address, and travel preferences.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Database className="text-primary" />
              How We Use Data
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is primarily used to power our AI Itinerary Planner and to manage your personalized wishlist. 
              We use Firebase for secure data storage and authentication. We do not sell your personal information to third parties.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Lock className="text-primary" />
              Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement a variety of security measures to maintain the safety of your personal information. 
              Your sensitive data is encrypted and stored using industry-standard Firebase security protocols.
            </p>
          </div>

          <div className="pt-12 border-t text-sm text-muted-foreground italic text-center">
            Last Updated: June 2024. For questions, contact us at privacy@rumongetrails.bi
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
