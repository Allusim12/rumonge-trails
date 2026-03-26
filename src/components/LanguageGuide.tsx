
"use client";

import React, { useState } from "react";
import { speakKirundi } from "@/ai/flows/kirundi-tts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Volume2, Loader2, Languages } from "lucide-react";

const phrases = [
  { kirundi: "Amahoro", english: "Hello / Peace", category: "Greetings" },
  { kirundi: "Amakuru?", english: "How are you?", category: "Greetings" },
  { kirundi: "Ni meza", english: "I am fine", category: "Greetings" },
  { kirundi: "Urakoze", english: "Thank you", category: "Politeness" },
  { kirundi: "Sagasaga", english: "Welcome (specifically in Rumonge)", category: "Greetings" },
  { kirundi: "Abe", english: "Yes", category: "Basics" },
  { kirundi: "Oya", english: "No", category: "Basics" },
  { kirundi: "Uripfuza iki?", english: "What would you like?", category: "Food" },
  { kirundi: "Mvuye Saga Beach", english: "I'm coming from Saga Beach", category: "Directions" },
];

export function LanguageGuide() {
  const [playing, setPlaying] = useState<string | null>(null);

  const handlePlay = async (phrase: string) => {
    setPlaying(phrase);
    try {
      const { audioDataUri } = await speakKirundi(phrase);
      const audio = new Audio(audioDataUri);
      audio.play();
      audio.onended = () => setPlaying(null);
    } catch (error) {
      console.error("Failed to play audio", error);
      setPlaying(null);
    }
  };

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full font-bold text-sm mb-4">
            <Languages size={18} />
            Language Hub
          </div>
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">
            Speak Like a <span className="text-primary italic">Local</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn essential Kirundi phrases to connect with the warm people of Rumonge. 
            Click the speaker to hear authentic pronunciations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {phrases.map((p, idx) => (
            <Card key={idx} className="border-none shadow-md hover:shadow-lg transition-all group overflow-hidden bg-background">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-accent tracking-widest mb-1 block">
                    {p.category}
                  </span>
                  <h3 className="font-headline text-xl font-bold mb-1">{p.kirundi}</h3>
                  <p className="text-muted-foreground text-sm italic">{p.english}</p>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className={`rounded-full h-12 w-12 transition-all ${
                    playing === p.kirundi ? "bg-primary text-white border-primary" : "group-hover:bg-primary/10"
                  }`}
                  onClick={() => handlePlay(p.kirundi)}
                  disabled={playing !== null}
                >
                  {playing === p.kirundi ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Volume2 size={20} />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
