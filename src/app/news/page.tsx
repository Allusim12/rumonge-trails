
"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TrendingList } from "@/components/TrendingList";
import { ChatGuide } from "@/components/ChatGuide";
import { Newspaper } from "lucide-react";

export default function NewsPage() {
  return (
    <main className="min-h-screen pt-20 bg-secondary/5">
      <Navigation />
      
      <section className="bg-primary text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/20">
            <Newspaper size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Rumonge Pulse</span>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">
            Trending <span className="text-secondary italic">News</span>
          </h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-2xl font-body">
            Stay informed with the latest developments, stories, and cultural highlights directly from the heart of Rumonge.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <TrendingList />
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
