"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Compass, User, ShieldCheck, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";

const NavLinks = [
  { name: "Wonders", href: "/wonders" },
  { name: "Heritage", href: "/heritage" },
  { name: "Dining", href: "/dining" },
  { name: "Stays", href: "/stays" },
  { name: "Transport", href: "/transport" },
  { name: "Itinerary", href: "/itinerary" },
  { name: "Community", href: "/community" },
  { name: "Office", href: "/office" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const adminDocRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, "roles_admin", user.uid) : null
  , [firestore, user?.uid]);

  const { data: adminRole } = useDoc(adminDocRef);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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
          <div className="bg-primary p-2 rounded-lg text-primary-foreground group-hover:rotate-12 transition-transform">
            <Compass size={24} />
          </div>
          <span className="font-headline font-bold text-xl tracking-tight text-primary">
            Rumonge <span className={cn(scrolled ? "text-foreground" : "text-white")}>Trails</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-4">
            {NavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "font-body font-bold transition-colors text-[10px] uppercase tracking-widest",
                  scrolled ? "text-foreground/70 hover:text-primary" : "text-white/80 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3 border-l pl-6 ml-2 border-muted/30">
            {adminRole && (
              <Link
                href="/admin"
                className={cn(
                  "p-2 rounded-full transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest",
                  scrolled ? "text-primary hover:bg-primary/10" : "text-white hover:bg-white/10"
                )}
              >
                <ShieldCheck size={18} />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {user ? (
              <Link
                href="/profile"
                className="bg-primary text-primary-foreground p-2 rounded-full hover:scale-105 transition-all shadow-md"
              >
                <User size={18} />
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold text-xs hover:bg-primary/90 transition-all shadow-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={cn("md:hidden p-2", scrolled ? "text-foreground" : "text-white")}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <div
        className={cn(
          "fixed inset-0 top-[64px] bg-background z-40 md:hidden transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="font-headline text-3xl font-bold text-foreground hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          
          <div className="w-full pt-8 border-t flex flex-col gap-4 items-center">
            {adminRole && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="text-primary font-bold flex items-center gap-2 text-xl"
              >
                <ShieldCheck size={24} /> Admin Dashboard
              </Link>
            )}

            <Link
              href={user ? "/profile" : "/login"}
              onClick={() => setIsOpen(false)}
              className="w-full bg-primary text-primary-foreground text-center py-4 rounded-2xl font-bold text-xl shadow-lg"
            >
              {user ? "Go to Profile" : "Login / Join"}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
