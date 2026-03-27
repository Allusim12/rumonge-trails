
"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { Bus, Bike, Ship, MapPin, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const options = [
  {
    icon: <Bike className="text-primary" />,
    title: "Motorcycle Taxis (Boda-Boda)",
    desc: "The fastest way to move within Rumonge. Negotiate fares before departing. Ideal for short trips and reaching the beaches.",
    fare: "1,000 - 3,000 BIF",
    availability: "24/7"
  },
  {
    icon: <Bus className="text-primary" />,
    title: "Shared Minibuses",
    desc: "Connecting Rumonge center to Bujumbura and Makamba. They depart when full from the main parking hub.",
    fare: "5,000 - 8,000 BIF",
    availability: "Daytime (6 AM - 6 PM)"
  },
  {
    icon: <Ship className="text-primary" />,
    title: "Lake Ferries & Boats",
    desc: "Traditional boats and some larger ferries connect Rumonge to Nyanza-Lac and other lakeside villages.",
    fare: "Varies by route",
    availability: "Scheduled / Charter"
  }
];

export default function TransportPage() {
  return (
    <main className="min-h-screen pt-20 bg-secondary/5">
      <Navigation />
      
      <div className="bg-primary py-24 px-6 text-white text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">Getting <span className="text-background italic">Around</span></h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Navigation in Rumonge is an adventure in itself. From the rhythmic hum of motorcycles 
            to the steady glide of lakeside ferries.
          </p>
        </div>
      </div>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {options.map((opt, idx) => (
            <Card key={idx} className="border-none shadow-xl bg-white">
              <CardHeader>
                <div className="bg-secondary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  {opt.icon}
                </div>
                <CardTitle className="font-headline text-2xl">{opt.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">{opt.desc}</p>
                <div className="flex gap-4">
                  <div className="bg-secondary/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight">
                    <span className="block text-[10px] text-muted-foreground">Estimated Fare</span>
                    {opt.fare}
                  </div>
                  <div className="bg-secondary/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight">
                    <span className="block text-[10px] text-muted-foreground">Availability</span>
                    {opt.availability}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-12 rounded-3xl shadow-xl border border-primary/10">
            <h2 className="font-headline text-3xl font-bold mb-8 flex items-center gap-3">
              <Info className="text-primary" />
              Pro Travel Tips
            </h2>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full text-primary h-fit">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Central Hub</h4>
                  <p className="text-muted-foreground text-sm">Most transport options depart from the "Parking de Rumonge" near the central market.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="bg-primary/10 p-2 rounded-full text-primary h-fit">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold mb-1">Timing is Everything</h4>
                  <p className="text-muted-foreground text-sm">Travel between cities is safest and most reliable before sunset. Avoid late-night intercity travel.</p>
                </div>
              </li>
            </ul>
          </div>

          <Alert className="bg-accent/5 border-accent/20 p-8 rounded-3xl">
            <AlertTitle className="text-accent font-headline text-2xl mb-4">Safety First</AlertTitle>
            <AlertDescription className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                When using motorcycle taxis, ensure the driver has a spare helmet for you. While the 
                commune is generally safe, it's best to use well-known transport hubs for intercity travel.
              </p>
              <p className="font-bold text-accent">
                Always carry small denominations of Burundian Francs (BIF) for local fares.
              </p>
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
