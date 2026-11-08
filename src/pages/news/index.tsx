import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/scroll-reveal"
import { Search, Newspaper, Calendar, ArrowLeft, Trash2, ShieldCheck, User } from "lucide-react"
import { Link } from "wouter"
import { useState, useEffect } from "react"
import { newsService } from "@/api/services/news.service"
import { NewsArticle } from "@/types/news"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function News() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadArticles = async () => {
    setIsLoading(true)
    try {
      const data = await newsService.listNews()
      setArticles(data)
    } catch (err) {
      console.warn("Failed to load news articles:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const isAdmin = user?.role === "admin" || user?.email?.toLowerCase().trim() === "sufiyannnn7@gmail.com" || user?.email?.toLowerCase().trim() === "admin@nkocet.ac.in"

  const handleDelete = async (e: React.MouseEvent, article: NewsArticle) => {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm(`Delete article "${article.title}"? This cannot be undone.`)) return

    try {
      await newsService.deleteNews(article.id)
      setArticles(prev => prev.filter(a => a.id !== article.id))
      toast({
        title: "Article Deleted",
        description: `"${article.title}" was removed.`,
      })
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" })
    }
  }

  const newsList = articles.filter((article: any) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (article?.title || "").toLowerCase().includes(q) ||
      (article?.category || "").toLowerCase().includes(q) ||
      (article?.summary || article?.content || article?.excerpt || "").toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ScrollReveal direction="down" duration={0.4}>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Button>
          </Link>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.05} duration={0.4}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Newspaper className="h-8 w-8 text-primary" /> Campus News & Bulletins
            </h1>
            <p className="text-muted-foreground mt-1">Official NKOCET announcements, pitch competition reports, and student achievements.</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1} duration={0.4}>
        <div className="max-w-md">
          <Input 
            placeholder="Search news articles or circulars..." 
            icon={<Search className="h-4 w-4" />}
            className="h-10 text-xs bg-background font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </ScrollReveal>

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
        <AnimatePresence mode="wait">
          <StaggerContainer key={search} staggerDelay={0.08} className="grid gap-6">
            {newsList.map((article: any) => {
              const canDelete = isAdmin || (user?.id && article.createdBy === user.id) || (user?.name && article.author?.includes(user.name))
              return (
                <StaggerItem key={article.id}>
                  <Link href={`/news/${article.id}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="hover:border-primary/60 hover:shadow-xl transition-all border bg-card shadow-sm cursor-pointer group flex flex-col sm:flex-row overflow-hidden">
                        {article.imageUrl && (
                          <div className="sm:w-72 h-48 sm:h-auto bg-muted shrink-0 relative overflow-hidden">
                            <img src={article.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" alt="" />
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
                              {article.summary || article.excerpt || article.content || article.body?.replace(/<[^>]*>?/gm, '')}
                            </p>
                          </div>
                          <div className="mt-4 pt-3 border-t text-sm font-bold text-primary flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground text-xs font-semibold flex items-center gap-1">
                                <User className="h-3.5 w-3.5 text-primary" />
                                By {article.author || "NKOCET Administration"}
                              </span>
                              {article.authorRole && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  {article.authorRole}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDelete(e, article)}
                                  className="text-xs text-destructive hover:bg-destructive/10 p-1 rounded-md flex items-center gap-1 font-semibold cursor-pointer"
                                  title="Delete Article"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete
                                </button>
                              )}
                              <span className="group-hover:translate-x-1 transition-transform">Read Full Report →</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        </AnimatePresence>
      )}
    </div>
  )
}

