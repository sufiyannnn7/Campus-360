import { useListNews } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Newspaper, Calendar, ArrowLeft } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { LATEST_NEWS_DATA } from "@/data/landing-data"

export default function News() {
  const [search, setSearch] = useState("")
  
  const { data, isLoading } = useListNews({
    q: search || undefined
  })

  const newsList = (Array.isArray(data) ? data : (data?.news || LATEST_NEWS_DATA)).filter((article: any) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (article?.title || "").toLowerCase().includes(q) ||
      (article?.category || "").toLowerCase().includes(q) ||
      (article?.excerpt || article?.body || "").toLowerCase().includes(q)
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
            <Newspaper className="h-8 w-8 text-primary" /> Campus News & Bulletins
          </h1>
          <p className="text-muted-foreground mt-1">Official NKOCET announcements, pitch competition reports, and student achievements.</p>
        </div>
      </div>

      <div className="max-w-md">
        <Input 
          placeholder="Search news articles or circulars..." 
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-44 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : newsList.length === 0 ? (
        <div className="py-20 text-center border rounded-xl border-dashed">
          <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No news articles found</h3>
          <p className="text-muted-foreground mt-1">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {newsList.map((article: any) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <Card className="hover-elevate transition-all border-border/50 shadow-sm cursor-pointer group flex flex-col sm:flex-row overflow-hidden">
                {article.imageUrl && (
                  <div className="sm:w-72 h-48 sm:h-auto bg-muted shrink-0 relative overflow-hidden">
                    <img src={article.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="" />
                  </div>
                )}
                <CardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-primary/10 text-primary uppercase tracking-wider">
                        {article.category || "Announcement"}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                         <Calendar className="h-3.5 w-3.5 text-primary" />
                         {article.date || (article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "Recent")}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-xl mb-2 group-hover:text-primary transition-colors leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {article.excerpt || article.body?.replace(/<[^>]*>?/gm, '')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t text-sm font-bold text-primary flex items-center justify-between">
                    <span>By {article.author || "NKOCET Administration"}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Read Full Report →</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
