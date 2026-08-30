import { useListClubs } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, ArrowLeft, Building2 } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FEATURED_CLUBS_DATA } from "@/data/landing-data"

export default function Clubs() {
  const [search, setSearch] = useState("")
  
  const { data, isLoading } = useListClubs({
    q: search || undefined
  })

  const clubsList = (Array.isArray(data) ? data : (data?.clubs || FEATURED_CLUBS_DATA)).filter((club: any) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (club?.name || "").toLowerCase().includes(q) ||
      (club?.category || "").toLowerCase().includes(q) ||
      (club?.tagline || "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" /> NKOCET Campus Clubs & Societies
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover student organizations, technical societies, SAE teams, and find your community.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit h-8 px-3 text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          🏛️ {clubsList.length} Active Organizations
        </Badge>
      </div>

      <div className="max-w-md">
        <Input 
          placeholder="Search clubs by name, category or team..." 
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-56 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : clubsList.length === 0 ? (
        <div className="col-span-full py-20 text-center border rounded-xl border-dashed">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No clubs found</h3>
          <p className="text-muted-foreground mt-1">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubsList.map((club: any) => (
            <Link key={club.id} href={`/clubs/${club.id}`}>
              <Card className="h-full hover-elevate transition-all border-border/50 shadow-sm cursor-pointer overflow-hidden group flex flex-col justify-between">
                <div>
                  <div className="h-28 bg-muted relative overflow-hidden">
                    {club.bannerUrl ? (
                      <img src={club.bannerUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary/20 to-teal-500/20" />
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-[10px] font-semibold bg-background/90 backdrop-blur shadow-2xs">
                        {club.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 pt-0">
                    <div className="flex items-start gap-3 -mt-6">
                      <Avatar className="h-14 w-14 border-2 border-background shadow-md bg-card shrink-0">
                        <AvatarImage src={club.logoUrl || ''} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black text-lg">
                          {(club?.name || 'C').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-7 space-y-1">
                        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{club.name}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 mt-3 leading-relaxed">
                      {club.tagline || club.description}
                    </p>
                  </CardContent>
                </div>

                <div className="px-5 pb-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Users className="h-3.5 w-3.5 text-primary" /> {club.memberCount || 0} Members
                  </span>
                  <span className="text-primary font-bold group-hover:translate-x-1 transition-transform">
                    View Club →
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
