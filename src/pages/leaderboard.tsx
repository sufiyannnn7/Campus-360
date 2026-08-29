import { useGetLeaderboard } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function Leaderboard() {
  const [scope, setScope] = useState<any>("overall")
  const { data, isLoading } = useGetLeaderboard({ scope })

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">Top active students across the campus.</p>
        </div>
        <div className="w-[200px]">
           <Select value={scope} onValueChange={setScope}>
              <SelectTrigger>
                <SelectValue placeholder="Scope" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall">Overall</SelectItem>
                <SelectItem value="club">Club Participation</SelectItem>
                <SelectItem value="category">Academic</SelectItem>
              </SelectContent>
            </Select>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 px-6 py-3 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
           <div className="col-span-2 text-center">Rank</div>
           <div className="col-span-6">Student</div>
           <div className="col-span-2 text-center">Events</div>
           <div className="col-span-2 text-right">Points</div>
        </div>
        
        {isLoading ? (
          <div className="divide-y">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-16 bg-muted/20 animate-pulse m-2 rounded" />
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {data?.map((entry: any, idx: number) => (
              <div key={entry.userId} className={cn(
                "grid grid-cols-12 items-center px-6 py-4 hover:bg-muted/30 transition-colors",
                idx < 3 ? "bg-primary/5" : ""
              )}>
                 <div className="col-span-2 flex justify-center">
                    {idx === 0 ? <Trophy className="h-6 w-6 text-amber-500" /> :
                     idx === 1 ? <Trophy className="h-6 w-6 text-slate-400" /> :
                     idx === 2 ? <Trophy className="h-6 w-6 text-amber-700" /> :
                     <span className="font-bold text-muted-foreground">{entry.rank}</span>}
                 </div>
                 <div className="col-span-6 flex items-center gap-3">
                    <Avatar className="h-10 w-10 border shadow-sm">
                       <AvatarImage src={entry.avatarUrl || ''} />
                       <AvatarFallback className="bg-primary/10 text-primary">{entry.name.substring(0,2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                       <div className="font-semibold">{entry.name}</div>
                       <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3" /> {entry.badgeCount || 0} Badges
                       </div>
                    </div>
                 </div>
                 <div className="col-span-2 text-center font-medium text-muted-foreground">
                    {entry.eventsAttended}
                 </div>
                 <div className="col-span-2 text-right font-bold text-primary text-lg">
                    {entry.totalPoints}
                 </div>
              </div>
            ))}
            
            {data?.entries?.length === 0 && (
               <div className="py-12 text-center text-muted-foreground">
                 No entries found for this scope.
               </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
