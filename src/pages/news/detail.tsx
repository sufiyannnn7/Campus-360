import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, User, ChevronLeft, ChevronRight, Trash2, Building2 } from "lucide-react";
import { useState, useEffect } from "react"
import { newsService } from "@/api/services/news.service";
import { NewsArticle } from "@/types/news";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function NewsDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [curr, list] = await Promise.all([
          newsService.getNewsById(id || "1"),
          newsService.listNews(),
        ]);
        if (isMounted) {
          setArticle(curr);
          setAllArticles(list);
        }
      } catch (err) {
        console.warn("Could not load article:", err);
        if (isMounted) setArticle(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [id]);

  const currentIndex = allArticles.findIndex(a => String(a.id) === String(id));
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex >= 0 && currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const isAdmin = user?.role === "admin" || user?.email?.toLowerCase().trim() === "sufiyannnn7@gmail.com" || user?.email?.toLowerCase().trim() === "admin@nkocet.ac.in";
  const canDelete = isAdmin || (user?.id && article?.createdBy === user.id) || (user?.name && article?.author?.includes(user.name));

  const handleDelete = async () => {
    if (!article) return;
    if (!window.confirm(`Permanently delete "${article.title}"?`)) return;

    try {
      await newsService.deleteNews(article.id);
      toast({
        title: "Article Deleted",
        description: `"${article.title}" has been deleted.`,
      });
      setLocation("/news");
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-3xl mx-auto">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="h-10 bg-muted rounded w-3/4" />
        <div className="h-64 bg-muted rounded-2xl w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="text-xl font-extrabold text-foreground">Article Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested circular or news report does not exist or has been removed.</p>
        <Link href="/news">
          <Button variant="outline" size="sm" className="gap-1.5 font-semibold">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to News Feed
          </Button>
        </Link>
      </div>
    );
  }

  const rawDate = article.publishedAt || article.date || new Date().toISOString();
  const dateObj = new Date(rawDate);
  const formattedDate = isNaN(dateObj.getTime())
    ? article.date || "Recent"
    : dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const authorName = typeof article.author === "string" ? article.author : "Campus 360 Administration";
  const authorRole = article.authorRole || (article.clubId ? "Club Coordinator" : "System Administration");

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in-50 duration-200">
      {/* Top Bar with Back and Delete */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/news">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to News
          </Button>
        </Link>

        {canDelete && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="h-8 gap-1.5 text-xs font-semibold"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Article
          </Button>
        )}
      </div>

      <article className="space-y-8">
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
              {article.category || "Announcement"}
            </span>
            {article.clubName && (
              <Badge variant="outline" className="text-xs gap-1 border-primary/30">
                <Building2 className="h-3 w-3 text-primary" /> {article.clubName}
              </Badge>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {article.title}
          </h1>

          {/* Author Profile Card */}
          <div className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11 border">
                <AvatarImage src={article.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"} alt={authorName} />
                <AvatarFallback>{authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                  {authorName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-bold">
                    {authorRole}
                  </Badge>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-primary" /> {formattedDate}
                  </span>
                </div>
              </div>
            </div>
            {article.readTime && (
              <span className="text-xs text-muted-foreground font-semibold hidden sm:inline">
                {article.readTime}
              </span>
            )}
          </div>
        </header>

        {article.imageUrl && (
          <div className="w-full rounded-2xl overflow-hidden border shadow-sm aspect-video bg-muted">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {article.content || article.body || article.summary || article.excerpt || "No content provided."}
        </div>

        {/* Previous and Next Navigation Buttons */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          {prevArticle ? (
            <Link href={`/news/${prevArticle.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-auto py-2.5 px-4 flex items-center gap-2 text-left justify-start">
                <ChevronLeft className="h-4 w-4 shrink-0" />
                <div className="truncate max-w-[200px]">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Previous Article</p>
                  <p className="text-xs font-bold text-foreground truncate">{prevArticle.title}</p>
                </div>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          {nextArticle ? (
            <Link href={`/news/${nextArticle.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-auto py-2.5 px-4 flex items-center gap-2 text-right justify-end ml-auto">
                <div className="truncate max-w-[200px] text-right">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Next Article</p>
                  <p className="text-xs font-bold text-foreground truncate">{nextArticle.title}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>
    </div>
  );
}
