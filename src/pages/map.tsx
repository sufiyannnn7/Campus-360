import { useState, useEffect, useMemo } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Navigation, Users, Tv, Mic, Wind, Info, Calendar, ArrowLeft, ArrowRight, Building2, CheckCircle2, Clock, ExternalLink, Compass, Layers, Utensils, Trophy } from "lucide-react"
import { UPCOMING_EVENTS_DATA, UpcomingEventItem } from "@/data/landing-data"
import { eventsService } from "@/api/services/events.service"
import { EventItem } from "@/types/events"
import { Link } from "wouter"
import { cn } from "@/lib/utils"

interface CampusVenue {
  id: number
  name: string
  code: string
  address: string
  building: string
  floor: string
  capacity: number
  category: "Academic" | "Sports" | "Canteen" | "Hostel" | "Workshop"
  facilities: string[]
  coordinates: { x: number; y: number }
  description: string
  upcomingEventTitle: string
  upcomingEventDate: string
  organizer: string
}

const NKOCET_CAMPUS_LOCATIONS: CampusVenue[] = [
  {
    id: 1,
    name: "CSE Building",
    code: "CSE",
    address: "Top Academic Block (North Wing), NKOCET Campus",
    building: "Computer Science & Engineering Building",
    floor: "Ground, 1st & 2nd Floors",
    capacity: 600,
    category: "Academic",
    facilities: ["Central Computer Center", "High-Speed Fiber Net", "AI Labs", "Smart Classrooms", "AC"],
    coordinates: { x: 28, y: 14 },
    description: "Home of Computer Science & Engineering department, CSESA hackathon centers, and GDG NKOCET developer labs.",
    upcomingEventTitle: "CSESA National Code-A-Thon & Hackathon 2026",
    upcomingEventDate: "Oct 24, 2026 • 09:00 AM - 06:00 PM",
    organizer: "CSESA"
  },
  {
    id: 2,
    name: "AIDS / ENTC Building",
    code: "AIDS/ENTC",
    address: "Top Academic Block (North East Wing), NKOCET Campus",
    building: "AI & Data Science / ENTC Building",
    floor: "Ground, 1st & 2nd Floors",
    capacity: 550,
    category: "Academic",
    facilities: ["AI & Machine Learning Lab", "ENTC Research Center", "Embedded Systems Lab", "AC"],
    coordinates: { x: 68, y: 14 },
    description: "Houses Artificial Intelligence, Data Science & Electronics Engineering labs and the Future Tech AI Expo.",
    upcomingEventTitle: "Future Tech Club Inauguration & AI Tech Expo",
    upcomingEventDate: "Aug 22, 2026 • 11:30 AM - 01:30 PM",
    organizer: "Future Tech Club"
  },
  {
    id: 3,
    name: "Civil Building & Seminar Hall",
    code: "Civil",
    address: "Middle Academic Block (West Wing), NKOCET Campus",
    building: "Civil Engineering Block",
    floor: "Ground & 1st Floor (College Seminar Hall)",
    capacity: 400,
    category: "Academic",
    facilities: ["College Seminar Hall (350 Seats)", "Surveying Lab", "CAD Center", "Auditorium Sound"],
    coordinates: { x: 22, y: 38 },
    description: "Main Civil block hosting the flagship College Seminar Hall, Eureka Pitching Competition, and E-Cell launch.",
    upcomingEventTitle: "Eureka Pitching Competition (Internal Round) & E-Cell Launch",
    upcomingEventDate: "Aug 22, 2026 • 09:30 AM - 04:00 PM",
    organizer: "E-Cell NKOCET"
  },
  {
    id: 4,
    name: "Mechanical Building & SAE Workshop",
    code: "Mech",
    address: "Middle Academic Block (East Wing), NKOCET Campus",
    building: "Mechanical Engineering Building",
    floor: "Ground Floor & SAE Workshop Quadrangle",
    capacity: 450,
    category: "Workshop",
    facilities: ["SAE Baja Fabrication Workshop", "Hydraulic Testing Rig", "EV Charging Station", "CNC Center"],
    coordinates: { x: 74, y: 38 },
    description: "Mechanical engineering complex where Team Avengineers and Team Ashwamedh build race vehicles.",
    upcomingEventTitle: "Team Avengineers SAE All-Terrain Vehicle Showcase",
    upcomingEventDate: "Aug 12, 2026 • 10:00 AM - 04:00 PM",
    organizer: "Team Avengineers"
  },
  {
    id: 5,
    name: "Big Canteen",
    code: "Big Canteen",
    address: "Central Campus West, Next to Civil Block, NKOCET",
    building: "Main Dining & Food Court Complex",
    floor: "Ground Floor Food Court",
    capacity: 350,
    category: "Canteen",
    facilities: ["Multi-Cuisine Dining", "Fresh Juice Bar", "Indoor Seating", "Pure Drinking Water"],
    coordinates: { x: 20, y: 62 },
    description: "Main student food court and dining plaza serving fresh meals, snacks, and beverages for campus events.",
    upcomingEventTitle: "Student Refreshment & Networking Zone",
    upcomingEventDate: "Daily • 08:00 AM - 08:00 PM",
    organizer: "NKOCET Hospitality"
  },
  {
    id: 6,
    name: "Playground (PG)",
    code: "PG",
    address: "Central Campus Sports Grounds, NKOCET",
    building: "Main Athletic Stadium & Field",
    floor: "Outdoor Athletics Ground",
    capacity: 1500,
    category: "Sports",
    facilities: ["Cricket Pitch", "Football Field", "400m Running Track", "Drone Flying Grid", "Floodlights"],
    coordinates: { x: 45, y: 62 },
    description: "Central sports stadium for athletic meets, Team Pushpak UAV drone flying expos, and outdoor gatherings.",
    upcomingEventTitle: "Team Pushpak UAV Drone Flying Expo & Aero Workshop",
    upcomingEventDate: "Aug 18, 2026 • 11:00 AM - 03:00 PM",
    organizer: "Team Pushpak"
  },
  {
    id: 7,
    name: "Volleyball & Basketball Courts",
    code: "Volley / Basket",
    address: "Central Campus East, Next to PG Grounds, NKOCET",
    building: "Outdoor Courts Complex",
    floor: "Outdoor Sports Courts",
    capacity: 400,
    category: "Sports",
    facilities: ["Synthetic Basketball Court", "Volleyball Net Court", "Spectator Seating", "Night Lighting"],
    coordinates: { x: 65, y: 62 },
    description: "Dedicated courts for volleyball, basketball championships, and inter-departmental sports finals.",
    upcomingEventTitle: "Inter-Departmental Sports & Basketball Tournament Finals",
    upcomingEventDate: "Aug 10, 2026 • 09:00 AM - 04:00 PM",
    organizer: "Sports Council"
  },
  {
    id: 8,
    name: "Small Canteen",
    code: "Small Canteen",
    address: "East Campus Plaza, Next to Sports Courts, NKOCET",
    building: "Express Refreshment Kiosk",
    floor: "Ground Floor Kiosk",
    capacity: 100,
    category: "Canteen",
    facilities: ["Tea & Coffee Bar", "Quick Snacks", "Shaded Seating"],
    coordinates: { x: 82, y: 58 },
    description: "Quick snack kiosk and coffee lounge located adjacent to the sports courts.",
    upcomingEventTitle: "Sports Break & Beverage Kiosk",
    upcomingEventDate: "Daily • 08:30 AM - 07:00 PM",
    organizer: "NKOCET Hospitality"
  },
  {
    id: 9,
    name: "Girls Hostel (GH)",
    code: "GH",
    address: "South-West Campus Residential Zone, NKOCET",
    building: "Girls Hostel Residence Block",
    floor: "4-Story Hostel Wing",
    capacity: 350,
    category: "Hostel",
    facilities: ["24x7 Security Guard", "Biometric Entry", "Wi-Fi Study Room", "Solar Water Heaters"],
    coordinates: { x: 28, y: 86 },
    description: "On-campus residential hostel complex for women engineering students with 24x7 security.",
    upcomingEventTitle: "Hostel Cultural Evening & Resident Gathering",
    upcomingEventDate: "Monthly Event",
    organizer: "GH Council"
  },
  {
    id: 10,
    name: "Boys Hostel (BH)",
    code: "BH",
    address: "South-East Campus Residential Zone, NKOCET",
    building: "Boys Hostel Residence Block",
    floor: "4-Story Hostel Wing",
    capacity: 500,
    category: "Hostel",
    facilities: ["In-House Gymnasium", "Recreation Room", "High-Speed Wi-Fi", "Mess Dining"],
    coordinates: { x: 68, y: 86 },
    description: "On-campus residential hostel complex for male engineering students with gym and indoor games.",
    upcomingEventTitle: "Hostel Sports League & Gym Fitness Competition",
    upcomingEventDate: "Monthly Event",
    organizer: "BH Council"
  }
]

export default function CampusMapPage() {
  const [search, setSearch] = useState("")
  const [selectedVenue, setSelectedVenue] = useState<CampusVenue>(NKOCET_CAMPUS_LOCATIONS[2])
  const [originVenue, setOriginVenue] = useState<string>("College Main Gate")
  const [liveEvents, setLiveEvents] = useState<EventItem[]>([])

  useEffect(() => {
    eventsService.listEvents().then(setLiveEvents).catch(() => setLiveEvents([]))

    const params = new URLSearchParams(window.location.search)
    const venueParam = params.get("venue")
    if (venueParam) {
      const vLower = venueParam.toLowerCase()
      const matched = NKOCET_CAMPUS_LOCATIONS.find(
        (loc) =>
          loc.name.toLowerCase().includes(vLower) ||
          loc.building.toLowerCase().includes(vLower) ||
          loc.code.toLowerCase().includes(vLower) ||
          vLower.includes(loc.name.toLowerCase()) ||
          vLower.includes(loc.code.toLowerCase())
      )
      if (matched) setSelectedVenue(matched)
    }
  }, [])

  const filteredLocations = NKOCET_CAMPUS_LOCATIONS.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.building.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase()) ||
      v.upcomingEventTitle.toLowerCase().includes(search.toLowerCase())
  )

  const allAvailableEvents = useMemo(() => {
    let deletedSet = new Set<string>()
    try {
      const raw = JSON.parse(localStorage.getItem("campus360_deleted_events") || "[]")
      deletedSet = new Set((raw || []).map(String))
    } catch {}

    const source = liveEvents.length > 0 ? liveEvents : (UPCOMING_EVENTS_DATA as any)
    return source.filter((e: any) => !deletedSet.has(String(e.id)))
  }, [liveEvents])

  const getEventsForVenue = (location: CampusVenue) => {
    return allAvailableEvents.filter((e: any) => {
      const ev = (typeof e.venue === "string" ? e.venue : e.venue?.name || "").toLowerCase().trim()
      const locName = location.name.toLowerCase()
      const locCode = location.code.toLowerCase()
      const locBldg = location.building.toLowerCase()

      if (ev.includes(locName) || locName.includes(ev)) return true
      if (ev.includes(locCode) || locCode.includes(ev)) return true
      if (ev.includes(locBldg) || locBldg.includes(ev)) return true

      // Semantic venue aliases
      if ((ev.includes("seminar hall") || ev.includes("auditorium")) && (location.id === 3 || location.name.includes("Civil"))) return true
      if ((ev.includes("cse") || ev.includes("computer center") || ev.includes("coding lab") || ev.includes("lab 3")) && location.id === 1) return true
      if ((ev.includes("ai") || ev.includes("data science") || ev.includes("entc")) && location.id === 2) return true
      if ((ev.includes("sae") || ev.includes("mech") || ev.includes("workshop") || ev.includes("quadrangle")) && location.id === 4) return true
      if ((ev.includes("playground") || ev.includes("ground") || ev.includes("pg") || ev.includes("stadium")) && location.id === 6) return true
      if ((ev.includes("court") || ev.includes("basket") || ev.includes("volley")) && location.id === 7) return true
      if (ev.includes("canteen") && location.id === 5) return true

      return false
    })
  }

  const activeEventsAtSelected = getEventsForVenue(selectedVenue)

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("NKOCET Solapur " + selectedVenue.name)}`

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-50 duration-300">
      
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Button>
          </Link>
          <a href={googleMapsUrl} target="_blank" rel="noreferrer">
            <Button size="sm" className="h-8 gap-1.5 text-xs font-black bg-gradient-to-r from-primary to-teal-600 text-white shadow-md hover:scale-105 transition-all">
              <ExternalLink className="h-3.5 w-3.5" /> Open Google Maps Navigation
            </Button>
          </a>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Compass className="h-7 w-7 text-primary" /> Official NKOCET Campus Map
              </h1>
              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/20">
                100% Exact Layout
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Interactive 2D architectural blueprint map matching NKOCET campus layout: CSE, AIDS/ENTC, Civil, Mech, PG, Canteens & Hostels.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-6">
        
        {/* Left Column: Official Campus Visual Blueprint */}
        <div className="lg:col-span-8 space-y-6">
          
          <Card className="border shadow-xl overflow-hidden bg-card">
            
            {/* Header Bar */}
            <div className="p-3.5 border-b bg-muted/40 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black">
                <Navigation className="h-4 w-4 text-primary" />
                <span>NKOCET Campus Layout Blueprint (Click any location pin)</span>
              </div>
              <Badge variant="outline" className="text-[11px] font-bold bg-background">
                📍 {NKOCET_CAMPUS_LOCATIONS.length} Official Locations
              </Badge>
            </div>

            {/* Visual Canvas containing Generated Blueprint Map */}
            <div className="relative w-full h-[480px] bg-slate-950 overflow-hidden select-none">
              
              {/* High-Resolution Blueprint Vector Map Image */}
              <img
                src="/nkocet_campus_map.jpg"
                alt="NKOCET Campus Blueprint Map"
                className="w-full h-full object-cover"
              />

              {/* Interactive Clickable Venue Overlay Pins */}
              {NKOCET_CAMPUS_LOCATIONS.map((venue) => {
                const isSelected = selectedVenue.id === venue.id
                const venueEvents = getEventsForVenue(venue)
                const hasEvents = venueEvents.length > 0
                return (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue)}
                    style={{ left: `${venue.coordinates.x}%`, top: `${venue.coordinates.y}%` }}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 transition-all transform hover:scale-125 focus:outline-none z-20 flex flex-col items-center cursor-pointer group",
                      isSelected && "z-30 scale-110"
                    )}
                  >
                    <div className="relative">
                      <div
                        className={cn(
                          "h-8 w-8 sm:h-9 sm:w-9 rounded-xl flex items-center justify-center shadow-2xl transition-all border-2",
                          isSelected
                            ? "bg-primary text-white border-white ring-4 ring-primary/40 animate-pulse scale-110"
                            : hasEvents
                            ? "bg-emerald-600 text-white border-emerald-300 ring-2 ring-emerald-400/50"
                            : "bg-slate-900/90 text-teal-300 border-teal-400 hover:bg-primary hover:text-white"
                        )}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                      {hasEvents && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border border-slate-950 animate-ping" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "mt-1 px-2.5 py-0.5 rounded-lg text-[10px] sm:text-xs font-black whitespace-nowrap shadow-xl backdrop-blur-md transition-all border flex items-center gap-1",
                        isSelected
                          ? "bg-primary text-white border-white shadow-primary/50"
                          : "bg-slate-900/95 text-slate-100 border-slate-700 group-hover:border-primary"
                      )}
                    >
                      {venue.code}
                      {hasEvents && (
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      )}
                    </span>
                  </button>
                )
              })}
            </div>

          </Card>

          {/* Selected Location Information Card */}
          {selectedVenue && (
            <Card className="border-primary/40 bg-card shadow-md">
              <CardContent className="p-6 space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full mb-1">
                      <Building2 className="h-3.5 w-3.5" /> {selectedVenue.category} Zone
                    </div>
                    <h3 className="font-black text-2xl text-foreground flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-primary shrink-0" /> {selectedVenue.name} ({selectedVenue.code})
                    </h3>
                    <p className="text-xs font-bold text-primary mt-0.5">
                      📍 {selectedVenue.address}
                    </p>
                  </div>

                  <Badge className="w-fit bg-primary text-white text-xs font-black px-3 py-1 shrink-0">
                    Capacity: {selectedVenue.capacity} People
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {selectedVenue.description}
                </p>

                {/* Upcoming Events at Location */}
                <div className="space-y-3">
                  <div className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" /> Live Events Hosted at this Venue ({activeEventsAtSelected.length}):
                    </span>
                    {activeEventsAtSelected.length > 0 && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                        Live Scheduled
                      </Badge>
                    )}
                  </div>

                  {activeEventsAtSelected.length > 0 ? (
                    <div className="space-y-2.5">
                      {activeEventsAtSelected.map((evt: any) => {
                        const dateDisplay = evt.date || (evt.startDatetime ? new Date(evt.startDatetime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Upcoming")
                        return (
                          <div key={evt.id} className="p-3.5 rounded-2xl bg-muted/40 border border-primary/20 hover:border-primary/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-sm text-foreground">
                                  {evt.title}
                                </span>
                                {evt.category && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-bold border-primary/30">
                                    {evt.category}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-semibold">
                                <span>📅 {dateDisplay} • {evt.time || "10:00 AM"}</span>
                                <span>•</span>
                                <span>🏢 {evt.organizer || "Campus Club"}</span>
                              </div>
                            </div>
                            <Link href={`/events/${evt.id}`}>
                              <Button size="sm" className="h-8 gap-1.5 text-xs font-bold shrink-0">
                                View Event <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-muted/40 border border-primary/20 space-y-2">
                      <h4 className="text-sm font-black text-foreground">
                        {selectedVenue.upcomingEventTitle}
                      </h4>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-semibold">
                        <span>📅 {selectedVenue.upcomingEventDate}</span>
                        <Badge variant="secondary" className="text-[10px] font-bold">{selectedVenue.organizer}</Badge>
                      </div>
                    </div>
                  )}
                </div>

                {/* Amenities Tags */}
                <div className="space-y-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">Location Amenities:</span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {selectedVenue.facilities.map((fac) => (
                      <span
                        key={fac}
                        className="px-3 py-1 rounded-xl text-xs font-bold bg-background border shadow-2xs flex items-center gap-1.5 text-foreground"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Column: Campus Location Directory & Directions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Location Roster */}
          <Card className="border shadow-sm">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-base font-black flex items-center justify-between">
                <span>NKOCET Campus Directory</span>
                <Badge variant="secondary" className="text-[10px] font-bold">10 Locations</Badge>
              </CardTitle>
              <div className="mt-2">
                <Input
                  placeholder="Search CSE, Mech, PG, Canteen, GH, BH..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 text-xs bg-background font-medium"
                />
              </div>
            </CardHeader>

            <CardContent className="p-2 max-h-[380px] overflow-y-auto space-y-1.5">
              {filteredLocations.map((venue) => {
                const isSelected = selectedVenue.id === venue.id
                return (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all flex items-start justify-between group border cursor-pointer",
                      isSelected
                        ? "bg-primary/10 border-primary/50 shadow-2xs"
                        : "hover:bg-muted/60 border-transparent"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-black group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <MapPin className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                        {venue.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground line-clamp-1 font-medium">
                        📍 {venue.floor}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-bold shrink-0">
                      {venue.code}
                    </Badge>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Campus Directions */}
          <Card className="border shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/30">
              <CardTitle className="text-base font-black flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" /> Campus Directions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider block mb-1">
                  Starting Point:
                </label>
                <select
                  value={originVenue}
                  onChange={(e) => setOriginVenue(e.target.value)}
                  className="w-full h-9 px-3 text-xs rounded-xl border bg-background font-bold text-foreground cursor-pointer"
                >
                  <option value="College Main Gate">College Main Entrance Gate</option>
                  <option value="Big Canteen">Big Canteen</option>
                  <option value="Girls Hostel (GH)">Girls Hostel (GH)</option>
                  <option value="Boys Hostel (BH)">Boys Hostel (BH)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="font-black text-primary flex items-center gap-1.5 text-xs">
                  <Info className="h-4 w-4" /> Walking Directions:
                </div>
                <p className="text-muted-foreground leading-relaxed font-medium">
                  Start from <strong className="text-foreground">{originVenue}</strong> and walk along the central campus avenue past the Playground (PG). Destination <strong className="text-foreground">{selectedVenue.name}</strong> is located at <strong className="text-foreground">{selectedVenue.floor}</strong>.
                </p>
                <div className="pt-2 border-t border-primary/10 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Target Destination: {selectedVenue.name}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  )
}
