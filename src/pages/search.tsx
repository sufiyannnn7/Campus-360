import { useGlobalSearch } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SearchIcon, Ticket, Users, Newspaper } from "lucide-react"
import { Link, useSearch } from "wouter"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export default function Search() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 500)
  
  const { data, isLoading } = useGlobalSearch({ 
    q: debouncedQuery,
  }, { query: { enabled: debouncedQuery.length > 1 } as any })

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
      </div>

      <div>
        <Input 
          placeholder="Search events, clubs, news..." 
          icon={<SearchIcon className="h-5 w-5" />}
          className="h-14 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {isLoading && <div className="text-center p-8 text-muted-foreground">Searching...</div>}
      
      {!isLoading && debouncedQuery.length > 1 && data && (
        <div className="space-y-8">
          {/* Events */}
          {data.events && data.events.length > 0 && (
             <div className="space-y-4">
               <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                 <Ticket className="h-5 w-5 text-primary" /> Events
               </h2>
               <div className="grid gap-3">
                 {data.events.map(event => (
                   <Link key={event.id} href={`/events/${event.id}`}>
                     <Card className="hover:bg-muted/50 cursor-pointer transition-colors shadow-sm">
                       <CardContent className="p-4 flex justify-between items-center">
                         <div>
                           <h3 className="font-semibold">{event.title}</h3>
                           <p className="text-sm text-muted-foreground">{event.category} • {new Date(event.startDatetime).toLocaleDateString()}</p>
                         </div>
                       </CardContent>
                     </Card>
                   </Link>
                 ))}
               </div>
             </div>
          )}

          {/* Clubs */}
          {data.clubs && data.clubs.length > 0 && (
             <div className="space-y-4">
               <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                 <Users className="h-5 w-5 text-teal-600" /> Clubs
               </h2>
               <div className="grid gap-3">
                 {data.clubs.map(club => (
                   <Link key={club.id} href={`/clubs/${club.id}`}>
                     <Card className="hover:bg-muted/50 cursor-pointer transition-colors shadow-sm">
                       <CardContent className="p-4 flex justify-between items-center">
                         <div>
                           <h3 className="font-semibold">{club.name}</h3>
                           <p className="text-sm text-muted-foreground">{club.category}</p>
                         </div>
                       </CardContent>
                     </Card>
                   </Link>
                 ))}
               </div>
             </div>
          )}

          {/* News */}
          {data.news && data.news.length > 0 && (
             <div className="space-y-4">
               <h2 className="text-xl font-bold flex items-center gap-2 border-b pb-2">
                 <Newspaper className="h-5 w-5 text-amber-600" /> News
               </h2>
               <div className="grid gap-3">
                 {data.news.map(article => (
                   <Link key={article.id} href={`/news/${article.id}`}>
                     <Card className="hover:bg-muted/50 cursor-pointer transition-colors shadow-sm">
                       <CardContent className="p-4 flex justify-between items-center">
                         <div>
                           <h3 className="font-semibold">{article.title}</h3>
                           <p className="text-sm text-muted-foreground">{article.category}</p>
                         </div>
                       </CardContent>
                     </Card>
                   </Link>
                 ))}
               </div>
             </div>
          )}

          {(!data.events?.length && !data.clubs?.length && !data.news?.length) && (
             <div className="text-center p-12 text-muted-foreground border border-dashed rounded-xl">
               No results found for "{debouncedQuery}"
             </div>
          )}
        </div>
      )}
      
      {!isLoading && debouncedQuery.length <= 1 && (
         <div className="text-center p-12 text-muted-foreground border border-dashed rounded-xl">
            Type at least 2 characters to search.
         </div>
      )}
    </div>
  )
}
