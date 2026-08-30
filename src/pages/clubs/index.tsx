import { useListClubs } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, ArrowLeft, Building2, ChevronDown } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FEATURED_CLUBS_DATA } from "@/data/landing-data"

export default function Clubs() {
  const [search, setSearch] = useState("")
  const [limit, setLimit] = useState<number>(6)
  
  const { data, isLoading } = useListClubs({
    q: search || undefined
  })

  const fullClubsList = (Array.isArray(data) ? data : (data?.clubs || FEATURED_CLUBS_DATA)).filter((club: any) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (club?.name || "").toLowerCase().includes(q) ||
      (club?.category || "").toLowerCase().includes(q) ||
      (club?.tagline || "").toLowerCase().includes(q)
    )
  })

  const visibleClubs = fullClubsList.slice(0, limit)

  return (
    <div className="space-y-3 max-w-7xl mx-auto animate-in fade-in-50 duration-200">
      
      {/* Compact Header */}
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs font-semibold gap-1 hover:bg-primary hover:text-primary-foreground transition-all">
              <ArrowLeft className="h-3 w-3" /> Home
            </Button>
          </Link>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" /> NKOCET Student Clubs & Societies
          </h1>
        </div>
        <Badge variant="secondary" className="px-2.5 py-0.5 font-bold text-xs bg-primary/10 text-primary border border-primary/20">
          Showing {visibleClubs.length} of {fullClubsList.length} Clubs
        </Badge>
      </div>

      {/* Ultra-Compact Search Bar */}
      <div className="flex items-center gap-2 max-w-md">
        <Input 
          placeholder="Search clubs by name, category or team..." 
          icon={<Search className="h-3.5 w-3.5" />}
          className="h-8 text-xs bg-background font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : fullClubsList.length === 0 ? (
        <div className="col-span-full py-12 text-center border rounded-xl border-dashed">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-sm font-bold">No clubs found</h3>
        </div>
      ) : (
        <>
          {/* EXACTLY 6 CLUB CARDS DISPLAYED (3 columns x 2 rows) with 4:3 / 3:3 Aspect Ratio */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {visibleClubs.map((club: any) => (
              <Link key={club.id} href={`/clubs/${club.id}`}>
                <Card className="hover:border-primary/60 transition-all border bg-card shadow-2xs cursor-pointer overflow-hidden group hover:scale-[1.01] flex flex-col justify-between">
                  <div>
                    {/* Aspect Ratio 4:3 / 3:3 Banner Image */}
                    <div className="aspect-[4/3] sm:aspect-[16/10] bg-muted relative overflow-hidden">
                      {club.bannerUrl ? (
                        <img src={club.bannerUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-teal-500/20" />
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="text-[10px] font-bold bg-background/90 backdrop-blur shadow-2xs">
                          {club.category}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-3 pt-0">
                      <div className="flex items-start gap-2.5 -mt-5">
                        <Avatar className="h-10 w-10 border-2 border-background shadow-md bg-card shrink-0">
                          <AvatarImage src={club.logoUrl || ''} />
                          <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                            {(club?.name || 'C').charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="mt-5 space-y-0.5 overflow-hidden">
                          <h3 className="font-extrabold text-sm leading-tight group-hover:text-primary transition-colors truncate">{club.name}</h3>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1.5 font-medium">
                        {club.tagline || club.description}
                      </p>
                    </CardContent>
                  </div>

                  <div className="px-3 py-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Users className="h-3 w-3 text-primary" /> {club.memberCount || 0} Members
                    </span>
                    <span className="text-primary font-bold group-hover:underline">
                      View Club →
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More Control */}
          {fullClubsList.length > visibleClubs.length && (
            <div className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimit((prev) => prev + 6)}
                className="h-8 px-4 text-xs font-bold gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all shadow-xs"
              >
                <span>Load More Clubs ({fullClubsList.length - visibleClubs.length} remaining)</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
