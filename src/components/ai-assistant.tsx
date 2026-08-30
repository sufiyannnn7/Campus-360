import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Sparkles, MessageSquare, X, Send, Bot, User, ChevronRight, Ticket, Calendar, ShieldCheck, MapPin, Trophy } from "lucide-react"
import { Link } from "wouter"
import { cn } from "@/lib/utils"
import { UPCOMING_EVENTS_DATA, FEATURED_CLUBS_DATA, LATEST_NEWS_DATA } from "@/data/landing-data"

interface ChatMessage {
  id: string
  sender: "user" | "bot"
  text: string
  suggestedEvents?: any[]
  actionLink?: { label: string; href: string }
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "👋 Hi! I'm CampusBot, your NKOCET AI Assistant. Ask me anything about upcoming events, pitch competitions, student clubs, hackathons, or verified certificates!"
    }
  ])

  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // Smart Client-Side Knowledge Base NLP Engine
  const generateSmartReply = (query: string): { reply: string; suggestedEvents?: any[]; actionLink?: { label: string; href: string } } => {
    const q = query.toLowerCase().trim()

    // 1. Eureka Pitching & E-Cell Questions
    if (q.includes("eureka") || q.includes("pitch") || q.includes("e-cell") || q.includes("ecell") || q.includes("entrepreneur")) {
      return {
        reply: "🚀 **Eureka Pitching Competition (Internal Round)** and the **E-Cell NKOCET Grand Inauguration** were held on **August 22, 2026** at the College Seminar Hall (Main Building, Ground Floor)! 22 student startup teams presented innovative ideas before an expert jury of entrepreneurs.",
        suggestedEvents: UPCOMING_EVENTS_DATA.filter(e => (e.organizer || "").includes("E-Cell") || (e.title || "").includes("Eureka")),
        actionLink: { label: "View E-Cell Club Profile →", href: "/clubs/1" }
      }
    }

    // 2. Events & Calendar Questions
    if (q.includes("event") || q.includes("calendar") || q.includes("schedule") || q.includes("agenda") || q.includes("upcoming")) {
      const topEvents = UPCOMING_EVENTS_DATA.slice(0, 4)
      return {
        reply: `📅 Here are key upcoming events at NKOCET:\n\n• **Aug 22**: Eureka Pitching Competition & E-Cell Launch\n• **Aug 22**: Future Tech Club AI Expo & English Club Debate\n• **Aug 28**: Rotaract Youth Orientation\n• **Oct 24**: CSESA National Code-A-Thon 2026\n\nYou can explore all 54+ scheduled events on the interactive calendar!`,
        suggestedEvents: topEvents,
        actionLink: { label: "Open Interactive Calendar →", href: "/calendar" }
      }
    }

    // 3. Clubs & Associations
    if (q.includes("club") || q.includes("csesa") || q.includes("gdg") || q.includes("future tech") || q.includes("rotaract") || q.includes("english") || q.includes("avengineers") || q.includes("pushpak") || q.includes("ashwamedh")) {
      return {
        reply: "🏛️ NKOCET features 9+ active student clubs across departments:\n\n1. **E-Cell NKOCET**: Entrepreneurship & Startup Mentorship\n2. **CSESA**: Computer Science Student Association (Hackathons)\n3. **GDG NKOCET**: Google Developer Group (Web3/AI)\n4. **Future Tech Club**: Generative AI & Robotics\n5. **ENGLISH CLUB**: Literary & Debates\n6. **Rotaract Club**: Youth Leadership & Community Service\n7. **Team Avengineers**: SAE Baja All-Terrain Vehicles\n8. **Team Pushpak**: Aeromodelling & UAV Drones\n9. **Team Ashwamedh**: Supermileage EV Car Design",
        actionLink: { label: "Explore All Campus Clubs →", href: "/clubs" }
      }
    }

    // 4. Certificates & QR Verification
    if (q.includes("cert") || q.includes("badge") || q.includes("verify") || q.includes("qr")) {
      return {
        reply: "🎓 All event participation and achievement certificates on Campus 360 are cryptographically signed and 100% QR-verifiable! Students can view and download PDFs from their profile, while employers can verify codes instantly at `/certificates/verify/NKOCET-2026-X`.",
        actionLink: { label: "View My Certificates →", href: "/certificates" }
      }
    }

    // 5. Recruitments & Joining Clubs
    if (q.includes("join") || q.includes("recruit") || q.includes("apply") || q.includes("member")) {
      return {
        reply: "✨ E-Cell, CSESA, GDG, Future Tech, and SAE teams are actively recruiting new members! You can browse open core roles (Technical, Design, Management) and apply directly from the Recruitments portal.",
        actionLink: { label: "Browse Open Recruitments →", href: "/recruitments" }
      }
    }

    // 6. Login & Role Access
    if (q.includes("login") || q.includes("role") || q.includes("faculty") || q.includes("admin") || q.includes("coordinator") || q.includes("student")) {
      return {
        reply: "🔐 Campus 360 supports 4 specialized role interfaces:\n\n• **Student**: Event passes, certificates & iCal calendar\n• **Faculty**: Event approvals & attendance rosters\n• **Club Lead**: Manage club info, recruitments & events\n• **Admin**: System-wide platform KPIs & user management\n\nTry instant demo sign-ins on the Login page!",
        actionLink: { label: "Go to Login Page →", href: "/login" }
      }
    }

    // 7. Venue / Map Questions
    if (q.includes("where") || q.includes("location") || q.includes("venue") || q.includes("map") || q.includes("seminar hall")) {
      return {
        reply: "📍 **Key Campus Venues**:\n\n• **College Seminar Hall**: Main Academic Building, Ground Floor (Eureka Pitching & Inaugurations)\n• **Central Computer Center**: CSE Block, 2nd Floor (CSESA Hackathons)\n• **SAE Workshop & Lawn**: Mechanical Block Quadrangle (Team Avengineers & Ashwamedh)\n• **Main Auditorium**: Central Admin Block, 1st Floor (Rotaract & Cultural Nights)",
        actionLink: { label: "View Campus Map →", href: "/map" }
      }
    }

    // 8. General Intelligent Fallback Response
    return {
      reply: `💡 I'm here to assist with everything NKOCET! You can ask me about:\n\n• **Events**: "What's happening on Aug 22?" or "Show hackathons"\n• **Clubs**: "How to join CSESA?" or "Tell me about E-Cell"\n• **Certificates**: "How to download QR certificates"\n• **Venues**: "Where is the Seminar Hall?"`,
      suggestedEvents: UPCOMING_EVENTS_DATA.slice(0, 2),
      actionLink: { label: "Explore Events Schedule →", href: "/events" }
    }
  }

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput("")
    setLoading(true)

    try {
      setTimeout(() => {
        try {
          const smartResult = generateSmartReply(query)
          
          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: smartResult.reply,
            suggestedEvents: smartResult.suggestedEvents || [],
            actionLink: smartResult.actionLink
          }

          setMessages((prev) => [...prev, botMsg])
        } catch (innerErr) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              sender: "bot",
              text: "I'm here to help! You can browse upcoming events, clubs, or campus schedules using the navigation bar above."
            }
          ])
        } finally {
          setLoading(false)
        }
      }, 300)
    } catch (err) {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 px-5 rounded-full shadow-2xl bg-gradient-to-r from-primary via-indigo-600 to-teal-500 hover:scale-105 text-white font-bold flex items-center gap-2.5 transition-all border-2 border-white/20 cursor-pointer"
        >
          <Sparkles className="h-5 w-5 animate-pulse text-amber-300" />
          <span className="text-sm font-extrabold tracking-wide">Ask CampusBot</span>
        </Button>
      )}

      {/* Floating Smart AI Chat Box */}
      {isOpen && (
        <Card className="w-[360px] sm:w-[420px] h-[540px] shadow-2xl flex flex-col border-primary/30 bg-background/98 backdrop-blur-xl rounded-3xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header Bar */}
          <CardHeader className="bg-gradient-to-r from-primary via-indigo-600 to-teal-600 text-white p-4 flex flex-row items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 shadow-inner">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-base font-black leading-tight flex items-center gap-1.5">
                  CampusBot AI <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </CardTitle>
                <p className="text-[11px] text-white/80 font-medium">Smart Campus Assistant • NKOCET</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          {/* Messages Feed */}
          <CardContent ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3.5 text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex gap-2.5 max-w-[90%]", msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto")}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs font-bold",
                    msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted border text-foreground"
                  )}
                >
                  {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                </div>

                <div className="space-y-2 flex-1">
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl leading-relaxed text-xs sm:text-sm shadow-2xs whitespace-pre-wrap",
                      msg.sender === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                        : "bg-card text-foreground rounded-tl-none border shadow-xs"
                    )}
                  >
                    {msg.text}
                  </div>

                  {/* Action Link Button */}
                  {msg.actionLink && msg.actionLink.href && (
                    <div className="pt-1">
                      <Link href={msg.actionLink.href} onClick={() => setIsOpen(false)}>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold gap-1.5 w-full justify-between bg-primary/5 hover:bg-primary hover:text-primary-foreground border-primary/30 transition-all">
                          <span>{msg.actionLink.label}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  )}

                  {/* Suggested Event Cards */}
                  {msg.suggestedEvents && msg.suggestedEvents.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-extrabold uppercase text-muted-foreground tracking-wider">Related Events:</p>
                      {msg.suggestedEvents.map((evt) => {
                        const venueText = typeof evt?.venue === "string" ? evt.venue : (evt?.venue?.name || "Seminar Hall")
                        return (
                          <Link
                            key={evt.id}
                            href={`/events/${evt.id}`}
                            onClick={() => setIsOpen(false)}
                            className="block p-2 rounded-xl border bg-muted/40 hover:border-primary/60 transition-all group shadow-2xs"
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="truncate group-hover:text-primary transition-colors">{evt.title}</span>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                            </div>
                            <div className="text-[10px] text-muted-foreground flex items-center justify-between mt-1">
                              <span>📍 {venueText}</span>
                              <Badge variant="secondary" className="text-[9px] font-bold">{evt.category}</Badge>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 font-semibold">
                <Bot className="h-4 w-4 animate-bounce text-primary" /> CampusBot is analyzing NKOCET database...
              </div>
            )}
          </CardContent>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 border-t bg-muted/30 flex gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
            <button
              onClick={() => handleSend("Tell me about Eureka Pitching competition")}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-primary/10 hover:text-primary text-muted-foreground font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              🚀 Eureka Pitching
            </button>
            <button
              onClick={() => handleSend("What events are happening on Aug 22?")}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-primary/10 hover:text-primary text-muted-foreground font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              📅 Aug 22 Events
            </button>
            <button
              onClick={() => handleSend("List all NKOCET student clubs")}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-primary/10 hover:text-primary text-muted-foreground font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              🏛️ All Student Clubs
            </button>
            <button
              onClick={() => handleSend("How do verified QR certificates work?")}
              className="px-2.5 py-1 rounded-full border bg-background hover:bg-primary/10 hover:text-primary text-muted-foreground font-semibold whitespace-nowrap transition-colors cursor-pointer"
            >
              🎓 QR Certificates
            </button>
          </div>

          {/* Input Footer */}
          <CardFooter className="p-3 border-t bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex w-full items-center gap-2"
            >
              <Input
                placeholder="Ask CampusBot anything about NKOCET..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-10 text-xs sm:text-sm rounded-full bg-muted/40 focus-visible:ring-primary font-medium"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || loading} className="h-10 w-10 rounded-full shrink-0 font-bold bg-primary hover:bg-primary/90 text-white shadow-md">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>

        </Card>
      )}
    </div>
  )
}
