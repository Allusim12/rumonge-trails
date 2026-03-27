"use client";

import React from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { Building2, User, Mail, MapPin, Phone, ShieldCheck, Landmark, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function OfficePage() {
  return (
    <main className="min-h-screen pt-20 bg-secondary/5">
      <Navigation />
      
      <section className="bg-primary text-white py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 border border-white/20">
            <Landmark size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Official Administration</span>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6">
            Commune <span className="text-secondary italic">Rumonge Office</span>
          </h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-2xl font-body">
            Dedicated to the service of the people, the preservation of our cultural heritage, 
            and the sustainable development of Rumonge Commune.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Administrator Spotlight */}
          <div className="lg:col-span-7 space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/10">
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden shrink-0 shadow-lg border-4 border-white">
                <Image
                  src="https://picsum.photos/seed/admin/400/400"
                  alt="Augustin MINANI"
                  fill
                  className="object-cover"
                  data-ai-hint="portrait professional man"
                />
              </div>
              <div className="text-center md:text-left">
                <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2 block">Administrator of Rumonge Commune</span>
                <h2 className="font-headline text-4xl font-bold mb-4 text-foreground">Augustin <span className="text-primary italic">MINANI</span></h2>
                <p className="text-muted-foreground leading-relaxed italic mb-6">
                  "Our mission is to foster a Rumonge that thrives through its traditions while 
                  embracing modern opportunities for all our citizens and visitors."
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                   <div className="bg-primary/5 px-4 py-2 rounded-xl text-xs font-bold text-primary border border-primary/10 flex items-center gap-2">
                    <ShieldCheck size={14} /> Executive Leadership
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="font-headline text-3xl font-bold flex items-center gap-3">
                <Info className="text-primary" />
                Office <span className="text-primary italic">Responsibilities</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Public Service", desc: "Coordinating local administrative services and civil status management." },
                  { title: "Economic Growth", desc: "Supporting local industries, markets, and the vital palm oil sector." },
                  { title: "Heritage Support", desc: "Active promotion of the Rumonge Cultural Trails and tourist sites." },
                  { title: "Infrastructure", desc: "Managing the commune's roads, public spaces, and lakeside zones." }
                ].map((item, i) => (
                  <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-bold text-primary">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact & Location */}
          <aside className="lg:col-span-5 space-y-8">
            <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-primary/5 p-8 border-b">
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <Building2 className="text-primary" />
                  Official <span className="text-primary italic">Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex gap-4">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary h-fit">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Office Location</p>
                    <p className="font-bold text-lg leading-tight">Rumonge Center, RN3 Road<br />Rumonge Commune, Burundi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary h-fit">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Email Inquiry</p>
                    <p className="font-bold text-lg">admin@rumonge-commune.bi</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="bg-primary/10 p-4 rounded-2xl text-primary h-fit">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Phone Line</p>
                    <p className="font-bold text-lg">+257 22 23 45 67</p>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-4">Office Hours</p>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Monday - Friday</span>
                    <span className="font-bold">07:30 - 15:30</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-50">
                    <span>Sat, Sun & Public Holidays</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-secondary/20 p-8 rounded-[2rem] border border-dashed border-secondary-foreground/20 text-center">
              <h4 className="font-bold mb-2">Visitor Registration</h4>
              <p className="text-sm text-muted-foreground mb-6">International groups are encouraged to notify the office of their visit.</p>
              <button className="w-full bg-white text-foreground border h-12 rounded-xl font-bold hover:bg-secondary/50 transition-all">
                Download Group Form
              </button>
            </div>
          </aside>

        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
