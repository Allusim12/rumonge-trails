
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
  Bus,
  Image as ImageIcon,
  Mail,
  MessageSquare,
  Home,
  Landmark,
  Newspaper,
  ClipboardList,
  LayoutDashboard,
  ChevronRight,
  BarChart3,
  Wand2
} from "lucide-react";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

const groups = [
  {
    label: "Intelligence",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "ai-studio", label: "AI Marketing Studio", icon: Wand2 },
    ]
  },
  {
    label: "Site Presence",
    items: [
      { id: "site_content", label: "Homepage Hero", icon: Home },
      { id: "site_content_office", label: "Commune Office", icon: Landmark },
      { id: "mediaAssets", label: "Media Gallery", icon: ImageIcon },
    ]
  },
  {
    label: "Engagement",
    items: [
      { id: "trendingUpdates", label: "Trending News", icon: Newspaper },
      { id: "bookingRequests", label: "Booking Requests", icon: ClipboardList },
      { id: "reviews", label: "Traveler Reviews", icon: MessageSquare },
      { id: "newsletter_subscriptions", label: "Subscribers", icon: Mail },
    ]
  },
  {
    label: "The Local Guide",
    items: [
      { id: "wonderAttractions", label: "Natural Wonders", icon: Map },
      { id: "culturalHeritages", label: "Cultural Heritage", icon: Palmtree },
      { id: "events", label: "Upcoming Events", icon: Calendar },
      { id: "accommodations", label: "Stays & Hotels", icon: Hotel },
      { id: "localCuisineSpots", label: "Dining Spots", icon: Utensils },
      { id: "transportationOptions", label: "Transport Info", icon: Bus },
      { id: "travelTips", label: "Pro Travel Tips", icon: Lightbulb },
    ]
  }
];

export function AdminSidebar({ activeTab, onTabChange, onClose }: AdminSidebarProps) {
  const handleTabClick = (id: string) => {
    onTabChange(id);
    if (onClose) onClose();
  };

  return (
    <nav className="flex flex-col h-full bg-white md:bg-transparent">
      <div className="flex items-center gap-3 px-4 py-6 border-b border-secondary/50 md:border-none">
        <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
          <LayoutDashboard size={20} />
        </div>
        <div>
          <h2 className="font-headline font-bold text-xl leading-none">Management</h2>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-1">Control Panel</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-8 px-2 md:px-0">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <h3 className="px-4 text-[10px] uppercase font-bold text-primary/60 tracking-[0.2em]">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all group",
                      isActive 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-white md:hover:bg-secondary/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={cn(
                        "transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-primary/70"
                      )} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight size={14} className="animate-in slide-in-from-left-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
