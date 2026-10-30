import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid campus or personal email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const { user, login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  useEffect(() => {
    if (user) {
      const redirectParam = new URLSearchParams(window.location.search).get("redirect");
      setLocation(redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard");
    }
  }, [user, setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setIsSubmitting(true);
      await login({
        email: values.email.trim(),
        password: values.password,
      });
      toast({
        title: "Welcome back!",
        description: "Authenticated successfully to Campus 360.",
      });
      const redirectParam = new URLSearchParams(window.location.search).get("redirect");
      setLocation(redirectParam && redirectParam.startsWith("/") ? redirectParam : "/dashboard");
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err?.message || "Invalid credentials. Please verify your email and password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FDFDFC] text-foreground">
      {/* Left Column - Editorial Institutional Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#1C1917] text-[#F5F5F4] p-12 flex-col justify-between border-r border-[#292524] relative overflow-hidden">
        {/* Subtle geometric grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#44403C_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img
                src="/logo.png"
                alt="Campus 360"
                className="h-10 w-10 object-contain rounded-lg bg-white/5 p-1 border border-white/10 group-hover:border-primary/50 transition-colors"
              />
              <div>
                <span className="font-black text-lg tracking-tight block">Campus 360</span>
                <span className="text-[10px] text-[#A8A29E] font-medium tracking-wide uppercase">
                  NKOCET Institutional Portal
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#D6D3D1]">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Role-Governed Smart Campus</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#FAFAF9] leading-tight">
            Connecting every corner of our collegiate community.
          </h2>

          <p className="text-sm text-[#A8A29E] leading-relaxed">
            One authoritative platform for campus events, club activities, verified attendance credentials, and departmental announcements.
          </p>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#78716C]">
            <span>N. K. Orchid College of Engineering & Tech</span>
            <span>Est. 2008</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[#78716C] flex items-center justify-between">
          <span>© {new Date().getFullYear()} Campus 360</span>
          <div className="flex gap-4">
            <button
              onClick={() => setLegalModal("terms")}
              className="hover:text-[#D6D3D1] transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setLegalModal("privacy")}
              className="hover:text-[#D6D3D1] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
          <div className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-primary hover:underline">
              Create account
            </Link>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Sign in to your account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Enter your registered college or personal credentials to access your dashboard.
            </p>
          </div>

          {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("confirmed") === "true" && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in-50 duration-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Email successfully confirmed! Your Campus 360 account is activated. Please sign in below.</span>
            </div>
          )}

          {typeof window !== "undefined" && new URLSearchParams(window.location.search).get("reset") === "true" && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in-50 duration-300">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Password successfully updated! Please sign in with your new password below.</span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-foreground">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter your email"
                          className="pl-9 h-10 text-xs bg-white border-border/80 focus:border-primary shadow-2xs font-medium"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-bold text-foreground">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-primary hover:underline transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 h-10 text-xs bg-white border-border/80 focus:border-primary shadow-2xs font-medium"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-10 text-xs font-bold shadow-sm cursor-pointer mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying Credentials...
                  </>
                ) : (
                  "Sign In to Campus 360"
                )}
              </Button>
            </form>
          </Form>

          <div className="p-3.5 rounded-xl bg-muted/40 border text-[11px] text-muted-foreground leading-relaxed space-y-1">
            <span className="font-bold text-foreground block">Campus Access Note:</span>
            Faculty and Club Coordinators are elevated by System Administrators upon departmental verification. All new signups begin with verified student access.
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-4 lg:hidden">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setLegalModal("terms")}
              className="hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModal("privacy")}
              className="hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Dialogs */}
      <Dialog open={legalModal !== null} onOpenChange={() => setLegalModal(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {legalModal === "terms" ? "Terms of Service" : "Privacy Policy"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Last updated: August 2026 • Campus 360 NKOCET
            </DialogDescription>
          </DialogHeader>

          {legalModal === "terms" ? (
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed py-2">
              <p>
                <strong>1. Acceptance of Terms:</strong> By logging into and using Campus 360, students, faculty, and administrative coordinators agree to abide by NKOCET institution policies and ethical computing conduct.
              </p>
              <p>
                <strong>2. Verified Identity:</strong> All accounts represent real members of the college community. Impersonation of students, faculty advisors, or club coordinators is strictly prohibited and subject to institutional review.
              </p>
              <p>
                <strong>3. Event Registrations & Certificates:</strong> Event registrations generate verifiable QR attendance passes. Certificates issued through Campus 360 are cryptographically signed and auditable.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed py-2">
              <p>
                <strong>1. Information Collection:</strong> Campus 360 stores user profile attributes (name, email, department, PRN number, study year) to administer campus activities and verify event attendance.
              </p>
              <p>
                <strong>2. Data Usage:</strong> Academic and extracurricular records are used exclusively for campus services, student leader nominations, and certificate verification.
              </p>
              <p>
                <strong>3. Security:</strong> All authentication tokens and database transactions are protected with Row Level Security (RLS) policies.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
