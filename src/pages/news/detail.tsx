import { useGetNewsArticle } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { LATEST_NEWS_DATA } from "@/data/landing-data";

export default function NewsDetail() {
  const { id } = useParams();
  const articleId = Number(id) || 1;

  const { data: apiArticle, isLoading } = useGetNewsArticle(articleId, {
    query: { enabled: !!articleId },
  });

  const defaultArticle = LATEST_NEWS_DATA.find((a) => a.id === articleId) || LATEST_NEWS_DATA[0];
  const article: any = apiArticle || defaultArticle;

  if (isLoading && !article) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-3xl mx-auto">
        <div className="h-10 bg-muted rounded w-3/4" />
        <div className="h-64 bg-muted rounded-2xl w-full" />
      </div>
    );
  }

  const rawDate = article.publishedAt || article.date || new Date().toISOString();
  const dateObj = new Date(rawDate);
  const formattedDate = isNaN(dateObj.getTime())
    ? article.date || "Recent"
    : dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-in fade-in-50 duration-200">
      <div className="mb-6">
        <Link href="/news">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to News
          </Button>
        </Link>
      </div>

      <article className="space-y-8">
        <header className="space-y-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
            {article.category || "Announcement"}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm pt-4 border-t">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-4 w-4 text-primary" />
              {formattedDate}
            </div>
            {article.author && (
              <>
                <span>•</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="h-4 w-4 text-primary" />
                  {typeof article.author === "string" ? article.author : article.author?.name || "NKOCET Administration"}
                </div>
              </>
            )}
          </div>
        </header>

        {article.imageUrl && (
          <div className="w-full rounded-2xl overflow-hidden border shadow-sm aspect-video bg-muted">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
          {article.body || article.excerpt || article.content || "No content provided."}
        </div>
      </article>
    </div>
  );
}
