
"use client";

import React, { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/firebase";
import { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn } from "@/firebase/non-blocking-login";
import { Compass, LogIn, UserPlus, Ghost } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { auth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;

    if (isRegistering) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
    // Redirect to home - in a real app you'd wait for success, 
    // but we use non-blocking pattern here.
    router.push("/");
  };

  const handleAnonymous = () => {
    if (!auth) return;
    initiateAnonymousSignIn(auth);
    router.push("/");
  };

  return (
    <main className="min-h-screen pt-20 flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center p-6 bg-secondary/20">
        <Card className="w-full max-w-md shadow-2xl border-none">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground mb-4">
              <Compass size={28} />
            </div>
            <CardTitle className="font-headline text-3xl">
              {isRegistering ? "Join the Journey" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              Connect with Rumonge Cultural Trails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold flex gap-2">
                {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isRegistering ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold flex gap-2"
                onClick={handleAnonymous}
              >
                <Ghost size={20} />
                Explore Anonymously
              </Button>
              
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-sm text-primary font-bold hover:underline"
              >
                {isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}
