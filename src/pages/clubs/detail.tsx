import { useGetClub } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, ArrowLeft, ShieldCheck, ExternalLink, Shield } from "lucide-react"

export default function ClubDetail() {
  const { id } = useParams()
  const clubId = Number(id)
  
  const { data: club, isLoading } = useGetClub(clubId, {
    query: { enabled: !!clubId } as any
  })

  if (isLoading) {
    return <div className="p-8 space-y-6 animate-pulse">
      <div className="h-64 bg-muted rounded-2xl w-full" />
    </div>
  }
  
  if (!club) return <div>Club not found</div>

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="mb-4">
        <Link href="/clubs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clubs
        </Link>
      </div>

      <div className="relative rounded-3xl overflow-hidden border bg-card shadow-sm">
         <div className="h-48 md:h-64 bg-muted relative">
            {club.bannerUrl ? (
               <img src={club.bannerUrl} alt="" className="w-full h-full object-cover" />
            ) : (
               <div className="w-full h-full bg-gradient-to-r from-teal-600 to-primary/80" />
            )}
         </div>
         <div className="px-6 md:px-10 pb-8 pt-0 relative">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6">
               <div className="w-32 h-32 rounded-2xl border-4 border-background bg-background shadow-lg overflow-hidden shrink-0">
                  {club.logoUrl ? (
                     <img src={club.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full bg-primary/10 text-primary font-bold text-4xl flex items-center justify-center">
                        {club.name.substring(0,2).toUpperCase()}
                     </div>
                  )}
               </div>
               <div className="flex items-center gap-3">
                 <Button variant="outline" className="gap-2">
                   <Shield className="h-4 w-4" /> Contact
                 </Button>
                 <Button className="gap-2 px-8">
                   <Users className="h-4 w-4" /> Follow
                 </Button>
               </div>
            </div>
            
            <div className="space-y-4">
               <div>
                 <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
                    {club.name}
                    {club.status === 'active' && <ShieldCheck className="h-6 w-6 text-emerald-500" />}
                 </h1>
                 <p className="text-muted-foreground mt-1 text-lg">{club.category}</p>
               </div>
               
               <div className="flex flex-wrap gap-6 text-sm font-medium pt-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Users className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="flex flex-col leading-tight"><span className="text-xl font-bold text-foreground">{club.memberCount}</span> <span className="text-muted-foreground text-xs uppercase">Members</span></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"><Calendar className="h-4 w-4 text-muted-foreground" /></div>
                    <div className="flex flex-col leading-tight"><span className="text-xl font-bold text-foreground">{club.eventsCount}</span> <span className="text-muted-foreground text-xs uppercase">Events</span></div>
                 </div>
               </div>
            </div>
         </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
         <div className="md:col-span-2 space-y-8">
            <section className="bg-card rounded-2xl p-6 border shadow-sm">
               <h2 className="text-xl font-bold mb-4">About</h2>
               <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                 {club.description || "No description provided."}
               </div>
            </section>
         </div>
         <div className="space-y-6">
            {club.recruitmentOpen && (
               <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-none">
                 <CardContent className="p-6">
                    <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2">
                       We are recruiting!
                    </h3>
                    <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80 mb-4">
                       Join our team and help build the future of this club.
                    </p>
                    <Link href={`/recruitments?club_id=${club.id}`}>
                       <Button variant="default" className="w-full bg-emerald-600 hover:bg-emerald-700">View Openings</Button>
                    </Link>
                 </CardContent>
               </Card>
            )}
            
            <Card>
               <CardContent className="p-6">
                  <h3 className="font-bold mb-4">Founded</h3>
                  <p className="text-muted-foreground">{club.foundedYear || 'Unknown'}</p>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
