import { Link } from "wouter";
import { LATEST_NEWS_DATA, LatestNewsItem } from "@/data/landing-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, Calendar, Clock, ArrowRight, ChevronRight } from "lucide-react";

export function LatestNews() {
  return (
    <section id="news" className="py-16 md:py-24 bg-muted/20 border-b">
      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Newspaper className="h-3.5 w-3.5" />
              <span>Campus Bulletins</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Latest Campus News & Notices
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Stay updated with academic announcements, club achievements, and official press releases.
            </p>
          </div>

          <Link href="/news">
            <Button variant="outline" className="shrink-0 h-11 px-5 border-2 hover:bg-primary hover:text-primary-foreground font-semibold transition-all gap-2">
              View All News <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LATEST_NEWS_DATA.map((item: LatestNewsItem) => (
            <Card
              key={item.id}
              className="group flex flex-col justify-between border hover:border-primary/50 transition-all duration-300 hover:shadow-xl overflow-hidden bg-card"
            >
              {/* News Thumbnail Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-background/95 backdrop-blur font-semibold text-xs shadow-sm">
                    {item.category}
                  </Badge>
                </div>
              </div>

              {/* News Body */}
              <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-primary" /> {item.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    By {item.author}
                  </span>
                  
                  <Link href={`/news/${item.id}`}>
                    <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold text-primary group-hover:bg-primary/10 gap-1">
                      Read More <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}
