import { Link } from "wouter";
import { FEATURED_CLUBS_DATA, FeaturedClubItem } from "@/data/landing-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ArrowRight, Sparkles, ChevronRight, Calendar } from "lucide-react";

export function FeaturedClubs() {
  return (
    <section id="clubs" className="py-16 md:py-24 bg-muted/20 border-b">
      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              <Users className="h-3.5 w-3.5" />
              <span>Campus Organizations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Featured Student Clubs
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Find communities that share your passion. Connect with tech builders, artists, athletes, and leaders.
            </p>
          </div>

          {/* Explore Clubs CTA */}
          <Link href="/clubs">
            <Button variant="outline" className="shrink-0 h-11 px-5 border-2 hover:bg-primary hover:text-primary-foreground font-semibold transition-all gap-2">
              Explore Clubs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_CLUBS_DATA.map((club: FeaturedClubItem) => (
            <Card
              key={club.id}
              className="group flex flex-col justify-between border hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-hidden bg-card"
            >
              {/* Club Banner Header */}
              <div className="relative h-24 bg-gradient-to-r from-primary/20 via-indigo-500/20 to-teal-500/20 overflow-hidden">
                <img
                  src={club.bannerUrl}
                  alt={club.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-[10px] font-semibold bg-background/90 backdrop-blur shadow-sm">
                    {club.category}
                  </Badge>
                </div>
              </div>

              {/* Club Body */}
              <CardContent className="p-5 pt-0 relative flex-1 flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  {/* Avatar/Logo positioned overlapping the banner */}
                  <div className="-mt-8 flex justify-between items-end">
                    <div className="h-14 w-14 rounded-xl border-2 border-background bg-card shadow-md p-1 overflow-hidden shrink-0">
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border">
                      <Users className="h-3 w-3 text-primary" />
                      <span>{club.memberCount} members</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {club.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-3 leading-relaxed">
                      {club.tagline}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" /> {club.eventCount} events hosted
                  </span>
                  
                  <Link href={`/clubs/${club.id}`}>
                    <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-primary group-hover:bg-primary/10 gap-1">
                      View Club <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-2">
          <Link href="/clubs">
            <Button size="lg" variant="outline" className="px-8 font-semibold border-2 gap-2">
              Browse All 32+ Active Clubs <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
