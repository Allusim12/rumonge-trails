
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Map, 
  Calendar, 
  Hotel, 
  Palmtree, 
  Utensils, 
  Lightbulb,
  LayoutDashboard
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "wonderAttractions", label: "Wonders", icon: Map },
  { id: "culturalHeritages", label: "Heritage", icon: Palmtree },
  { id: "events", label: "Events", icon: Calendar },
  { id: "accommodations", label: "Stays", icon: Hotel },
  { id: "localCuisineSpots", label: "Dining", icon: Utensils },
  { id: "travelTips", label: "Tips", icon: Lightbulb },
];

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  return (
    <nav className="bg-white rounded-3xl p-4 shadow-xl space-y-2 border">
      <div className="px-4 py-2 mb-4">
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-[0.2em]">Management</span>
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
              activeTab === item.id 
                ? "bg-primary text-white shadow-md shadow-primary/20" 
                : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
