"use client";

import React, { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth, useUser, errorEmitter } from "@/firebase";
import { initiateEmailSignIn, initiateEmailSignUp, initiateAnonymousSignIn, initiateGoogleSignIn } from "@/firebase/non-blocking-login";
import { Compass, LogIn, UserPlus, Ghost, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { auth } = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleAuthError = (error: Error) => {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message || "Something went wrong. Please try again.",
      });
    };

    errorEmitter.on('auth-error', handleAuthError);
    return () => errorEmitter.off('auth-error', handleAuthError);
  }, [toast]);

  useEffect(() => {
    if (user && !isUserLoading) {
      toast({
        title: "Welcome!",
        description: isRegistering ? "Account created successfully." : "Signed in successfully.",
      });
      router.push("/profile");
    }
  }, [user, isUserLoading, router, isRegistering, toast]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || isSubmitting) return;

    setIsSubmitting(true);
    if (isRegistering) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
  };

  const handleGoogleSignIn = () => {
    if (!auth || isSubmitting) return;
    setIsSubmitting(true);
    initiateGoogleSignIn(auth);
  };

  const handleAnonymous = () => {
    if (!auth || isSubmitting) return;
    setIsSubmitting(true);
    initiateAnonymousSignIn(auth);
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl font-bold flex gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                    {isRegistering ? "Create Account" : "Sign In"}
                  </>
                )}
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

            <div className="space-y-3">
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 rounded-xl font-bold flex gap-2 border-primary/20 hover:bg-primary/5"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <Button 
                type="button"
                variant="ghost" 
                className="w-full h-12 rounded-xl font-bold flex gap-2 text-muted-foreground hover:text-primary"
                onClick={handleAnonymous}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Ghost size={20} />
                    Try as Guest
                  </>
                )}
              </Button>
              
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full text-sm text-primary font-bold hover:underline pt-2"
                disabled={isSubmitting}
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
