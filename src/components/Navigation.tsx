
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Compass, User, ShieldCheck } from "lucide-react";
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
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useUser();
  const { firestore } = useFirestore();

  const adminDocRef = useMemoFirebase(() => 
    (firestore && user) ? doc(firestore, "roles_admin", user.uid) : null
  , [firestore, user?.uid]);

  const { data: adminRole } = useDoc(adminDocRef);

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
            Rumonge <span className={cn(scrolled ? "text-foreground" : "text-white")}>Trails</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden xl:flex items-center gap-6">
          {NavLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "font-body font-medium transition-colors text-[10px] uppercase tracking-widest",
                scrolled ? "text-foreground/80 hover:text-primary" : "text-white/80 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-3 border-l pl-6 ml-2 border-muted/30">
            {adminRole && (
              <Link
                href="/admin"
                className={cn(
                  "p-2 rounded-full transition-all flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest",
                  scrolled ? "text-primary hover:bg-primary/10" : "text-white hover:bg-white/10"
                )}
                title="Admin Dashboard"
              >
                <ShieldCheck size={18} />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {user ? (
              <Link
                href="/profile"
                className="bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 transition-all shadow-md"
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
          className={cn("xl:hidden p-2", scrolled ? "text-foreground" : "text-white")}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={cn(
          "fixed inset-0 top-[64px] bg-background z-40 xl:hidden transition-transform duration-300 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col items-center justify-center h-full gap-6">
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
          
          {adminRole && (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-primary font-bold flex items-center gap-2 text-xl"
            >
              <ShieldCheck size={24} /> Admin Console
            </Link>
          )}

          <Link
            href={user ? "/profile" : "/login"}
            onClick={() => setIsOpen(false)}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-lg shadow-lg"
          >
            {user ? "View Profile" : "Login"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
