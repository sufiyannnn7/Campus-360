import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useLocation } from "wouter"
import { useSignup, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react"
import { useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "faculty", "coordinator"]),
  department: z.string().optional(),
})

export default function Signup() {
  const { data: user } = useGetMe()
  const [_, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const signupMut = useSignup()

  useEffect(() => {
    if (user) {
      setLocation("/dashboard")
    }
  }, [user, setLocation])

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
      department: "Computer Science",
    },
  })

  function onSubmit(values: z.infer<typeof signupSchema>) {
    signupMut.mutate({ data: values as any }, {
      onSuccess: (res: any) => {
        if (res?.accessToken) {
          localStorage.setItem("token", res.accessToken)
        }
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        toast({ title: "Account created!", description: "Welcome to CampusHub." })
        setLocation("/dashboard")
      },
      onError: (err: any) => {
        toast({ 
          title: "Signup failed", 
          description: err?.message || "There was a problem creating your account.", 
          variant: "destructive" 
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex animate-in fade-in-50 duration-200">
      {/* Left side - Information Banner */}
      <div className="hidden lg:flex flex-1 relative bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-indigo-900 to-teal-800 opacity-95" />
        <div className="relative z-10 p-16 flex flex-col justify-between text-white h-full max-w-lg">
          <div>
            <Link href="/">
              <div className="flex items-center gap-3 mb-6 cursor-pointer">
                <img src="/logo.png" alt="Campus 360 Logo" className="h-12 w-12 object-contain bg-white/10 p-1 rounded-xl shrink-0" />
                <div>
                  <h1 className="text-xl font-black tracking-tight text-white">Campus 360</h1>
                  <p className="text-[10px] text-teal-200 font-semibold uppercase tracking-wider">Connecting Every Corner</p>
                </div>
              </div>
            </Link>
            <h1 className="text-3xl font-extrabold max-w-md leading-tight">
              Join the unified smart campus network.
            </h1>
          </div>
           
          <div className="space-y-5 my-8">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Instant Event Registrations</h4>
                <p className="text-xs text-white/80 leading-relaxed">Register for hackathons, cultural nights & sports meets with instant QR pass generation.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Student Club Recruitment</h4>
                <p className="text-xs text-white/80 leading-relaxed">Join active technical societies, submit role applications & track interview status.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-300 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">QR Verifiable Credentials</h4>
                <p className="text-xs text-white/80 leading-relaxed">Earn cryptographically signed digital certificates for all your extracurricular milestones.</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/70">
            © {new Date().getFullYear()} Campus 360 — Connecting Every Corner of Campus.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 bg-background relative z-10 py-12 overflow-y-auto">
        <div className="absolute top-6 left-6 sm:left-12">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 pt-8">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-3">
              <img src="/logo.png" alt="Campus 360 Logo" className="h-9 w-9 object-contain" />
              <span className="font-extrabold text-lg">Campus 360</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your details to get started with Campus 360.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" className="h-10 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">University Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email address" className="h-10 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" className="h-10 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 text-sm">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="coordinator">Club Lead</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-semibold">Department</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your department" className="h-10 text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full h-11 font-semibold text-sm shadow-md mt-2" disabled={signupMut.isPending}>
                {signupMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Get Started / Create Account
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Log in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
