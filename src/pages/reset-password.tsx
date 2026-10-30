import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Lock, ShieldAlert } from "lucide-react";
import { authService } from "@/api/services/auth.service";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let isMounted = true;

    async function checkRecoveryState() {
      if (!isSupabaseConfigured()) {
        // Mock / development mode
        if (isMounted) {
          setIsValidSession(true);
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        // Check if there is an active session (Supabase automatically exchanges hash/code on load)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (isMounted) {
            setIsValidSession(true);
            setIsCheckingSession(false);
          }
          return;
        }

        // Listen for PASSWORD_RECOVERY event if token exchange is still resolving
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "PASSWORD_RECOVERY" || session) {
            if (isMounted) {
              setIsValidSession(true);
              setIsCheckingSession(false);
            }
          }
        });

        // Timeout fallback if no recovery session could be established
        setTimeout(() => {
          if (isMounted) {
            setIsCheckingSession((prev) => {
              if (prev) {
                // If still checking after 2.5s, check session one final time
                supabase.auth.getSession().then(({ data }) => {
                  setIsValidSession(Boolean(data.session));
                  setIsCheckingSession(false);
                });
              }
              return false;
            });
          }
        }, 2500);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        if (isMounted) {
          setIsValidSession(false);
          setIsCheckingSession(false);
        }
      }
    }

    checkRecoveryState();

    return () => {
      isMounted = false;
    };
  }, []);

  async function onSubmit(values: ResetPasswordValues) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await authService.resetPassword(values.password);
      setIsSuccess(true);
      setTimeout(() => {
        setLocation("/login?reset=true");
      }, 2500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to update password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FDFDFC] text-foreground">
      {/* Left Column - Branding Sidebar */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#1C1917] text-[#F5F5F4] p-12 flex-col justify-between border-r border-[#292524] relative overflow-hidden">
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
                  NKOCET Student Network
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#D6D3D1]">
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            <span>Secure Password Reset</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#FAFAF9] leading-tight">
            Set your new credentials.
          </h2>

          <p className="text-sm text-[#A8A29E] leading-relaxed">
            Choose a strong password to protect your academic records, society roles, and digital certificates on Campus 360.
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#292524] text-xs text-[#A8A29E]">
          <span>© 2026 Campus 360 • NKOCET Solapur • Team NEXUS</span>
        </div>
      </div>

      {/* Right Column - Reset Password Form */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="flex items-center justify-between">
          <Link href="/login">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Sign In
            </Button>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          {isCheckingSession ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
              <p className="text-xs text-muted-foreground font-medium">
                Verifying password recovery session...
              </p>
            </div>
          ) : isSuccess ? (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-2xs">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Password updated!
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your Campus 360 password has been successfully updated. Redirecting to sign in...
                </p>
              </div>

              <Link href="/login?reset=true">
                <Button className="w-full text-xs font-bold h-10 cursor-pointer">
                  Proceed to Sign In Now
                </Button>
              </Link>
            </div>
          ) : !isValidSession ? (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="h-14 w-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 shadow-2xs">
                <ShieldAlert className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Invalid or expired link
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  This password recovery link has either expired, has already been used, or was opened in an incompatible browser session.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                <Link href="/forgot-password">
                  <Button className="w-full text-xs font-bold h-10 cursor-pointer">
                    Request a New Password Reset Link
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full text-xs font-semibold h-10 cursor-pointer">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Create new password
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Please enter a new password below with at least 6 characters.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 font-medium animate-in fade-in-50">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Update Failed</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-9 pr-9 h-10 text-xs bg-white border-border/80 focus:border-primary shadow-2xs font-medium"
                              disabled={isSubmitting}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                              tabIndex={-1}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-9 pr-9 h-10 text-xs bg-white border-border/80 focus:border-primary shadow-2xs font-medium"
                              disabled={isSubmitting}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword((prev) => !prev)}
                              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                              tabIndex={-1}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating Password...
                      </>
                    ) : (
                      "Save New Password"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-muted-foreground pt-6">
          © 2026 Campus 360 • NKOCET Solapur • Team NEXUS
        </div>
      </div>
    </div>
  );
}
