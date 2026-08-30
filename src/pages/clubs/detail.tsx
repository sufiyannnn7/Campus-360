import { useState } from "react"
import { useGetClub, useGetMe } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Users, Calendar, ArrowLeft, ShieldCheck, Check, Edit3, Mail, Sparkles, Building2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FEATURED_CLUBS_DATA } from "@/data/landing-data"

export default function ClubDetail() {
  const { id } = useParams()
  const clubId = Number(id)
  const { toast } = useToast()
  const { data: user } = useGetMe()
  
  const { data: apiClub, isLoading } = useGetClub(clubId as any)
  
  const defaultClub = FEATURED_CLUBS_DATA.find((c) => c.id === clubId) || FEATURED_CLUBS_DATA[0]
  
  const [clubData, setClubData] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [memberCount, setMemberCount] = useState<number>(0)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  const activeClub = clubData || apiClub || defaultClub

  // Sync initial state
  if (!clubData && activeClub) {
    setClubData(activeClub)
    setMemberCount(activeClub.memberCount || 350)
  }

  // Edit form state
  const [editName, setEditName] = useState(activeClub?.name || "")
  const [editTagline, setEditTagline] = useState(activeClub?.tagline || activeClub?.description || "")
  const [editCategory, setEditCategory] = useState(activeClub?.category || "")

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false)
      setMemberCount(prev => prev - 1)
      toast({ title: "Unfollowed Club", description: `You have unfollowed ${activeClub.name}.` })
    } else {
      setIsFollowing(true)
      setMemberCount(prev => prev + 1)
      toast({ title: `Following ${activeClub.name}! 🎉`, description: `You will now receive notifications for all ${activeClub.name} events and recruitments.` })
    }
  }

  const handleSaveClubInfo = () => {
    setClubData((prev: any) => ({
      ...prev,
      name: editName,
      tagline: editTagline,
      description: editTagline,
      category: editCategory,
    }))
    setIsEditOpen(false)
    toast({ title: "Club Profile Updated!", description: "Changes have been saved successfully to your club page." })
  }

  if (isLoading && !activeClub) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-64 bg-muted rounded-2xl w-full" />
      </div>
    )
  }

  const isClubLeadOrAdmin = user?.role === "coordinator" || user?.role === "admin"

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header Link */}
      <div className="flex items-center justify-between">
        <Link href="/clubs">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Clubs
          </Button>
        </Link>
        
        {isClubLeadOrAdmin && (
          <Button
            size="sm"
            onClick={() => {
              setEditName(activeClub.name)
              setEditTagline(activeClub.tagline || activeClub.description)
              setEditCategory(activeClub.category)
              setIsEditOpen(true)
            }}
            className="h-8 gap-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Club Profile (Role Action)
          </Button>
        )}
      </div>

      {/* Main Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border bg-card shadow-sm">
        <div className="h-48 md:h-64 bg-muted relative">
          {activeClub.bannerUrl ? (
            <img src={activeClub.bannerUrl} alt={activeClub.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-teal-600 to-primary/80" />
          )}
          <div className="absolute top-3 right-3">
            <Badge className="bg-background/90 text-foreground backdrop-blur font-semibold">
              {activeClub.category}
            </Badge>
          </div>
        </div>

        <div className="px-6 md:px-10 pb-8 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 -mt-16 md:-mt-20 mb-6">
            <div className="w-32 h-32 rounded-2xl border-4 border-background bg-background shadow-lg overflow-hidden shrink-0">
              {activeClub.logoUrl ? (
                <img src={activeClub.logoUrl} alt={activeClub.name} className="w-full h-full object-contain p-1" />
              ) : (
                <div className="w-full h-full bg-primary/10 text-primary font-bold text-4xl flex items-center justify-center">
                  {(activeClub?.name || "C").substring(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setIsContactOpen(true)} className="gap-2 font-semibold">
                <Mail className="h-4 w-4" /> Contact
              </Button>

              <Button
                onClick={handleFollowToggle}
                variant={isFollowing ? "outline" : "default"}
                className={`gap-2 px-8 font-bold transition-all shadow-md ${
                  isFollowing ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""
                }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" /> Following
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" /> Follow
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-2">
                {activeClub.name}
                <ShieldCheck className="h-7 w-7 text-emerald-500" />
              </h1>
              <p className="text-muted-foreground mt-1 text-base leading-relaxed max-w-3xl">
                {activeClub.tagline || activeClub.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 text-sm font-medium pt-2 border-t">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-extrabold text-foreground">{memberCount}</span>
                  <span className="text-muted-foreground text-xs uppercase font-bold">Active Members</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-xl font-extrabold text-foreground">{activeClub.eventCount || 12}</span>
                  <span className="text-muted-foreground text-xs uppercase font-bold">Events Hosted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> About {activeClub.name}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {activeClub.description || activeClub.tagline || "NKOCET official student organization dedicated to technical excellence, hackathons, and skill development."}
            </p>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-2xs">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-lg text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <Sparkles className="h-5 w-5" /> Recruitment Status
              </h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {activeClub.name} is currently accepting new student applications for technical, design, and management core roles.
              </p>
              <Link href="/recruitments">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold text-xs h-9">
                  Apply for Club Roles →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Club Info Dialog (Club Lead / Admin feature) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-amber-500" /> Edit {activeClub.name} Details
            </DialogTitle>
            <DialogDescription>
              As a Club Coordinator/Admin, you can update your society info below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Club Name</label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Category</label>
              <Input value={editCategory} onChange={(e) => setEditCategory(e.target.value)} />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1">Tagline & Description</label>
              <Textarea rows={3} value={editTagline} onChange={(e) => setEditTagline(e.target.value)} />
            </div>
            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleSaveClubInfo} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Club Dialog */}
      <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Contact {activeClub.name}
            </DialogTitle>
            <DialogDescription>
              Reach out to the executive committee for event inquiries or partnerships.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-sm">
            <div className="p-3 bg-muted rounded-lg font-mono text-xs">
              📧 Email: {activeClub.name.toLowerCase().replace(/\s+/g, "")}@nkocet.ac.in
            </div>
            <div className="p-3 bg-muted rounded-lg font-mono text-xs">
              📍 Office: Main Academic Building, Room 204
            </div>
            <Button className="w-full mt-2" onClick={() => setIsContactOpen(false)}>Close Window</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
