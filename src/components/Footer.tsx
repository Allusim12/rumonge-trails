
import React from "react";
import Link from "next/link";
import { Compass, Instagram, Twitter, Facebook, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="bg-primary p-2 rounded-lg text-primary-foreground">
              <Compass size={24} />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tight text-white">
              Rumonge <span className="text-primary italic">Trails</span>
            </span>
          </Link>
          <p className="font-body text-white/60 mb-8 leading-relaxed">
            Preserving and promoting the unique cultural heritage and natural 
            splendor of Rumonge Commune for future generations.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg"><Instagram size={20} /></a>
            <a href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg"><Twitter size={20} /></a>
            <a href="#" className="p-2 bg-white/5 hover:bg-primary transition-colors rounded-lg"><Facebook size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-headline text-xl font-bold mb-6 text-white">Explore</h4>
          <ul className="space-y-4 font-body text-white/70">
            <li><Link href="/wonders" className="hover:text-primary transition-colors">Natural Wonders</Link></li>
            <li><Link href="/heritage" className="hover:text-primary transition-colors">Cultural Heritage</Link></li>
            <li><Link href="/itinerary" className="hover:text-primary transition-colors">AI Itinerary Planner</Link></li>
            <li><Link href="/events" className="hover:text-primary transition-colors">Festivals Calendar</Link></li>
            <li><Link href="/guide" className="hover:text-primary transition-colors">Visitor Guide</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline text-xl font-bold mb-6 text-white">Visit Us</h4>
          <ul className="space-y-4 font-body text-white/70">
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

        <div>
          <h4 className="font-headline text-xl font-bold mb-6 text-white">Newsletter</h4>
          <p className="font-body text-sm text-white/60 mb-6">
            Get monthly updates on events, new discoveries, and travel tips.
          </p>
          <form className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-primary transition-all"
            />
            <button className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-all">
              Join
            </button>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm">
        <p>© 2024 Rumonge Cultural Trails. All rights reserved.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
