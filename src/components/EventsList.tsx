
"use client";

import React from "react";

export function EventsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-primary flex gap-6 items-center">
        <div className="text-center min-w-[80px]">
          <span className="block text-4xl font-headline font-bold text-primary">15</span>
          <span className="block text-sm uppercase font-bold text-muted-foreground">July</span>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">Lake Tanganyika Harvest Festival</h3>
          <p className="text-muted-foreground text-sm">Celebrating the annual bounty with traditional boat races and communal feasts.</p>
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
