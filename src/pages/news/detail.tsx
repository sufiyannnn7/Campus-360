import { useGetNewsArticle } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"

export default function NewsDetail() {
  const { id } = useParams()
  const articleId = Number(id)
  
  const { data: article, isLoading } = useGetNewsArticle(articleId, {
    query: { enabled: !!articleId } as any
  })

  if (isLoading) {
    return <div className="p-8 space-y-6 animate-pulse max-w-3xl mx-auto">
      <div className="h-10 bg-muted rounded w-3/4" />
      <div className="h-64 bg-muted rounded-2xl w-full" />
    </div>
  }
  
  if (!article) return <div className="text-center p-8">Article not found</div>

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="mb-6">
        <Link href="/news" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to News
        </Link>
      </div>

      <article className="space-y-8">
         <header className="space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wider">
               {article.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
               {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm pt-4">
               <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
               </div>
               {article.author && (
                  <>
                     <span>•</span>
                     <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        {article.author.name}
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

         <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/90 whitespace-pre-wrap">
            {article.body || "No content provided."}
         </div>
      </article>
    </div>
  )
}
