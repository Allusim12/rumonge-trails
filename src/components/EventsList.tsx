"use client";

import React, { useState, useEffect } from "react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EventsList() {
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const eventsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "events"), orderBy("startDate", "asc"), limit(10));
  }, [firestore]);

  const { data: events, isLoading } = useCollection(eventsQuery);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-primary flex gap-6 items-center">
          <div className="text-center min-w-[80px]">
            <span className="block text-4xl font-headline font-bold text-primary">15</span>
            <span className="block text-sm uppercase font-bold text-muted-foreground">July</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Tanganyika Harvest Festival</h3>
            <p className="text-muted-foreground text-sm">Traditional boat races and communal feasts celebrating the lake's bounty.</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-accent flex gap-6 items-center">
          <div className="text-center min-w-[80px]">
            <span className="block text-4xl font-headline font-bold text-accent">22</span>
            <span className="block text-sm uppercase font-bold text-muted-foreground">Aug</span>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Rumonge Drums Ensemble</h3>
            <p className="text-muted-foreground text-sm">A night of rhythmic mastery featuring top drummers from the southern region.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {events.map((event) => {
        const startDate = event.startDate?.seconds 
          ? new Date(event.startDate.seconds * 1000) 
          : new Date(event.startDate);
        
        return (
          <Card key={event.id} className="border-none shadow-lg overflow-hidden group hover:-translate-y-1 transition-all">
            <CardContent className="p-0 flex flex-col sm:flex-row">
              <div className="bg-primary text-white p-6 sm:w-32 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-headline font-bold">
                  {mounted ? format(startDate, "dd") : "--"}
                </span>
                <span className="text-xs uppercase font-bold tracking-widest opacity-80">
                  {mounted ? format(startDate, "MMM") : "..."}
                </span>
              </div>
              <div className="p-6 flex-1 bg-white">
                <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-2">
                  <CalendarIcon size={12} />
                  {event.eventType || "Festival"}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {event.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                  <MapPin size={10} className="text-accent" />
                  {event.locationName}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
