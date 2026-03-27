"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth, useUser } from "@/firebase";
import { 
  signInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { Compass, LogIn, UserPlus, Ghost, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isUserLoading) {
      router.push("/profile");
    }
  }, [user, isUserLoading, router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Firebase is not yet initialized. Please refresh the page.",
      });
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        toast({ title: "Welcome!", description: "Account created successfully." });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast({ title: "Success", description: "Logged in successfully." });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = "An error occurred during authentication.";
      
      if (error.code === 'auth/operation-not-allowed') {
        message = "This sign-in method is not enabled in the Firebase Console. Go to Authentication > Sign-in method to enable it.";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered.";
      } else if (error.code === 'auth/invalid-credential') {
        message = "Invalid email or password.";
      } else if (error.code === 'auth/popup-closed-by-user') {
        message = "Sign-in popup was closed.";
      } else {
        message = error.message || message;
      }

      toast({
        variant: "destructive",
        title: "Auth Failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google error:", error);
      toast({
        variant: "destructive",
        title: "Google Auth Error",
        description: error.code === 'auth/operation-not-allowed' 
          ? "Google provider is not enabled in Firebase Console."
          : (error.message || "Failed to sign in with Google."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnonymous = async () => {
    if (!auth || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signInAnonymously(auth);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Guest Login Error",
        description: "Anonymous sign-in is not enabled in the Firebase Console.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen pt-20 flex flex-col bg-secondary/10">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-2xl border-none bg-white">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground mb-4">
              <Compass size={32} />
            </div>
            <CardTitle className="font-headline text-3xl">
              {isRegistering ? "Join the Journey" : "Welcome Back"}
            </CardTitle>
            <CardDescription>
              {isRegistering 
                ? "Create an account for Rumonge Cultural Trails." 
                : "Sign in to access your saved plans."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl h-12"
                required
                disabled={isSubmitting}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-12"
                required
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                  <div className="flex items-center gap-2">
                    {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                    {isRegistering ? "Register" : "Sign In"}
                  </div>
                )}
              </Button>
            </form>

            <div className="relative my-8 text-center">
              <span className="bg-white px-3 text-muted-foreground text-xs font-bold uppercase tracking-widest relative z-10">Or continue with</span>
              <div className="absolute top-1/2 left-0 w-full h-px bg-border" />
            </div>

            <div className="space-y-3">
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold flex gap-3"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>

              <Button 
                type="button"
                variant="ghost" 
                className="w-full h-12 rounded-xl text-muted-foreground"
                onClick={handleAnonymous}
                disabled={isSubmitting}
              >
                <Ghost size={20} className="mr-2" />
                Browse as Guest
              </Button>
              
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-sm text-primary font-bold hover:underline pt-4"
                disabled={isSubmitting}
              >
                {isRegistering ? "Already have an account? Login" : "New? Create an account"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}