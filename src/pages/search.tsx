import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon, Ticket, Users, Newspaper, Image as ImageIcon, ArrowRight, ChevronRight, Sparkles } from "lucide-react"
import { Link, useSearch } from "wouter"
import { useDebounce } from "@/hooks/use-debounce"
import { UPCOMING_EVENTS_DATA, FEATURED_CLUBS_DATA, LATEST_NEWS_DATA, GALLERY_PHOTOS_DATA } from "@/data/landing-data"

export default function SearchPage() {
  const searchString = useSearch()
  const searchParams = new URLSearchParams(searchString)
  const initialQuery = searchParams.get("q") || ""
  
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 200)

  const q = debouncedQuery.toLowerCase().trim()

  // Comprehensive Client-Side Search Engine across all NKOCET datasets
  const matchedEvents = q.length > 0
    ? UPCOMING_EVENTS_DATA.filter((evt) =>
        evt.title.toLowerCase().includes(q) ||
        evt.category.toLowerCase().includes(q) ||
        evt.organizer.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q)
      )
    : []

  const matchedClubs = q.length > 0
    ? FEATURED_CLUBS_DATA.filter((club) =>
        club.name.toLowerCase().includes(q) ||
        club.category.toLowerCase().includes(q) ||
        club.tagline.toLowerCase().includes(q)
      )
    : []

  const matchedNews = q.length > 0
    ? LATEST_NEWS_DATA.filter((news) =>
        news.title.toLowerCase().includes(q) ||
        news.category.toLowerCase().includes(q) ||
        news.excerpt.toLowerCase().includes(q) ||
        news.author.toLowerCase().includes(q)
      )
    : []

  const totalResults = matchedEvents.length + matchedClubs.length + matchedNews.length

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in-50 duration-300">
      
      {/* Main Single Search Input Bar */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
          <SearchIcon className="h-7 w-7 text-primary" /> Campus 360 Search
        </h1>
        <p className="text-xs text-muted-foreground font-medium">
          Instant search across NKOCET events, hackathons, student clubs, pitch competitions & news.
        </p>
      </div>

      <div className="relative">
        <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search GDG, E-Cell, CSESA, Eureka Pitching, Hackathons..." 
          className="h-14 pl-12 pr-4 text-base font-bold rounded-2xl bg-card border-primary/30 shadow-md focus-visible:ring-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-4 text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Feed */}
      {debouncedQuery.length > 0 ? (
        <div className="space-y-8">
          
          {totalResults > 0 ? (
            <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
              Found {totalResults} result{totalResults > 1 ? "s" : ""} for "{debouncedQuery}"
            </div>
          ) : null}

          {/* 1. Clubs Results */}
          {matchedClubs.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-black flex items-center gap-2 text-foreground border-b pb-2">
                <Users className="h-5 w-5 text-teal-600" /> Student Clubs ({matchedClubs.length})
              </h2>
              <div className="grid gap-3">
                {matchedClubs.map((club) => (
                  <Link key={club.id} href={`/clubs/${club.id}`}>
                    <Card className="hover:border-primary/60 hover:shadow-md cursor-pointer transition-all bg-card shadow-2xs">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary font-black flex items-center justify-center shrink-0">
                            {club.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-extrabold text-base text-foreground">{club.name}</h3>
                              <Badge variant="secondary" className="text-[10px] font-bold">{club.category}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{club.tagline}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 2. Events Results */}
          {matchedEvents.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-black flex items-center gap-2 text-foreground border-b pb-2">
                <Ticket className="h-5 w-5 text-primary" /> Campus Events ({matchedEvents.length})
              </h2>
              <div className="grid gap-3">
                {matchedEvents.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="hover:border-primary/60 hover:shadow-md cursor-pointer transition-all bg-card shadow-2xs">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {event.bannerUrl && (
                            <img src={event.bannerUrl} className="h-12 w-16 rounded-lg object-cover shrink-0 border" alt="" />
                          )}
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-[10px] font-extrabold px-2 py-0.2 rounded bg-primary/10 text-primary">
                                {event.category}
                              </span>
                              <span className="text-xs text-muted-foreground">📅 {event.date}</span>
                            </div>
                            <h3 className="font-extrabold text-base text-foreground">{event.title}</h3>
                            <p className="text-xs text-muted-foreground">📍 {event.venue}</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* 3. News Results */}
          {matchedNews.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-black flex items-center gap-2 text-foreground border-b pb-2">
                <Newspaper className="h-5 w-5 text-amber-600" /> News & Announcements ({matchedNews.length})
              </h2>
              <div className="grid gap-3">
                {matchedNews.map((article) => (
                  <Link key={article.id} href={`/news/${article.id}`}>
                    <Card className="hover:border-primary/60 hover:shadow-md cursor-pointer transition-all bg-card shadow-2xs">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[10px]">{article.category}</Badge>
                            <span className="text-xs text-muted-foreground">{article.date}</span>
                          </div>
                          <h3 className="font-extrabold text-base text-foreground">{article.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{article.excerpt}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Zero Results State */}
          {totalResults === 0 && (
            <div className="text-center py-12 px-4 border-2 border-dashed rounded-3xl space-y-3 bg-muted/20">
              <SearchIcon className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <h3 className="text-lg font-extrabold text-foreground">No results found for "{debouncedQuery}"</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try searching for keywords like <strong className="text-primary cursor-pointer" onClick={() => setQuery("gdg")}>gdg</strong>, <strong className="text-primary cursor-pointer" onClick={() => setQuery("eureka")}>eureka</strong>, <strong className="text-primary cursor-pointer" onClick={() => setQuery("csesa")}>csesa</strong>, or <strong className="text-primary cursor-pointer" onClick={() => setQuery("e-cell")}>e-cell</strong>.
              </p>
            </div>
          )}

        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Popular Searches:</div>
          <div className="flex flex-wrap gap-2">
            {["GDG NKOCET", "Eureka Pitching", "CSESA Hackathon", "E-Cell NKOCET", "Future Tech", "English Club", "Rotaract", "Team Avengineers"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                onClick={() => setQuery(tag)}
                className="rounded-full text-xs font-bold gap-1.5 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
              >
                <Sparkles className="h-3 w-3 text-amber-500" /> {tag}
              </Button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
