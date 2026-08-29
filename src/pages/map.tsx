import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, Navigation, Users, Tv, Mic, Wind, Info, Calendar, ArrowLeft } from "lucide-react"
import { useListEvents } from "@workspace/api-client-react"
import { Link } from "wouter"
import { cn } from "@/lib/utils"

interface CampusVenue {
  id: number
  name: string
  building: string
  floor: string
  capacity: number
  facilities: string[]
  coordinates: { x: number; y: number }
  description: string
}

const CAMPUS_VENUES: CampusVenue[] = [
  {
    id: 1,
    name: "Main Auditorium",
    building: "Central Admin Block",
    floor: "Ground Floor",
    capacity: 600,
    facilities: ["HD Projector", "Dolby Audio", "AC", "Stage Lighting", "Mic"],
    coordinates: { x: 30, y: 35 },
    description: "Grand auditorium for university ceremonies, keynotes, and cultural events."
  },
  {
    id: 2,
    name: "Tech Hall 101",
    building: "Engineering Block A",
    floor: "1st Floor",
    capacity: 120,
    facilities: ["Smart Board", "High-speed Wi-Fi", "AC", "Mic"],
    coordinates: { x: 65, y: 25 },
    description: "Modern lecture hall equipped for technical hackathons and workshops."
  },
  {
    id: 3,
    name: "Student Activity Center",
    building: "SAC Complex",
    floor: "2nd Floor",
    capacity: 250,
    facilities: ["Sound System", "Stage", "Flexible Seating"],
    coordinates: { x: 45, y: 65 },
    description: "Hub for student club meetings, music practice, and indoor competitions."
  },
  {
    id: 4,
    name: "Open Air Theatre",
    building: "Sports Grounds",
    floor: "Outdoor",
    capacity: 1000,
    facilities: ["Outdoor Stage", "Floodlights", "PA System"],
    coordinates: { x: 75, y: 70 },
    description: "Spacious outdoor amphitheater for concerts, sports rallies, and festivals."
  },
  {
    id: 5,
    name: "Seminar Room B",
    building: "Science Block",
    floor: "3rd Floor",
    capacity: 80,
    facilities: ["Projector", "AC", "Video Conferencing"],
    coordinates: { x: 20, y: 75 },
    description: "Intimate seminar setup ideal for guest lectures and thesis defense."
  }
]

export default function CampusMapPage() {
  const [search, setSearch] = useState("")
  const [selectedVenue, setSelectedVenue] = useState<CampusVenue>(CAMPUS_VENUES[0])
  const [originVenue, setOriginVenue] = useState<string>("Main Gate")

  const { data: eventsData } = useListEvents({ status: "upcoming" })

  const filteredVenues = CAMPUS_VENUES.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.building.toLowerCase().includes(search.toLowerCase())
  )

  const activeEventsAtSelected = (eventsData?.events || []).filter(
    (e) => e.venue?.id === selectedVenue.id || e.venue?.name === selectedVenue.name
  )
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <MapPin className="h-8 w-8 text-primary" /> Interactive Campus Map
        </h1>
        <p className="text-muted-foreground">
          Locate event venues, view hall capacities & equipment, and get directions.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Map Display */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-border/50 overflow-hidden relative shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/30 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" /> Campus Map Layout
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                Active Venues: {CAMPUS_VENUES.length}
              </Badge>
            </CardHeader>

            <CardContent className="p-0 relative">
              {/* Interactive Vector Map SVG */}
              <div className="relative w-full h-[440px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 overflow-hidden select-none">
                {/* Background Grid Pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
                    backgroundSize: "20px 20px"
                  }}
                />

                {/* SVG Pathways & Campus Grounds */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-teal-500/20" strokeWidth="3" fill="none">
                  {/* Pathway lines connecting venues */}
                  <line x1="30%" y1="35%" x2="65%" y2="25%" strokeDasharray="4 4" />
                  <line x1="30%" y1="35%" x2="45%" y2="65%" strokeDasharray="4 4" />
                  <line x1="45%" y1="65%" x2="75%" y2="70%" strokeDasharray="4 4" />
                  <line x1="45%" y1="65%" x2="20%" y2="75%" strokeDasharray="4 4" />
                </svg>

                {/* Campus Landmark Zones */}
                <div className="absolute top-4 left-4 text-[11px] font-mono text-teal-400/60 uppercase tracking-widest pointer-events-none">
                  North Academic Quadrant
                </div>
                <div className="absolute bottom-4 right-4 text-[11px] font-mono text-teal-400/60 uppercase tracking-widest pointer-events-none">
                  South Student Facilities
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
                        isSelected && "z-20 scale-110"
                      )}
                    >
                      <div
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center shadow-lg transition-colors border-2",
                          isSelected
                            ? "bg-primary text-primary-foreground border-white ring-4 ring-primary/30"
                            : "bg-slate-800 text-teal-400 border-teal-500/50 hover:bg-teal-500 hover:text-white"
                        )}
                      >
                        <MapPin className="h-5 w-5" />
                      </div>
                      <span
                        className={cn(
                          "mt-1 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap shadow-md backdrop-blur-md transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
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

          {/* Selected Venue Specs Card */}
          {selectedVenue && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-primary/20 pb-3">
                  <div>
                    <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" /> {selectedVenue.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedVenue.building} • {selectedVenue.floor}
                    </p>
                  </div>
                  <Badge className="w-fit bg-primary text-primary-foreground">
                    Capacity: {selectedVenue.capacity} seats
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed">{selectedVenue.description}</p>

                {/* Facility Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-muted-foreground mr-1">Facilities:</span>
                  {selectedVenue.facilities.map((fac) => (
                    <span
                      key={fac}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-background border shadow-2xs flex items-center gap-1"
                    >
                      {fac.toLowerCase().includes("projector") && <Tv className="h-3.5 w-3.5 text-primary" />}
                      {fac.toLowerCase().includes("mic") && <Mic className="h-3.5 w-3.5 text-primary" />}
                      {fac.toLowerCase().includes("ac") && <Wind className="h-3.5 w-3.5 text-primary" />}
                      {fac}
                    </span>
                  ))}
                </div>

                {/* Active Events at Venue */}
                <div className="pt-2 border-t border-primary/10">
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> Scheduled Events at this Venue:
                  </h4>
                  {activeEventsAtSelected.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No upcoming events scheduled right now.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {activeEventsAtSelected.map((evt) => (
                        <Link
                          key={evt.id}
                          href={`/events/${evt.id}`}
                          className="flex items-center justify-between p-2 rounded-md bg-background border hover:border-primary text-xs transition-colors"
                        >
                          <span className="font-semibold">{evt.title}</span>
                          <span className="text-primary font-medium">View →</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Searchable Directory & Directions */}
        <div className="space-y-6">
          {/* Venue Search & Roster */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-base font-semibold">Venue Directory</CardTitle>
              <div className="mt-2">
                <Input
                  placeholder="Search buildings or rooms..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
            </CardHeader>
            <CardContent className="p-2 max-h-[320px] overflow-y-auto space-y-1">
              {filteredVenues.map((venue) => {
                const isSelected = selectedVenue.id === venue.id
                return (
                  <button
                    key={venue.id}
                    onClick={() => setSelectedVenue(venue)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between group",
                      isSelected ? "bg-primary/10 border border-primary/40 font-semibold" : "hover:bg-muted"
                    )}
                  >
                    <div>
                      <div className="text-sm font-medium group-hover:text-primary transition-colors">
                        {venue.name}
                      </div>
                      <div className="text-xs text-muted-foreground">{venue.building}</div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {venue.capacity}
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Route Directions Widget */}
          <Card className="border-border/50">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" /> Campus Directions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Starting From:</label>
                <select
                  value={originVenue}
                  onChange={(e) => setOriginVenue(e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border bg-background"
                >
                  <option value="Main Gate">Main Entrance Gate</option>
                  <option value="Library">Central Library</option>
                  <option value="Cafeteria">Student Cafeteria</option>
                  <option value="Hostel Area">Hostel Complex</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Destination:</label>
                <div className="h-9 px-3 text-sm rounded-md border bg-muted flex items-center font-medium">
                  {selectedVenue.name} ({selectedVenue.building})
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/40 text-xs space-y-1.5 border">
                <div className="font-semibold text-primary flex items-center gap-1">
                  <Info className="h-3.5 w-3.5" /> Walk Guidance (~4 mins)
                </div>
                <p className="text-muted-foreground">
                  Head straight from {originVenue} towards the central walkway. Take the left avenue past the library
                  fountain into {selectedVenue.building}. {selectedVenue.name} is on the {selectedVenue.floor}.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
