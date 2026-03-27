
"use client";

import React, { useState, useEffect } from "react";
import { Search, MapPin, Palmtree, Utensils, ArrowRight, Loader2, X, Newspaper, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export function GlobalSearch() {
  const [queryText, setQueryText] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    const searchAll = async () => {
      if (!queryText.trim() || queryText.length < 2 || !firestore) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const lowerQuery = queryText.toLowerCase();
      
      try {
        const collections = [
          { id: "wonderAttractions", type: "Wonder", path: "/wonders/", icon: <MapPin size={14} /> },
          { id: "culturalHeritages", type: "Heritage", path: "/heritage", icon: <Palmtree size={14} /> },
          { id: "localCuisineSpots", type: "Dining", path: "/dining", icon: <Utensils size={14} /> },
          { id: "trendingUpdates", type: "News", path: "/news", icon: <Newspaper size={14} /> },
          { id: "events", type: "Event", path: "/events", icon: <Calendar size={14} /> }
        ];

        const allHits: any[] = [];

        for (const colInfo of collections) {
          const snap = await getDocs(collection(firestore, colInfo.id));
          snap.forEach(doc => {
            const data = doc.data();
            const text = (data.name || data.title || "").toLowerCase();
            const desc = (data.description || data.content || "").toLowerCase();
            
            if (text.includes(lowerQuery) || desc.includes(lowerQuery)) {
              allHits.push({
                id: doc.id,
                name: data.name || data.title,
                type: colInfo.type,
                path: colInfo.id === "wonderAttractions" ? `${colInfo.path}${doc.id}` : colInfo.path,
                icon: colInfo.icon
              });
            }
          });
        }
        setResults(allHits.slice(0, 5));
      } catch (e) {
        console.error("Search error", e);
      } finally {
        setIsSearching(false);
      }
    };

    const timeout = setTimeout(searchAll, 300);
    return () => clearTimeout(timeout);
  }, [queryText, firestore]);

  return (
    <div className="relative w-full max-w-2xl mx-auto z-40">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform group-focus-within:scale-110" size={20} />
        <Input
          placeholder="Search wonders, news, heritage, or events..."
          className="h-14 pl-12 pr-12 rounded-2xl border-none shadow-2xl text-lg focus-visible:ring-primary bg-white/90 backdrop-blur-md"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
        />
        {queryText && (
          <button 
            onClick={() => setQueryText("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {(results.length > 0 || isSearching) && queryText.length >= 2 && (
        <Card className="absolute top-full mt-4 left-0 right-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-white/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <CardContent className="p-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground italic">
                <Loader2 className="animate-spin text-primary" size={20} />
                Scanning Rumonge...
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((res) => (
                  <Link 
                    key={res.id} 
                    href={res.path}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-primary/5 group transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        {res.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{res.name}</h4>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">{res.type}</p>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
