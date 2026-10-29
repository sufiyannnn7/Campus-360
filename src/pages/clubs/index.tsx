import { useListClubs } from "@workspace/api-client-react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/scroll-reveal"
import { Search, Users, ArrowLeft, Building2, ChevronDown, Plus } from "lucide-react"
import { Link } from "wouter"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FEATURED_CLUBS_DATA } from "@/data/landing-data"
import { clubsService } from "@/api/services/clubs.service"
import { toast } from "sonner"

export default function Clubs() {
  const [search, setSearch] = useState("")
  const [limit, setLimit] = useState<number>(6)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newClubName, setNewClubName] = useState("")
  const [newClubCategory, setNewClubCategory] = useState("Technical")
  const [newClubTagline, setNewClubTagline] = useState("")
  const [newClubAdvisor, setNewClubAdvisor] = useState("")
  const [newClubDesc, setNewClubDesc] = useState("")
  const [newClubBanner, setNewClubBanner] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdClubs, setCreatedClubs] = useState<any[]>([])
  
  const { data, isLoading } = useListClubs({
    q: search || undefined
  })

  const rawClubs = Array.isArray(data) ? data : ((data as any)?.clubs || FEATURED_CLUBS_DATA)
  const mergedClubs = [...createdClubs, ...rawClubs]
  const seenNames = new Set<string>()
  const uniqueClubs = mergedClubs.filter((c: any) => {
    const key = (c?.name || "").toLowerCase().trim()
    if (!key || seenNames.has(key)) return false
    seenNames.add(key)
    return true
  })

  const fullClubsList = uniqueClubs.filter((club: any) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (club?.name || "").toLowerCase().includes(q) ||
      (club?.category || "").toLowerCase().includes(q) ||
      (club?.tagline || "").toLowerCase().includes(q)
    )
  })

  const visibleClubs = fullClubsList.slice(0, limit)

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClubName.trim()) {
      toast.error("Club name is required")
      return
    }

    setIsSubmitting(true)
    try {
      const created = await clubsService.createClub({
        name: newClubName.trim(),
        category: newClubCategory,
        tagline: newClubTagline.trim() || `${newClubName.trim()} at NKOCET`,
        description: newClubDesc.trim() || "Active student organization driving campus engagement.",
        facultyAdvisor: newClubAdvisor.trim() || undefined,
        bannerUrl: newClubBanner.trim() || undefined,
      })

      setCreatedClubs((prev) => [created, ...prev])
      setIsCreateOpen(false)
      setNewClubName("")
      setNewClubTagline("")
      setNewClubAdvisor("")
      setNewClubDesc("")
      setNewClubBanner("")
      toast.success(`Club "${created.name}" created and added to campus directory!`)
    } catch (err: any) {
      toast.error(err?.message || "Failed to create club")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      
      {/* Compact Header with ScrollReveal */}
      <ScrollReveal direction="down" duration={0.4}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" size="sm" className="h-7 px-2.5 text-xs font-semibold gap-1 hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <ArrowLeft className="h-3 w-3" /> Home
              </Button>
            </Link>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2 text-foreground">
              <Users className="h-5 w-5 text-primary" /> NKOCET Student Clubs & Societies
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="px-2.5 py-0.5 font-bold text-xs bg-primary/10 text-primary border border-primary/20">
              Showing {visibleClubs.length} of {fullClubsList.length} Clubs
            </Badge>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-7 px-3 text-xs font-bold gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs cursor-pointer">
                  <Plus className="h-3.5 w-3.5" /> Create New Club
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-black flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" /> Create New Campus Club
                  </DialogTitle>
                  <DialogDescription className="text-xs">
                    Charter a new student organization, technical society, or cultural committee at NKOCET.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreateClub} className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Club Name *</Label>
                    <Input
                      placeholder="e.g. AI & Data Science Society"
                      value={newClubName}
                      onChange={(e) => setNewClubName(e.target.value)}
                      className="text-xs h-9 bg-background"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold">Category *</Label>
                      <select
                        value={newClubCategory}
                        onChange={(e) => setNewClubCategory(e.target.value)}
                        className="w-full text-xs rounded-md border border-input bg-background px-3 h-9 focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                        <option value="Innovation">Innovation & E-Cell</option>
                        <option value="Social">Social & Community</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold">Faculty Advisor</Label>
                      <Input
                        placeholder="e.g. Dr. A. B. Joshi"
                        value={newClubAdvisor}
                        onChange={(e) => setNewClubAdvisor(e.target.value)}
                        className="text-xs h-9 bg-background"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Tagline</Label>
                    <Input
                      placeholder="e.g. Advancing AI innovation & competitive robotics"
                      value={newClubTagline}
                      onChange={(e) => setNewClubTagline(e.target.value)}
                      className="text-xs h-9 bg-background"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Club Purpose & Mission</Label>
                    <Textarea
                      placeholder="Brief overview of club activities, workshops, and objectives..."
                      value={newClubDesc}
                      onChange={(e) => setNewClubDesc(e.target.value)}
                      className="text-xs min-h-[70px] bg-background resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Banner Image URL (optional)</Label>
                    <Input
                      placeholder="https://images.unsplash.com/..."
                      value={newClubBanner}
                      onChange={(e) => setNewClubBanner(e.target.value)}
                      className="text-xs h-9 bg-background"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreateOpen(false)}
                      className="h-8 text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1.5"
                    >
                      {isSubmitting ? "Chartering Club..." : "Charter Club"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </ScrollReveal>

      {/* Search Bar */}
      <ScrollReveal direction="up" delay={0.05} duration={0.4}>
        <div className="flex items-center gap-2 max-w-md">
          <Input 
            placeholder="Search clubs by name, category or team..." 
            className="h-9 text-xs bg-background font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[4/3] bg-muted rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : fullClubsList.length === 0 ? (
        <div className="col-span-full py-12 text-center border rounded-xl border-dashed">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-sm font-bold">No clubs found</h3>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <StaggerContainer
              key={search}
              staggerDelay={0.07}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5"
            >
              {visibleClubs.map((club: any) => (
                <StaggerItem key={club.id} className="h-full">
                  <Link href={`/clubs/${club.id}`}>
                    <motion.div
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <Card className="hover:border-primary/60 transition-all border bg-card shadow-2xs hover:shadow-xl cursor-pointer overflow-hidden group flex flex-col justify-between h-full">
                        <div>
                          {/* Aspect Ratio Banner Image */}
                          <div className="aspect-[4/3] sm:aspect-[16/10] bg-muted relative overflow-hidden">
                            {club.bannerUrl ? (
                              <img src={club.bannerUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108" alt="" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-primary/20 to-teal-500/20" />
                            )}
                            <div className="absolute top-2 right-2">
                              <Badge variant="secondary" className="text-[10px] font-bold bg-background/90 backdrop-blur shadow-2xs">
                                {club.category}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-3 pt-0">
                            <div className="flex items-start gap-2.5 -mt-5">
                              <Avatar className="h-10 w-10 border-2 border-background shadow-md bg-card shrink-0">
                                <AvatarImage src={club.logoUrl || ''} />
                                <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
                                  {(club?.name || 'C').charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="mt-5 space-y-0.5 overflow-hidden">
                                <h3 className="font-extrabold text-sm leading-tight group-hover:text-primary transition-colors truncate">{club.name}</h3>
                              </div>
                            </div>
                            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 font-medium leading-relaxed">
                              {club.tagline || club.description}
                            </p>
                          </CardContent>
                        </div>

                        <div className="px-3 py-2 border-t flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1 font-semibold text-foreground">
                            <Users className="h-3 w-3 text-primary" /> {club.memberCount || 0} Members
                          </span>
                          <span className="text-primary font-bold group-hover:underline group-hover:translate-x-0.5 transition-transform">
                            View Club →
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatePresence>

          {/* Load More Control */}
          {fullClubsList.length > visibleClubs.length && (
            <ScrollReveal direction="up" delay={0.1} className="pt-2 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLimit((prev) => prev + 6)}
                className="h-8 px-4 text-xs font-bold gap-1.5 rounded-full border-primary/30 text-primary hover:bg-primary hover:text-white transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Load More Clubs ({fullClubsList.length - visibleClubs.length} remaining)</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </ScrollReveal>
          )}
        </>
      )}
    </div>
  )
}

