import { useListClubs } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, ExternalLink, ShieldCheck } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { ArrowLeft } from "lucide-react"

export default function Clubs() {
  const [search, setSearch] = useState("")
  
  const { data, isLoading } = useListClubs({
    q: search || undefined
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campus Clubs</h1>
          <p className="text-muted-foreground">Discover organizations and find your community.</p>
        </div>
      </div>

      <div className="max-w-md">
        <Input 
          placeholder="Search clubs by name or category..." 
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.map((club: any) => (
            <Link key={club.id} href={`/clubs/${club.id}`}>
              <Card className="h-full hover-elevate transition-all border-border/50 shadow-sm cursor-pointer overflow-hidden group">
                <div className="h-24 bg-muted relative">
                  {club.bannerUrl ? (
                    <img src={club.bannerUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-teal-500/20" />
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 border-2 border-background -mt-8 shadow-sm">
                      <AvatarImage src={club.logoUrl || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {club.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{club.name}</h3>
                      <Badge variant="secondary" className="text-xs font-normal">{club.category}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-4">{club.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-3 border-t">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {club.memberCount || 0} Members</span>
                    {club.recruitmentOpen && (
                      <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">Recruiting</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {data?.length === 0 && (
             <div className="col-span-full py-20 text-center border rounded-xl border-dashed">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No clubs found</h3>
                <p className="text-muted-foreground mt-1">Try a different search term.</p>
             </div>
          )}
        </div>
      )}
    </div>
  )
}
