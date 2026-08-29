import { useListNews } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Newspaper, Calendar } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { formatDateTime } from "@/lib/utils"

import { ArrowLeft } from "lucide-react"

export default function News() {
  const [search, setSearch] = useState("")
  
  const { data, isLoading } = useListNews({
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
          <h1 className="text-3xl font-bold tracking-tight">Campus News & Bulletins</h1>
          <p className="text-muted-foreground">Announcements, achievements, and circulars.</p>
        </div>
      </div>

      <div className="max-w-md">
        <Input 
          placeholder="Search news..." 
          icon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {data?.map((article: any) => (
            <Link key={article.id} href={`/news/${article.id}`}>
              <Card className="hover-elevate transition-all border-border/50 shadow-sm cursor-pointer group flex flex-col sm:flex-row overflow-hidden">
                {article.imageUrl && (
                  <div className="sm:w-64 h-48 sm:h-auto bg-muted shrink-0">
                    <img src={article.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="" />
                  </div>
                )}
                <CardContent className="p-6 flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center">
                       <Calendar className="mr-1 h-3 w-3" />
                       {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 mb-4">
                    {article.body?.replace(/<[^>]*>?/gm, '')}
                  </p>
                  <div className="mt-auto text-sm font-medium text-primary">Read article →</div>
                </CardContent>
              </Card>
            </Link>
          ))}
          
          {data?.length === 0 && (
             <div className="py-20 text-center border rounded-xl border-dashed">
                <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold">No news found</h3>
             </div>
          )}
        </div>
      )}
    </div>
  )
}
