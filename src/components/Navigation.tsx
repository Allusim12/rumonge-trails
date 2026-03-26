
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, MapPin, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

const NavLinks = [
  { name: "Wonders", href: "#wonders" },
  { name: "Heritage", href: "#heritage" },
  { name: "Itinerary", href: "#itinerary" },
  { name: "Events", href: "#events" },
  { name: "Guide", href: "#guide" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-background/95 backdrop-blur-md shadow-md py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg text-primary-foreground group-hover:scale-110 transition-transform">
            <Compass size={24} />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">
            Rumonge <span className="text-foreground">Trails</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-body font-medium text-foreground/80 hover:text-primary transition-colors text-sm uppercase tracking-wider"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#itinerary"
            className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold text-sm hover:bg-primary/90 transition-all"
          >
            Plan Trip
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "fixed inset-0 top-[64px] bg-background z-40 md:hidden transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-headline text-3xl font-bold text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="#itinerary"
            onClick={() => setIsOpen(false)}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-lg"
          >
            Plan Your Journey
          </Link>
        </div>
      </div>
    </nav>
  );
}
