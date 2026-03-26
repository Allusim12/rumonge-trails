
"use client";

import React, { useState } from "react";
import { generateItinerary, type GenerateItineraryOutput } from "@/ai/flows/generate-itinerary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Loader2, Calendar, Map, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ItineraryPlanner() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateItineraryOutput | null>(null);
  const [formData, setFormData] = useState({
    interests: "",
    days: 3,
    pace: "moderate" as "relaxed" | "moderate" | "fast"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await generateItinerary({
        interests: formData.interests || "nature, culture",
        lengthOfStayDays: formData.days,
        preferredPace: formData.pace
      });
      setResult(data);
    } catch (error) {
      console.error("Failed to generate itinerary", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="itinerary" className="py-24 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 mb-4">Powered by AI</Badge>
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-4">
            Personalized <span className="text-primary italic">Plan Just For You</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tell us what you love, and our AI guide will craft the perfect Rumonge experience 
            tailored to your interests and pace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Card className="shadow-xl border-none">
              <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                  <Sparkles className="text-primary" />
                  Your Preferences
                </CardTitle>
                <CardDescription>Customize your trip details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests (e.g. Beaches, Hiking, Food)</Label>
                    <Input
                      id="interests"
                      placeholder="What are you looking for?"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="days">Length of Stay</Label>
                      <Select 
                        value={formData.days.toString()} 
                        onValueChange={(val) => setFormData({ ...formData, days: parseInt(val) })}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Days" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 7].map(d => (
                            <SelectItem key={d} value={d.toString()}>{d} {d === 1 ? 'Day' : 'Days'}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pace">Preferred Pace</Label>
                      <Select 
                        value={formData.pace} 
                        onValueChange={(val: any) => setFormData({ ...formData, pace: val })}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Pace" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="relaxed">Relaxed</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="fast">Fast</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl text-lg font-bold" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Designing Itinerary...
                      </>
                    ) : (
                      "Generate My Trip"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-8">
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-8 duration-700">
                <Card className="border-none shadow-xl bg-white overflow-hidden">
                  <div className="bg-primary p-6 text-primary-foreground">
                    <h3 className="font-headline text-3xl font-bold mb-2">Rumonge Adventure Awaits</h3>
                    <p className="opacity-90 leading-relaxed font-body italic text-lg">{result.summary}</p>
                  </div>
                  <CardContent className="p-8">
                    <div className="space-y-10">
                      {result.itinerary.map((day, idx) => (
                        <div key={idx} className="relative pl-10 border-l-2 border-primary/20 last:border-0 pb-2">
                          <div className="absolute -left-3 top-0 bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white shadow-md">
                            {day.day}
                          </div>
                          <div className="mb-4 flex items-center gap-2">
                            <Calendar size={18} className="text-primary" />
                            <h4 className="font-headline text-2xl font-bold">Day {day.day}</h4>
                          </div>
                          <div className="grid gap-4">
                            {day.activities.map((activity, aIdx) => (
                              <div key={aIdx} className="flex gap-3 items-start bg-secondary/20 p-4 rounded-xl hover:bg-secondary/40 transition-colors">
                                <CheckCircle2 size={18} className="text-accent mt-1 shrink-0" />
                                <p className="font-body text-foreground leading-relaxed">{activity}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-12 flex justify-center gap-4">
                      <Button variant="outline" className="rounded-xl">Download PDF</Button>
                      <Button className="rounded-xl">Save to Favorites</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-primary/20 rounded-3xl flex flex-col items-center justify-center text-center p-12 bg-white/50">
                <div className="bg-primary/5 p-6 rounded-full mb-6">
                  <Map className="text-primary/40 h-16 w-16" />
                </div>
                <h3 className="font-headline text-2xl font-bold text-foreground/50 mb-2">Your Adventure Starts Here</h3>
                <p className="text-muted-foreground max-w-sm">Fill out the form to generate a custom itinerary powered by local insights.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </span>
  );
}
