import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Navigation, Users, Tv, Mic, Wind, Info, Calendar, ArrowLeft, Building2, CheckCircle2, Clock } from "lucide-react"
import { UPCOMING_EVENTS_DATA, UpcomingEventItem } from "@/data/landing-data"
import { Link } from "wouter"
import { cn } from "@/lib/utils"

interface CampusVenue {
  id: number
  name: string
  address: string
  building: string
  floor: string
  capacity: number
  facilities: string[]
  coordinates: { x: number; y: number }
  description: string
  upcomingEventTitle: string
  upcomingEventDate: string
  organizer: string
}

const CAMPUS_VENUES: CampusVenue[] = [
  {
    id: 1,
    name: "College Seminar Hall",
    address: "Ground Floor, Main Academic Building, NKOCET Campus",
    building: "Main Academic Building",
    floor: "Ground Floor",
    capacity: 350,
    facilities: ["HD Laser Projector", "Dolby Surround Sound", "AC", "Stage Lighting", "Wireless Mics"],
    coordinates: { x: 35, y: 40 },
    description: "Primary venue for flagship pitch competitions, club inaugurations, and institutional guest lectures.",
    upcomingEventTitle: "Eureka Pitching Competition (Internal Round) & E-Cell NKOCET Grand Inauguration",
    upcomingEventDate: "Aug 22, 2026 • 09:30 AM - 04:00 PM",
    organizer: "E-Cell NKOCET"
  },
  {
    id: 2,
    name: "College Seminar Hall B",
    address: "1st Floor, Language & Humanities Wing, NKOCET Campus",
    building: "Language & Humanities Block",
    floor: "1st Floor",
    capacity: 150,
    facilities: ["Smart Podium", "High-speed Wi-Fi", "AC", "Acoustic Wall Panels"],
    coordinates: { x: 22, y: 72 },
    description: "Dedicated hall for literary events, debates, public speaking workshops, and club orientations.",
    upcomingEventTitle: "English Club Inauguration & Inter-Departmental Debate Championship",
    upcomingEventDate: "Aug 22, 2026 • 02:00 PM - 04:30 PM",
    organizer: "ENGLISH CLUB"
  },
  {
    id: 3,
    name: "Central Computer Center",
    address: "2nd Floor, Computer Science & Engineering Block, NKOCET",
    building: "CSE Block",
    floor: "2nd Floor",
    capacity: 200,
    facilities: ["High-Perf Workstations", "Gigabit Fiber Internet", "Dual Projectors", "AC"],
    coordinates: { x: 68, y: 28 },
    description: "Advanced computing labs for 24-hour hackathons, coding contests, and technical bootcamps.",
    upcomingEventTitle: "CSESA National Code-A-Thon & Hackathon 2026 / GDG Cloud Bootcamp",
    upcomingEventDate: "Oct 24, 2026 • 09:00 AM - 06:00 PM",
    organizer: "CSESA / GDG NKOCET"
  },
  {
    id: 4,
    name: "College Main Auditorium",
    address: "1st Floor, Central Admin Block, NKOCET Campus",
    building: "Central Admin Block",
    floor: "1st Floor",
    capacity: 750,
    facilities: ["Grand Stage", "Professional Sound Rig", "Full AC", "Balcony Seating", "Green Rooms"],
    coordinates: { x: 50, y: 55 },
    description: "Spacious central auditorium for annual cultural festivals, grand ceremonies, and Youth Orientations.",
    upcomingEventTitle: "Rotaract Club Youth Orientation & Community Service Drive",
    upcomingEventDate: "Aug 22, 2026 • 04:30 PM - 06:00 PM",
    organizer: "Rotaract Club of NKOCET"
  },
  {
    id: 5,
    name: "Mechanical Quadrangle & SAE Workshop",
    address: "Ground Floor, Mechanical Engineering Complex, NKOCET",
    building: "Mechanical Complex",
    floor: "Ground Floor & Outdoor Lawn",
    capacity: 300,
    facilities: ["Fabrication Workshop", "Vehicle Test Track", "Hydraulic Lifts", "Heavy Power Supply"],
    coordinates: { x: 25, y: 25 },
    description: "Open testing area and fabrication workshop for SAE Baja all-terrain vehicles and engineering teams.",
    upcomingEventTitle: "Team Avengineers SAE All-Terrain Vehicle Showcase & Driver Test",
    upcomingEventDate: "Sep 12, 2026 • 10:00 AM - 04:00 PM",
    organizer: "Team Avengineers"
  },
  {
    id: 6,
    name: "College Sports Ground & Open Air Arena",
    address: "East Campus, Outdoor Athletics Grounds, NKOCET",
    building: "Sports Complex",
    floor: "Outdoor Field",
    capacity: 1200,
    facilities: ["Open Air Arena", "Flight Grid", "Floodlights", "Public Address System"],
    coordinates: { x: 80, y: 70 },
    description: "Expansive outdoor stadium for UAV drone flying demonstrations, aeromodelling expos, and sports meets.",
    upcomingEventTitle: "Team Pushpak UAV Drone Flying Expo & Aero Workshop",
    upcomingEventDate: "Sep 18, 2026 • 11:00 AM - 03:00 PM",
    organizer: "Team Pushpak"
  },
  {
    id: 7,
    name: "Central Lawn & Workshop Area",
    address: "Central Green Quadrangle, Main Campus, NKOCET",
    building: "Central Quadrangle",
    floor: "Ground Floor Outdoor",
    capacity: 400,
    facilities: ["Exhibition Canopy", "PA System", "EV Charging Point"],
    coordinates: { x: 45, y: 20 },
    description: "Central gathering lawn for supermileage vehicle unveilings, hardware expos, and club fairs.",
    upcomingEventTitle: "Team Ashwamedh Hybrid Supermileage Car Launch",
    upcomingEventDate: "Sep 25, 2026 • 02:00 PM - 05:00 PM",
    organizer: "Team Ashwamedh"
  }
]

export default function CampusMapPage() {
  const [search, setSearch] = useState("")
  const [selectedVenue, setSelectedVenue] = useState<CampusVenue>(CAMPUS_VENUES[0])
  const [originVenue, setOriginVenue] = useState<string>("College Main Gate")

  const filteredVenues = CAMPUS_VENUES.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.building.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase()) ||
      v.upcomingEventTitle.toLowerCase().includes(search.toLowerCase())
  )

  const activeEventsAtSelected = UPCOMING_EVENTS_DATA.filter(
    (e) => e.venue.toLowerCase().includes(selectedVenue.name.toLowerCase()) || selectedVenue.name.toLowerCase().includes(e.venue.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Navigation */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Button>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" /> Event Venue & Address Locator
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Find exact physical addresses, hall locations, capacities & floor directions for all NKOCET campus events.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit h-8 px-3 text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            📍 7 Active NKOCET Event Venues
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Map Display & Selected Venue Addresses */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 overflow-hidden relative shadow-md">
            <CardHeader className="p-4 border-b bg-muted/40 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" /> NKOCET Campus Interactive Venue Layout
              </CardTitle>
              <Badge variant="outline" className="text-xs bg-background">
                Click any venue pin to view event address
              </Badge>
            </CardHeader>

            <CardContent className="p-0 relative">
              {/* Interactive Vector Map SVG */}
              <div className="relative w-full h-[450px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 overflow-hidden select-none">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: "radial-gradient(#38bdf8 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                  }}
                />

                {/* SVG Pathways & Campus Grounds */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-teal-500/30" strokeWidth="2.5" fill="none">
                  {/* Pathway lines connecting NKOCET venues */}
                  <line x1="35%" y1="40%" x2="68%" y2="28%" strokeDasharray="5 5" />
                  <line x1="35%" y1="40%" x2="50%" y2="55%" strokeDasharray="5 5" />
                  <line x1="50%" y1="55%" x2="80%" y2="70%" strokeDasharray="5 5" />
                  <line x1="50%" y1="55%" x2="22%" y2="72%" strokeDasharray="5 5" />
                  <line x1="35%" y1="40%" x2="25%" y2="25%" strokeDasharray="5 5" />
                  <line x1="35%" y1="40%" x2="45%" y2="20%" strokeDasharray="5 5" />
                </svg>

                {/* Campus Landmark Zones */}
                <div className="absolute top-4 left-4 text-[11px] font-mono text-teal-400/80 uppercase tracking-widest pointer-events-none flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Main Academic Wing & Seminar Halls
                </div>
                <div className="absolute bottom-4 right-4 text-[11px] font-mono text-teal-400/80 uppercase tracking-widest pointer-events-none">
                  East Campus & Sports Grounds
                </div>

                {/* Interactive Map Pins */}
                {CAMPUS_VENUES.map((venue) => {
                  const isSelected = selectedVenue.id === venue.id
                  return (
                    <button
                      key={venue.id}
                      onClick={() => setSelectedVenue(venue)}
                      style={{ left: `${venue.coordinates.x}%`, top: `${venue.coordinates.y}%` }}
                      className={cn(
                        "absolute -translate-x-1/2 -translate-y-1/2 transition-all transform hover:scale-125 focus:outline-none group z-10 flex flex-col items-center",
                        isSelected && "z-30 scale-110"
                      )}
                    >
                      <div
                        className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center shadow-xl transition-all border-2 cursor-pointer",
                          isSelected
                            ? "bg-primary text-primary-foreground border-white ring-4 ring-primary/40 animate-pulse"
                            : "bg-slate-900 text-teal-300 border-teal-500/60 hover:bg-teal-500 hover:text-white"
                        )}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span
                        className={cn(
                          "mt-1 px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap shadow-lg backdrop-blur-md transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground border border-white/20"
                            : "bg-slate-900/90 text-slate-200 border border-slate-700"
                        )}
                      >
                        {venue.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Venue Details & Physical Address */}
          {selectedVenue && (
            <Card className="border-primary/40 bg-card shadow-md">
              <CardContent className="p-6 space-y-5">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b pb-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
                      <Building2 className="h-3.5 w-3.5" /> Official Event Venue
                    </div>
                    <h3 className="font-extrabold text-2xl text-foreground flex items-center gap-2">
                      <MapPin className="h-6 w-6 text-primary shrink-0" /> {selectedVenue.name}
                    </h3>
                    <p className="text-sm font-semibold text-primary/90 flex items-center gap-1.5">
                      📍 {selectedVenue.address}
                    </p>
                  </div>
                  
                  <Badge className="w-fit bg-primary text-primary-foreground px-3 py-1 text-xs font-bold shrink-0">
                    Capacity: {selectedVenue.capacity} Seats
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedVenue.description}
                </p>

                {/* Upcoming Major Event at this venue */}
                <div className="p-4 rounded-xl bg-muted/40 border border-primary/20 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" /> Next Major Scheduled Event Here:
                  </div>
                  <h4 className="text-base font-bold text-foreground">
                    {selectedVenue.upcomingEventTitle}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {selectedVenue.upcomingEventDate}
                    </span>
                    <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold">
                      Organized by {selectedVenue.organizer}
                    </span>
                  </div>
                </div>

                {/* Facility Tags */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Available Venue Amenities:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedVenue.facilities.map((fac) => (
                      <span
                        key={fac}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-background border shadow-2xs flex items-center gap-1.5 text-foreground"
                      >
                        {fac.toLowerCase().includes("projector") && <Tv className="h-3.5 w-3.5 text-primary" />}
                        {fac.toLowerCase().includes("mic") && <Mic className="h-3.5 w-3.5 text-primary" />}
                        {fac.toLowerCase().includes("ac") && <Wind className="h-3.5 w-3.5 text-primary" />}
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* All Scheduled Events List at this Venue */}
                <div className="pt-3 border-t">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> All Upcoming Events at {selectedVenue.name}:
                  </h4>
                  <div className="space-y-2">
                    {activeEventsAtSelected.map((evt: UpcomingEventItem) => (
                      <Link
                        key={evt.id}
                        href={`/events/${evt.id}`}
                        className="flex items-center justify-between p-3 rounded-xl bg-background border hover:border-primary transition-all group cursor-pointer shadow-2xs"
                      >
                        <div>
                          <div className="text-sm font-bold group-hover:text-primary transition-colors">
                            {evt.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span>📅 {evt.date} • {evt.time}</span>
                            <span className="text-primary font-medium">• {evt.organizer}</span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 px-3 text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                          Register / View →
                        </Button>
                      </Link>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Searchable Directory & Campus Walk Directions */}
        <div className="space-y-6">
          {/* Venue Search & Address Roster */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-base font-semibold flex items-center justify-between">
                <span>NKOCET Venue Directory</span>
                <Badge variant="secondary" className="text-[11px]">7 Halls</Badge>
              </CardTitle>
              <div className="mt-2">
                <Input
                  placeholder="Search by venue name, event or building..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
            </CardHeader>
            <CardContent className="p-2 max-h-[380px] overflow-y-auto space-y-1.5">
              {filteredVenues.map((venue) => {
                const isSelected = selectedVenue.id === venue.id
                return (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl transition-all flex items-start justify-between group border",
                      isSelected
                        ? "bg-primary/10 border-primary/50 shadow-2xs"
                        : "hover:bg-muted/60 border-transparent"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-bold group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <MapPin className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                        {venue.name}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        📍 {venue.address}
                      </div>
                      <div className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold line-clamp-1">
                        🎯 Next: {venue.upcomingEventTitle}
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-muted-foreground bg-background px-2 py-1 rounded-md border shrink-0">
                      {venue.capacity} Seats
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Step-by-Step Campus Directions Widget */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/30">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" /> Step-by-Step Campus Directions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Starting Location:
                </label>
                <select
                  value={originVenue}
                  onChange={(e) => setOriginVenue(e.target.value)}
                  className="w-full h-10 px-3 text-sm rounded-lg border bg-background font-semibold"
                >
                  <option value="College Main Gate">College Main Entrance Gate</option>
                  <option value="Central Library">Central Library & Reading Hall</option>
                  <option value="Student Canteen">Main Student Canteen & Cafeteria</option>
                  <option value="Boys & Girls Hostels">Hostel Campus Complex</option>
                  <option value="Parking Plaza">Main Vehicle Parking Area</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Event Destination Address:
                </label>
                <div className="p-3 rounded-lg border bg-muted/50 font-bold text-sm text-foreground">
                  📍 {selectedVenue.name}
                  <div className="text-xs font-normal text-muted-foreground mt-0.5">{selectedVenue.address}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs space-y-2">
                <div className="font-bold text-primary flex items-center gap-1.5 text-sm">
                  <Info className="h-4 w-4" /> Walking Directions (~3 mins walk)
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Enter from <strong className="text-foreground">{originVenue}</strong> and walk down the central paved avenue. Follow the directional signboards towards <strong className="text-foreground">{selectedVenue.building}</strong>. Take the main staircase/elevator to <strong className="text-foreground">{selectedVenue.floor}</strong>.
                </p>
                <div className="pt-2 border-t border-primary/10 font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Destination reached: {selectedVenue.name}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
