import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, CheckCircle2, KeyRound, Loader2, Mail, ShieldAlert } from "lucide-react";
import { authService } from "@/api/services/auth.service";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid campus or personal email address"),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await authService.requestPasswordReset(values.email);
      setSubmittedEmail(values.email.trim().toLowerCase());
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to send password recovery email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FDFDFC] text-foreground">
      {/* Left Column - Academic Branding Sidebar */}
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
            <span>Account Security & Recovery</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#FAFAF9] leading-tight">
            Recover access to your campus account.
          </h2>

          <p className="text-sm text-[#A8A29E] leading-relaxed">
            Enter your registered email address and we will send you an authorized password reset link to securely restore your credentials.
          </p>
        </div>

        <div className="relative z-10 pt-6 border-t border-[#292524] text-xs text-[#A8A29E]">
          <span>© 2026 Campus 360 • NKOCET Solapur • Team NEXUS</span>
        </div>
      </div>

      {/* Right Column - Recovery Form / Success View */}
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
          <div className="text-xs text-muted-foreground">
            Remembered password?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          {submittedEmail ? (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-2xs">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Check your inbox
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We have sent a secure password recovery link to{" "}
                  <strong className="text-foreground">{submittedEmail}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border text-xs text-muted-foreground space-y-2 shadow-2xs">
                <p className="font-semibold text-foreground">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Click the link in the recovery email to open the password reset page.</li>
                  <li>Set a new password with at least 6 characters.</li>
                  <li>Check your spam/junk folder if the email does not arrive within 2 minutes.</li>
                </ol>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link href="/login" className="w-full">
                  <Button className="w-full text-xs font-bold h-10 cursor-pointer">
                    Return to Sign In
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold h-10 cursor-pointer"
                  onClick={() => {
                    setSubmittedEmail(null);
                    form.reset();
                  }}
                >
                  Resend or Try Another Email
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Forgot your password?
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  No worries. Enter your registered email address below and we'll send you a password reset link.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 font-medium animate-in fade-in-50">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block">Password Recovery Notice</span>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold text-foreground">Registered Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="e.g. yourname@gmail.com"
                              className="pl-9 h-10 text-xs bg-white border-border/80 focus:border-primary shadow-2xs font-medium"
                              disabled={isSubmitting}
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
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Recovery Email...
                      </>
                    ) : (
                      "Send Password Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>

        <div className="text-center text-[11px] text-muted-foreground pt-6">
          Need additional assistance? Contact Campus 360 Admin at{" "}
          <span className="font-semibold text-foreground">admin@nkocet.ac.in</span>
        </div>
      </div>
    </div>
  );
}
