"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Compass, Instagram, Twitter, Facebook, Mail, MapPin, Loader2, CheckCircle, Map as MapIcon } from "lucide-react";
import { useFirestore } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firestore) return;

    setIsSubmitting(true);
    addDocumentNonBlocking(collection(firestore, "newsletter_subscriptions"), {
      email,
      subscribedAt: serverTimestamp(),
    }).then(() => {
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "Subscribed!",
        description: "Welcome to the Rumonge Trails newsletter."
      });
    }).finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <footer className="bg-foreground text-background py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        {/* Column 1: Brand */}
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <Compass size={24} />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight text-white">
              Rumonge <span className="text-primary italic">Trails</span>
            </span>
          </Link>
          <p className="font-body text-white/60 mb-8 leading-relaxed text-sm">
            Preserving and promoting the unique cultural heritage and natural 
            splendor of Rumonge Commune for future generations.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg"><Instagram size={20} /></a>
            <a href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg"><Twitter size={20} /></a>
            <a href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg"><Facebook size={20} /></a>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div>
          <h4 className="font-headline text-xl font-bold mb-6 text-white">Explore</h4>
          <ul className="space-y-4 font-body text-white/70 text-sm">
            <li><Link href="/wonders" className="hover:text-primary transition-colors">Natural Wonders</Link></li>
            <li><Link href="/heritage" className="hover:text-primary transition-colors">Cultural Heritage</Link></li>
            <li><Link href="/dining" className="hover:text-primary transition-colors">Dining & Cuisine</Link></li>
            <li><Link href="/stays" className="hover:text-primary transition-colors">Hotels & Stays</Link></li>
            <li><Link href="/transport" className="hover:text-primary transition-colors">Transport Guide</Link></li>
            <li><Link href="/itinerary" className="hover:text-primary transition-colors">AI Itinerary Planner</Link></li>
            <li><Link href="/events" className="hover:text-primary transition-colors">Festivals Calendar</Link></li>
          </ul>
        </div>

        {/* Column 3: Visit & Map */}
        <div>
          <h4 className="font-headline text-xl font-bold mb-6 text-white">Visit Us</h4>
          <ul className="space-y-4 font-body text-white/70 text-sm mb-6">
            <li className="flex gap-3">
              <MapPin size={20} className="text-primary shrink-0" />
              <span>Rumonge Center, Commune Rumonge, Burundi</span>
            </li>
            <li className="flex gap-3">
              <Mail size={20} className="text-primary shrink-0" />
              <span>explore@rumongetrails.bi</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Map Display */}
        <div className="lg:col-span-1">
          <h4 className="font-headline text-xl font-bold mb-6 text-white flex items-center gap-2">
            <MapIcon size={20} className="text-primary" />
            Location
          </h4>
          <div className="rounded-xl overflow-hidden h-48 w-full relative border border-white/10 group">
            <iframe 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              scrolling="no" 
              marginHeight={0} 
              marginWidth={0} 
              src="https://www.openstreetmap.org/export/embed.html?bbox=29.414367675781254%2C-3.996160163351919%2C29.462432861328125%2C-3.9507987084920035&amp;layer=mapnik"
              className="grayscale invert opacity-60 contrast-125 group-hover:opacity-100 transition-opacity duration-500"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-xl" />
          </div>
          <Link 
            href="https://www.openstreetmap.org/#map=14/-3.9735/29.4384" 
            target="_blank"
            className="text-[10px] text-white/40 mt-3 block hover:text-primary transition-colors font-bold uppercase tracking-widest"
          >
            View Larger Map
          </Link>
        </div>

        {/* Column 5: Newsletter */}
        <div>
          <h4 className="font-headline text-xl font-bold mb-6 text-white">Newsletter</h4>
          <p className="font-body text-sm text-white/60 mb-6">
            Get monthly updates on events, new discoveries, and travel tips.
          </p>
          {isSubscribed ? (
            <div className="bg-primary/20 p-4 rounded-xl flex items-center gap-2 text-primary border border-primary/20">
              <CheckCircle size={20} />
              <span className="font-bold">You're on the list!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-primary transition-all text-white text-sm"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center min-w-[50px]"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Join"}
              </button>
            </form>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm">
        <p>© 2024 Rumonge Cultural Trails. All rights reserved.</p>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
