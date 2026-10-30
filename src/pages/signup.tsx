import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, Loader2, Mail, ShieldCheck, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const signupSchema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().min(1, "Please select your department"),
  year: z.string().min(1, "Please select your year of study"),
  prn: z.string().min(4, "Please enter your PRN or Roll Number"),
  division: z.string().optional(),
  phone: z.string().optional(),
});

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

const YEARS = ["FE (First Year)", "SE (Second Year)", "TE (Third Year)", "BE (Final Year)"];

export default function Signup() {
  const { user, signup } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [legalModal, setLegalModal] = useState<"terms" | "privacy" | null>(null);

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      department: "Computer Science & Engineering",
      year: "SE (Second Year)",
      prn: "",
      division: "A",
      phone: "",
    },
  });

  const [createdEmail, setCreatedEmail] = useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      setIsSubmitting(true);
      const res = await signup({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
        role: "student", // All new signups begin as students; elevated by admin
        department: values.department,
        year: values.year,
        prn: values.prn.trim(),
        division: values.division?.trim(),
        phone: values.phone?.trim(),
      });
      if (res?.emailConfirmationRequired) {
        setCreatedEmail(values.email.trim().toLowerCase());
      } else {
        setLocation("/dashboard");
      }
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err?.message || "Could not complete account creation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FDFDFC] text-foreground">
      {/* Left Column - Clean Academic Sidebar */}
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

        <div className="relative z-10 space-y-6 my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#D6D3D1]">
            <UserCheck className="h-3.5 w-3.5 text-primary" />
            <span>Academic Identity & Extracurricular Hub</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-[#FAFAF9] leading-tight">
            Create your unified student profile.
          </h2>

          <p className="text-sm text-[#A8A29E] leading-relaxed">
            Register once to join campus societies, register for workshops, manage event tickets, and earn verified participation credentials.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs text-[#D6D3D1]">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" /> Role Governance Note
            </div>
            <p className="text-[#A8A29E] leading-relaxed">
              Every student account starts with standard campus privileges. If you are a Club Coordinator or Faculty Advisor, you can submit an elevation request to administrators from your dashboard.
            </p>
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
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-16 overflow-y-auto">
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
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>

        <div className="max-w-xl w-full mx-auto my-6 space-y-6">
          {createdEmail ? (
            <div className="space-y-6 animate-in fade-in-50 duration-300">
              <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 shadow-2xs">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Verification email sent!
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Your student account has been registered for <strong className="text-foreground">{createdEmail}</strong>. A verification link has been sent to your inbox.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border text-xs text-muted-foreground space-y-2 shadow-2xs">
                <p className="font-semibold text-foreground">What to do next:</p>
                <ol className="list-decimal list-inside space-y-1.5 pl-1">
                  <li>Open the verification email sent from Campus 360 / Supabase Auth.</li>
                  <li>Click <span className="font-semibold text-foreground">"Confirm email address"</span> to activate your account.</li>
                  <li>Once activated, sign in below to access your student dashboard and campus clubs.</li>
                </ol>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link href="/login" className="w-full">
                  <Button className="w-full text-xs font-bold h-10 cursor-pointer">
                    Proceed to Sign In
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full text-xs font-semibold h-10 cursor-pointer"
                  onClick={() => setCreatedEmail(null)}
                >
                  Create Another Account
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                  Create student account
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enter your academic and personal details to register with Campus 360.
                </p>
              </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Sufiyan Shaikh"
                          className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Password (min 6 characters) *</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="prn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">PRN / Roll Number *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 2024BCSE042"
                          className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Department *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DEPARTMENTS.map((dept) => (
                            <SelectItem key={dept} value={dept} className="text-xs">
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Year of Study *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium">
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {YEARS.map((y) => (
                            <SelectItem key={y} value={y} className="text-xs">
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Division (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Div A / Batch 2"
                          className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-foreground">Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. +91 9876543210"
                          className="h-9 text-xs bg-white border-border/80 shadow-2xs font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="text-[11px] text-muted-foreground pt-1 leading-relaxed">
                By registering, you acknowledge that your account will be created under the student role, governed by our{" "}
                <button
                  type="button"
                  onClick={() => setLegalModal("terms")}
                  className="text-primary hover:underline font-semibold"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => setLegalModal("privacy")}
                  className="text-primary hover:underline font-semibold"
                >
                  Privacy Policy
                </button>
                .
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-xs font-bold shadow-sm cursor-pointer mt-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering Profile...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}
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
              Campus 360 NKOCET Institutional Guidelines
            </DialogDescription>
          </DialogHeader>

          {legalModal === "terms" ? (
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed py-2">
              <p>
                <strong>1. Acceptance of Terms:</strong> By registering with Campus 360, students agree to adhere to NKOCET collegiate policies and codes of academic integrity.
              </p>
              <p>
                <strong>2. Identity Verification:</strong> Accounts must be created with authentic name, PRN, and department information.
              </p>
              <p>
                <strong>3. Coordinator Elevation:</strong> Students who become club leads or faculty advisors receive elevated administrative privileges upon admin verification.
              </p>
            </div>
          ) : (
            <div className="space-y-3 text-xs text-muted-foreground leading-relaxed py-2">
              <p>
                <strong>1. Information Collection:</strong> We collect your academic details to personalize event access, club recruitment, and digital credentialing.
              </p>
              <p>
                <strong>2. Privacy Safeguards:</strong> Personal phone numbers and student identifiers are protected and only accessible to relevant departmental administrators.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
