import { useGetEvent, useRegisterForEvent, useCancelRegistration, useGetMe, getGetEventQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { useParams, Link } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, getEventCategoryColor, getStatusColor } from "@/lib/utils"
import { Calendar, MapPin, Users, Ticket, CheckCircle2, ArrowLeft, Loader2, QrCode } from "lucide-react"

export default function EventDetail() {
  const { id } = useParams()
  const eventId = Number(id)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data: user } = useGetMe()
  
  const { data: event, isLoading } = useGetEvent(eventId, {
    query: { enabled: !!eventId, queryKey: getGetEventQueryKey(eventId) }
  })
  
  const registerMut = useRegisterForEvent()
  const cancelMut = useCancelRegistration()

  const handleRegister = () => {
    if (!event) return
    registerMut.mutate({ eventId }, {
      onSuccess: () => {
        toast({ title: "Registered Successfully", description: "You are now confirmed for this event." })
        queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) })
      },
      onError: (err: any) => {
        toast({ title: "Registration failed", description: err.message || "An error occurred", variant: "destructive" })
      }
    })
  }

  const handleCancel = () => {
    if (!event) return
    cancelMut.mutate({ eventId }, {
      onSuccess: () => {
        toast({ title: "Registration Cancelled", description: "You are no longer registered." })
        queryClient.invalidateQueries({ queryKey: getGetEventQueryKey(eventId) })
      },
      onError: (err: any) => {
        toast({ title: "Failed to cancel", description: err.message, variant: "destructive" })
      }
    })
  }

  if (isLoading) {
    return <div className="p-8 space-y-6 animate-pulse">
      <div className="h-64 bg-muted rounded-2xl w-full" />
      <div className="h-10 bg-muted rounded w-1/3" />
      <div className="h-32 bg-muted rounded w-full" />
    </div>
  }
  
  if (!event) return <div>Event not found</div>

  const isUpcoming = event.status === 'upcoming'
  const isFull = event.maxSeats ? (event.remainingSeats === 0) : false
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/events" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Link>
      </div>
      
      {/* Hero Banner */}
      <div className="relative h-[30vh] md:h-[40vh] w-full rounded-3xl overflow-hidden border bg-muted shadow-md group">
        {event.bannerUrl ? (
          <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-primary to-teal-900 flex items-center justify-center">
            <Ticket className="h-24 w-24 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
           <div className="flex flex-wrap gap-2 mb-4">
             <span className={cn("px-3 py-1 rounded-md text-sm font-semibold backdrop-blur-md bg-white/20 text-white border border-white/20")}>
               {event.category}
             </span>
             <span className={cn("px-3 py-1 rounded-md text-sm font-semibold backdrop-blur-md bg-white/20 text-white border border-white/20")}>
               {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
             </span>
           </div>
           <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 text-white">
             {event.title}
           </h1>
           {event.club && (
             <div className="flex items-center gap-2 mt-4 text-white/90">
               <span>Organized by</span>
               <Link href={`/clubs/${event.club.id}`} className="font-semibold hover:underline flex items-center gap-2">
                 {event.club.logoUrl && <img src={event.club.logoUrl} className="w-6 h-6 rounded-full" alt="" />}
                 {event.club.name}
               </Link>
             </div>
           )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-card rounded-2xl p-6 md:p-8 border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">About this event</h2>
            <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
              {event.description || "No description provided."}
            </div>
            
            {event.tags && event.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
                {event.tags.map(tag => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-md border-primary/20">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{new Date(event.startDatetime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(event.startDatetime))} 
                      {" - "}
                      {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(event.endDatetime))}
                    </p>
                  </div>
                </div>
                
                {event.venue && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{event.venue.name}</p>
                      <p className="text-sm text-muted-foreground">{event.venue.building || "Campus"}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{event.registrationCount} Registered</p>
                    {event.maxSeats && (
                       <p className="text-sm text-muted-foreground">
                         {event.remainingSeats} seats remaining
                       </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t space-y-3">
                {event.isRegistered ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 p-3 rounded-lg flex items-center gap-2 font-medium justify-center border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="h-5 w-5" /> You're registered
                    </div>
                    {event.qrAttendanceEnabled && (
                      <Button variant="outline" className="w-full gap-2">
                        <QrCode className="h-4 w-4" /> View Ticket
                      </Button>
                    )}
                    {isUpcoming && (
                      <Button 
                        variant="ghost" 
                        className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleCancel}
                        disabled={cancelMut.isPending}
                      >
                        {cancelMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                        Cancel Registration
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button 
                    className="w-full h-12 text-lg" 
                    size="lg"
                    onClick={handleRegister}
                    disabled={!isUpcoming || isFull || registerMut.isPending}
                  >
                    {registerMut.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                    {!isUpcoming ? 'Registration Closed' : isFull ? 'Event Full' : 'Register Now'}
                  </Button>
                )}
                
                {event.registrationDeadline && (
                  <p className="text-center text-xs text-muted-foreground">
                    Registration closes on {new Date(event.registrationDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}
