import { useState } from "react"
import { useGetEvent, useGetMe } from "@workspace/api-client-react"
import { UPCOMING_EVENTS_DATA } from "@/data/landing-data"
import { useParams, Link } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { formatDateTime, getEventCategoryColor } from "@/lib/utils"
import { Calendar, MapPin, Users, Ticket, CheckCircle2, ArrowLeft, Loader2, QrCode, Download, Share2, Sparkles, Building2 } from "lucide-react"

export default function EventDetail() {
  const { id } = useParams()
  const eventId = Number(id) || 1
  const { toast } = useToast()
  const { data: user } = useGetMe()
  
  const { data: apiEvent, isLoading } = useGetEvent(eventId as any)
  
  // Fallback to rich local data if API returns null
  const defaultEvent = UPCOMING_EVENTS_DATA.find((e) => e.id === eventId) || UPCOMING_EVENTS_DATA[0]
  const activeEvent = apiEvent || defaultEvent

  const [isRegistered, setIsRegistered] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)

  const handleRegister = () => {
    setIsRegistered(true)
    setShowPassModal(true)
    toast({
      title: "🎉 Registration Confirmed!",
      description: `You have successfully registered for ${activeEvent.title}. Your QR pass has been generated.`
    })
  }

  const handleCancel = () => {
    setIsRegistered(false)
    toast({
      title: "Registration Cancelled",
      description: `You have cancelled your registration for ${activeEvent.title}.`
    })
  }

  if (isLoading && !activeEvent) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="h-64 bg-muted rounded-3xl w-full" />
        <div className="h-10 bg-muted rounded w-1/3" />
        <div className="h-32 bg-muted rounded w-full" />
      </div>
    )
  }

  const rawDate = activeEvent.startDatetime || activeEvent.date || new Date().toISOString()
  const eventDateObj = new Date(rawDate)
  const formattedDateStr = isNaN(eventDateObj.getTime())
    ? (activeEvent.date || "August 22, 2026")
    : eventDateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })

  const venueName = typeof activeEvent.venue === "string" ? activeEvent.venue : (activeEvent.venue?.name || "College Seminar Hall (Main Building)")

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in-50 duration-300">
      
      {/* Back to Events Button */}
      <div className="flex items-center justify-between">
        <Link href="/events">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Events
          </Button>
        </Link>
        <Badge variant="secondary" className="px-3 py-1 font-bold text-xs bg-emerald-500/10 text-emerald-600 border border-emerald-200">
          🟢 Official NKOCET Event
        </Badge>
      </div>
      
      {/* Hero Banner Header */}
      <div className="relative h-[32vh] md:h-[42vh] w-full rounded-3xl overflow-hidden border bg-muted shadow-lg group">
        {activeEvent.bannerUrl ? (
          <img src={activeEvent.bannerUrl} alt={activeEvent.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-primary to-teal-900 flex items-center justify-center">
            <Ticket className="h-24 w-24 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge className={cn("text-xs font-black shadow-md", getEventCategoryColor(activeEvent.category))}>
              {activeEvent.category}
            </Badge>
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 text-xs font-extrabold backdrop-blur">
              {activeEvent.status || "Open for Students"}
            </Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight text-white max-w-4xl">
            {activeEvent.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90 font-medium pt-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-400" /> {formattedDateStr}
            </span>
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-amber-400" /> Organized by <strong>{activeEvent.organizer || "E-Cell NKOCET"}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Left Column: Description & Details */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-card rounded-2xl p-6 md:p-8 border shadow-xs space-y-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> About this Event
            </h2>
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {activeEvent.description || "The Eureka Pitching Competition (Internal Round) and E-Cell NKOCET launch will feature 22 innovative student startup teams presenting before an esteemed jury panel of industry entrepreneurs at the College Seminar Hall."}
            </div>

            <div className="pt-4 border-t grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                <span className="text-muted-foreground uppercase font-extrabold text-[10px]">Target Audience</span>
                <p className="font-bold text-foreground">NKOCET Engineering Students & Faculty</p>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl space-y-1">
                <span className="text-muted-foreground uppercase font-extrabold text-[10px]">Certificate Type</span>
                <p className="font-bold text-emerald-600 dark:text-emerald-400">Verified QR Digital Badge</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Ticket Registration Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-md border-primary/30">
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground">{formattedDateStr}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{activeEvent.time || "10:00 AM - 04:00 PM"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 text-teal-600 mt-0.5">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground">{venueName}</p>
                    <p className="text-xs text-muted-foreground font-semibold">NKOCET Main Campus</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 text-amber-600 mt-0.5">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground">Seats Remaining</p>
                    <p className="text-xs text-emerald-600 font-bold">{activeEvent.seatsLeft || 12} seats available</p>
                  </div>
                </div>
              </div>

              {/* Registration Action */}
              <div className="pt-4 border-t space-y-3">
                {isRegistered ? (
                  <div className="space-y-3">
                    <div className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 p-3.5 rounded-xl flex items-center gap-2 font-bold justify-center border border-emerald-500/30 text-xs">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Confirmed Registration
                    </div>
                    <Button onClick={() => setShowPassModal(true)} variant="outline" className="w-full font-bold gap-2 text-xs h-10 border-primary/40 text-primary">
                      <QrCode className="h-4 w-4" /> View QR Event Ticket
                    </Button>
                    <Button onClick={handleCancel} variant="ghost" className="w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold h-8">
                      Cancel Registration
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleRegister}
                    className="w-full h-12 text-base font-black bg-gradient-to-r from-primary to-teal-600 hover:scale-105 transition-all text-white shadow-md gap-2 cursor-pointer"
                  >
                    <Ticket className="h-5 w-5" /> Register Now (Free Pass)
                  </Button>
                )}
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

      {/* QR Ticket Pass Modal */}
      <Dialog open={showPassModal} onOpenChange={setShowPassModal}>
        <DialogContent className="sm:max-w-md p-6 text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center justify-center gap-2">
              <Ticket className="h-6 w-6 text-primary" /> Verified NKOCET Event Pass
            </DialogTitle>
            <DialogDescription className="text-xs">
              Present this QR code at the Seminar Hall entry gate for attendance check-in.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-white dark:bg-zinc-900 border-2 border-dashed border-primary/40 rounded-2xl space-y-3 inline-block mx-auto shadow-inner">
            <div className="text-left space-y-1">
              <h4 className="font-extrabold text-sm text-foreground">{activeEvent.title}</h4>
              <p className="text-xs text-muted-foreground">Attendee: <strong>{user?.name || "Sufiyan Shaikh"}</strong></p>
            </div>

            <div className="h-44 w-44 mx-auto bg-primary/5 rounded-xl border flex flex-col items-center justify-center p-2">
              <QrCode className="h-32 w-32 text-primary" />
              <span className="text-[10px] font-mono font-bold text-muted-foreground">NKOCET-2026-PASS-E1</span>
            </div>
          </div>

          <Button className="w-full font-bold text-xs" onClick={() => setShowPassModal(false)}>
            Close Ticket
          </Button>
        </DialogContent>
      </Dialog>

    </div>
  )
}
