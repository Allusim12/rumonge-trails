
"use client";

import React from "react";
import { Hotel, Utensils, Bus, Info, CheckCircle, Smartphone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const infoSections = [
  {
    icon: <Hotel className="text-primary" />,
    title: "Accommodation",
    content: "From luxury lakeside resorts like Saga to cozy guesthouses in the town center, Rumonge offers diverse options for every budget."
  },
  {
    icon: <Utensils className="text-primary" />,
    title: "Local Cuisine",
    content: "Don't miss the famous Lake Tanganyika Ndagala (small fish), grilled Tilapia, and traditional dishes served with palm oil-infused cassava."
  },
  {
    icon: <Bus className="text-primary" />,
    title: "Getting Around",
    content: "Local buses connect Rumonge to Bujumbura (approx 1.5 hours). Within the commune, motorcycle taxis and bicycles are the most common transport."
  },
  {
    icon: <Smartphone className="text-primary" />,
    title: "Connectivity",
    content: "Main Burundian networks (Econet, Lumitel) provide good 4G coverage in most areas of the commune."
  }
];

export function InfoHub() {
  return (
    <section id="guide" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">Travel Smart</span>
            <h2 className="font-headline text-4xl md:text-5xl font-bold mb-8">
              Essential <span className="text-primary italic">Visitor Guide</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-10 leading-relaxed">
              Everything you need to know to make your trip to Rumonge seamless and unforgettable. 
              Our commune is ready to welcome you with open arms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {infoSections.map((info, idx) => (
                <div key={idx} className="bg-secondary/20 p-6 rounded-2xl border border-secondary transition-all hover:border-primary/30">
                  <div className="bg-white w-10 h-10 rounded-lg flex items-center justify-center shadow-sm mb-4">
                    {info.icon}
                  </div>
                  <h3 className="font-headline text-xl font-bold mb-2">{info.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{info.content}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-3xl p-8 lg:p-12 border-2 border-primary/10">
            <h3 className="font-headline text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="text-primary" />
              Frequently Asked Questions
            </h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-primary/10">
                <AccordionTrigger className="text-left font-headline font-bold text-lg hover:text-primary">Best time to visit?</AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  The dry seasons (June to August and December to February) are ideal for beach activities and hiking, as the weather is consistently sunny.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-primary/10">
                <AccordionTrigger className="text-left font-headline font-bold text-lg hover:text-primary">Is it safe for tourists?</AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  Yes, Rumonge is known for its peaceful community and warm hospitality towards international visitors.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-primary/10">
                <AccordionTrigger className="text-left font-headline font-bold text-lg hover:text-primary">What should I pack?</AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  Light tropical clothing, sun protection, swimwear for the lake, and comfortable walking shoes for hill trails.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="border-primary/10">
                <AccordionTrigger className="text-left font-headline font-bold text-lg hover:text-primary">Currency & Payments?</AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  Burundian Franc (BIF) is the primary currency. While some hotels accept cards, it's essential to carry cash for local markets and transport.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-10 p-6 bg-white rounded-2xl shadow-sm border border-primary/20">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-primary">
                <CheckCircle size={20} />
                Quick Travel Tips
              </h4>
              <ul className="space-y-3 font-body text-sm text-muted-foreground">
                <li>• Learn basic Kirundi phrases (Amahoro = Hello)</li>
                <li>• Ask permission before photographing locals</li>
                <li>• Support the economy by buying from local artisans</li>
                <li>• Respect the environment and the lake ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
