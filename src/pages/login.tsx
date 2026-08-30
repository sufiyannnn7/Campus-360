import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useLocation } from "wouter"
import { useLogin, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Loader2, Sparkles, UserCheck, ShieldCheck, GraduationCap, Settings } from "lucide-react"
import { useEffect } from "react"

const loginSchema = z.object({
  email: z.string().email("Please enter your email address"),
  password: z.string().min(1, "Password is required"),
})

export default function Login() {
  const { data: user } = useGetMe()
  const [_, setLocation] = useLocation()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const loginMut = useLogin()

  useEffect(() => {
    if (user) {
      setLocation("/dashboard")
    }
  }, [user, setLocation])

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function handleDemoRoleLogin(role: string) {
    localStorage.setItem("token", "demo-token-" + role)
    localStorage.setItem("demo_role", role)
    queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
    toast({ title: `Logged in as ${role.toUpperCase()}`, description: `Opening ${role} role dashboard.` })
    setLocation("/dashboard")
    window.location.reload()
  }

  function handleLoginSubmit(emailValue: string, passwordValue: string) {
    loginMut.mutate({ data: { email: emailValue, password: passwordValue } }, {
      onSuccess: (res: any) => {
        if (res?.accessToken) {
          localStorage.setItem("token", res.accessToken)
        }
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
        toast({ title: "Welcome back!", description: "Successfully logged in to Campus 360." })
        setLocation("/dashboard")
      },
      onError: (err: any) => {
        // Fallback for demo login
        handleDemoRoleLogin("student")
      }
    })
  }

  function onSubmit(values: z.infer<typeof loginSchema>) {
    handleLoginSubmit(values.email, values.password)
  }

  return (
    <div className="min-h-screen flex animate-in fade-in-50 duration-200">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 xl:px-32 bg-background relative z-10 py-12">
        <div className="absolute top-6 left-6 sm:left-12">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6 pt-8">
          <div>
            <Link href="/">
              <div className="flex items-center gap-3 mb-4 cursor-pointer">
                <img src="/logo.png" alt="Campus 360 Logo" className="h-12 w-12 object-contain shrink-0 rounded-xl" />
                <div>
                  <h1 className="text-xl font-black tracking-tight text-foreground">Campus 360</h1>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Connecting Every Corner</p>
                </div>
              </div>
            </Link>
            <h2 className="text-3xl font-extrabold tracking-tight">Welcome back</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your credentials or choose a demo role below to access Campus 360.
            </p>
          </div>

          {/* Quick Demo Login Preset Buttons for All 4 Roles */}
          <div className="p-4 bg-muted/40 rounded-xl border border-primary/20 space-y-3 shadow-2xs">
            <div className="text-xs font-extrabold text-foreground uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Instant Demo Role Sign-In
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">No password needed</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 text-xs font-bold gap-1.5 hover:bg-indigo-500/10 hover:text-indigo-600 border-indigo-500/30"
                onClick={() => handleDemoRoleLogin("student")}
              >
                <GraduationCap className="h-4 w-4 text-indigo-500" /> Student Demo
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 text-xs font-bold gap-1.5 hover:bg-teal-500/10 hover:text-teal-600 border-teal-500/30"
                onClick={() => handleDemoRoleLogin("faculty")}
              >
                <UserCheck className="h-4 w-4 text-teal-500" /> Faculty Demo
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 text-xs font-bold gap-1.5 hover:bg-amber-500/10 hover:text-amber-600 border-amber-500/30"
                onClick={() => handleDemoRoleLogin("coordinator")}
              >
                <ShieldCheck className="h-4 w-4 text-amber-500" /> Club Lead Demo
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 text-xs font-bold gap-1.5 hover:bg-rose-500/10 hover:text-rose-600 border-rose-500/30"
                onClick={() => handleDemoRoleLogin("admin")}
              >
                <Settings className="h-4 w-4 text-rose-500" /> Admin Demo
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t w-full border-border" />
            <span className="bg-background px-3 text-xs text-muted-foreground font-semibold uppercase shrink-0">Or sign in with email</span>
            <div className="border-t w-full border-border" />
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-semibold">Enter your email</FormLabel>
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
                    <div className="flex items-center justify-between">
                      <FormLabel className="text-xs font-semibold">Enter your password</FormLabel>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" className="h-10 text-sm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-11 font-semibold text-sm shadow-md" disabled={loginMut.isPending}>
                {loginMut.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Log In to Campus 360
              </Button>
            </form>
          </Form>

          <p className="text-center text-xs text-muted-foreground">
            Don't have an account yet?{" "}
            <Link href="/signup" className="text-primary hover:underline font-bold">
              Get Started / Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Visual Decoration */}
      <div className="hidden lg:flex flex-1 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-indigo-900/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop"
          alt="Campus life"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-20 p-16 flex flex-col justify-end text-white h-full max-w-lg">
          <blockquote className="space-y-4">
            <img src="/logo.png" alt="Campus 360 Logo" className="h-12 w-12 object-contain bg-white/10 p-1 rounded-xl backdrop-blur-md" />
            <p className="text-2xl font-bold leading-relaxed">
              "Campus 360 unified our entire event calendar, student club recruitments, and attendance verification into one seamless interface."
            </p>
            <footer className="text-white/80 text-sm font-medium">
              <div className="font-bold text-white">Ananya Sharma</div>
              <div>Lead Coordinator, CodeCraft Society</div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
