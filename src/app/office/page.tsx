
"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatGuide } from "@/components/ChatGuide";
import { Building2, Landmark, ShieldCheck, MapPin, Mail, Phone, Info, Loader2, FileText, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, serverTimestamp } from "firebase/firestore";
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useToast } from "@/hooks/use-toast";

export default function OfficePage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", subject: "", message: "" });

  const officeDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, "site_content", "office") : null
  , [firestore]);

  const { data: officeData, isLoading } = useDoc(officeDocRef);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    setIsSubmitting(true);
    try {
      await addDocumentNonBlocking(collection(firestore, "site_inquiries"), {
        ...inquiryForm,
        sentAt: serverTimestamp(),
        status: "New"
      });
      setInquiryForm({ name: "", email: "", subject: "", message: "" });
      toast({
        title: "Message Sent",
        description: "The Commune Office has received your inquiry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fallback defaults
  const content = {
    name: officeData?.name || "Augustin MINANI",
    title: officeData?.title || "Commune Rumonge Office",
    role: officeData?.subtitle || "Administrator of Rumonge Commune",
    quote: officeData?.description || "\"Our mission is to foster a Rumonge that thrives through its traditions while embracing modern opportunities for all our citizens and visitors.\"",
    imageUrl: officeData?.imageUrl || "https://picsum.photos/seed/admin/400/400"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

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
            {content.title}
          </h1>
          <p className="text-xl opacity-90 leading-relaxed max-w-2xl font-body">
            Dedicated to the service of the people, the preservation of our cultural heritage, 
            and the sustainable development of Rumonge Commune.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Administrator Spotlight & Inquiry */}
          <div className="lg:col-span-7 space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-white p-8 rounded-[2.5rem] shadow-xl border border-primary/10">
              <div className="relative w-48 h-48 rounded-3xl overflow-hidden shrink-0 shadow-lg border-4 border-white">
                <Image
                  src={content.imageUrl}
                  alt={content.name}
                  fill
                  className="object-cover"
                  data-ai-hint="portrait professional man"
                />
              </div>
              <div className="text-center md:text-left">
                <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-2 block">{content.role}</span>
                <h2 className="font-headline text-4xl font-bold mb-4 text-foreground">{content.name}</h2>
                <p className="text-muted-foreground leading-relaxed italic mb-6">
                  {content.quote}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                   <div className="bg-primary/5 px-4 py-2 rounded-xl text-xs font-bold text-primary border border-primary/10 flex items-center gap-2">
                    <ShieldCheck size={14} /> Executive Leadership
                  </div>
                </div>
              </div>
            </div>

            {/* Official Inquiry Form */}
            <Card className="border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
              <div className="h-2 bg-primary" />
              <CardHeader className="p-10">
                <CardTitle className="font-headline text-3xl">Direct <span className="text-primary italic">Inquiry</span></CardTitle>
                <CardDescription>Send an official message to the Office of the Administrator.</CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0">
                <form onSubmit={handleSubmitInquiry} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Your Name</label>
                      <Input 
                        required
                        placeholder="John Doe"
                        className="rounded-2xl h-12 bg-secondary/20 border-none"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({...inquiryForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                      <Input 
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="rounded-2xl h-12 bg-secondary/20 border-none"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({...inquiryForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Subject</label>
                    <Input 
                      required
                      placeholder="e.g. Group Visit Notification"
                      className="rounded-2xl h-12 bg-secondary/20 border-none"
                      value={inquiryForm.subject}
                      onChange={(e) => setInquiryForm({...inquiryForm, subject: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                    <Textarea 
                      required
                      placeholder="How can we assist you?"
                      className="rounded-2xl min-h-[150px] bg-secondary/20 border-none"
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] transition-transform"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2" size={20} />}
                    Submit Official Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact & Registration Sidebar */}
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

            {/* Visitor Registration Section */}
            <Card className="border-none shadow-xl bg-accent/5 overflow-hidden rounded-[2rem] border-accent/10">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                  <FileText className="text-accent" />
                  Visitor <span className="text-accent italic">Registration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  International groups and organizations are encouraged to notify the office of their visit to ensure a safe and supportive experience.
                </p>
                <div className="p-6 bg-white rounded-2xl border border-accent/20 shadow-sm">
                  <h4 className="font-bold mb-2 text-foreground">Registration Info</h4>
                  <p className="text-sm text-muted-foreground mb-6">Use the Inquiry form to notify us of your planned group arrival. Include dates and size.</p>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-accent text-accent hover:bg-accent/10">
                    Read Travel Protocols
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>

        </div>
      </section>

      <ChatGuide />
      <Footer />
    </main>
  );
}
