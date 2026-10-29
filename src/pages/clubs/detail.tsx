import { useState, useEffect } from "react"
import { useGetClub, useGetMe } from "@workspace/api-client-react"
import { useParams, Link } from "wouter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Users, Calendar, ArrowLeft, ShieldCheck, Check, Edit3, Mail, Sparkles, Building2, Layers, Award, Image as ImageIcon, HelpCircle, MapPin, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { FEATURED_CLUBS_DATA } from "@/data/landing-data"
import { coordinatorService } from "@/api/services/coordinator.service"
import { ClubTeamRosterItem, ClubAchievementItem, ClubGalleryMediaItem, ClubFaqItem } from "@/types/coordinator"

export default function ClubDetail() {
  const { id } = useParams()
  const clubId = Number(id) || 1
  const { toast } = useToast()
  const { data: user } = useGetMe()
  
  const { data: apiClub, isLoading } = useGetClub(clubId as any)
  
  const defaultClub = FEATURED_CLUBS_DATA.find((c) => c.id === clubId) || FEATURED_CLUBS_DATA[0]
  
  const [clubData, setClubData] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [memberCount, setMemberCount] = useState<number>(350)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isContactOpen, setIsContactOpen] = useState(false)

  // Dynamic coordinator data states
  const [teamMembers, setTeamMembers] = useState<ClubTeamRosterItem[]>([])
  const [achievements, setAchievements] = useState<ClubAchievementItem[]>([])
  const [gallery, setGallery] = useState<ClubGalleryMediaItem[]>([])
  const [faqs, setFaqs] = useState<ClubFaqItem[]>([])

  const activeClub = clubData || apiClub || defaultClub

  // Sync initial state safely in useEffect
  useEffect(() => {
    if (activeClub) {
      setMemberCount(activeClub.memberCount || 350)
      setEditName(activeClub.name || "")
      setEditTagline(activeClub.tagline || activeClub.description || "")
      setEditCategory(activeClub.category || "")

      // Load dynamic published sections
      Promise.all([
        coordinatorService.getClubTeam(clubId).catch(() => []),
        coordinatorService.getAchievements(clubId).catch(() => []),
        coordinatorService.getGallery(clubId).catch(() => []),
        coordinatorService.getFaqs(clubId).catch(() => []),
      ]).then(([teamData, achData, galData, faqData]) => {
        setTeamMembers(teamData.filter(t => t.isPublic))
        setAchievements(achData.filter(a => a.isPublished))
        setGallery(galData.filter(g => g.isPublished))
        setFaqs(faqData.filter(f => f.isPublished))
      })
    }
  }, [clubId, apiClub])

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
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="h-8 gap-1.5 text-xs font-bold bg-primary text-primary-foreground shadow-sm">
              <Link href="/coordinator/dashboard">
                <Layers className="h-3.5 w-3.5" /> Coordinator Hub
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditName(activeClub.name)
                setEditTagline(activeClub.tagline || activeClub.description)
                setEditCategory(activeClub.category)
                setIsEditOpen(true)
              }}
              className="h-8 gap-1.5 text-xs font-bold shadow-sm"
            >
              <Edit3 className="h-3.5 w-3.5" /> Quick Edit
            </Button>
          </div>
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
          {/* About Section */}
          <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> About {activeClub.name}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {activeClub.description || activeClub.tagline || "NKOCET official student organization dedicated to technical excellence, hackathons, and skill development."}
            </p>
          </section>

          {/* Mission & Vision Section */}
          {(activeClub.mission || activeClub.vision) && (
            <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Mission & Vision
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {activeClub.mission && (
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Our Mission</span>
                    <p className="text-muted-foreground leading-relaxed">{activeClub.mission}</p>
                  </div>
                )}
                {activeClub.vision && (
                  <div className="p-4 rounded-xl border bg-muted/20 space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Our Vision</span>
                    <p className="text-muted-foreground leading-relaxed">{activeClub.vision}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Objectives */}
          {activeClub.objectives && activeClub.objectives.length > 0 && (
            <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-3">
              <h2 className="text-lg font-bold">Key Objectives & Initiatives</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                {activeClub.objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 p-2.5 rounded-xl border bg-muted/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Leadership Team Section */}
          {teamMembers.length > 0 && (
            <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" /> Leadership & Core Team
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {teamMembers.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl border bg-muted/20 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                        {m.displayName.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-bold text-xs truncate">{m.displayName}</div>
                        <div className="text-[11px] text-primary font-semibold truncate">{m.clubRole}</div>
                      </div>
                    </div>
                    {m.bio && <p className="text-[11px] text-muted-foreground line-clamp-2">{m.bio}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements Section */}
          {achievements.length > 0 && (
            <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Club Achievements & Recognition
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-2xl border bg-muted/20 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {ach.organization || "Recognition"}
                      </Badge>
                      {ach.awardDate && (
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(ach.awardDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-xs text-foreground">{ach.title}</div>
                    {ach.description && (
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{ach.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery Media */}
          {gallery.length > 0 && (
            <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" /> Media & Moments Gallery
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((img) => (
                  <div key={img.id} className="rounded-xl overflow-hidden border bg-muted aspect-video relative group">
                    <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                      <span className="text-[10px] text-white font-bold truncate">{img.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs Accordion */}
          {faqs.length > 0 && (
            <section className="bg-card rounded-2xl p-6 border shadow-2xs space-y-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {faqs.map((f) => (
                  <div key={f.id} className="p-3 rounded-xl border bg-muted/20 space-y-1">
                    <div className="font-bold text-xs text-foreground">{f.question}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Dynamic Recruitment Card */}
          <Card
            className={
              activeClub.recruitmentStatus === "open"
                ? "border-emerald-500/30 bg-emerald-500/5 shadow-2xs"
                : activeClub.recruitmentStatus === "paused"
                ? "border-amber-500/30 bg-amber-500/5 shadow-2xs"
                : "border bg-card shadow-2xs"
            }
          >
            <CardContent className="p-6 space-y-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Recruitment Status
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {activeClub.recruitmentStatus === "open"
                  ? `${activeClub.name} is currently accepting student applications for technical, design, and management core roles.`
                  : activeClub.recruitmentStatus === "paused"
                  ? "Recruitment is currently paused while applications are being reviewed."
                  : "Recruitment is currently closed. Follow the club to get notified when new positions open."}
              </p>
              {activeClub.recruitmentStatus === "open" ? (
                <Link href="/recruitments">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold text-xs h-9 shadow-sm">
                    Apply for Open Roles →
                  </Button>
                </Link>
              ) : (
                <Button disabled variant="outline" className="w-full text-xs h-9 font-medium">
                  Recruitment Closed
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Meeting Schedule & Physical Venue */}
          <Card className="border shadow-2xs">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Meeting Schedule
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-semibold">{activeClub.meetingFrequency || "Weekly"}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b">
                  <span className="text-muted-foreground">Day & Time</span>
                  <span className="font-semibold">{activeClub.meetingDayTime || "Saturdays, 3:30 PM"}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-semibold">{activeClub.meetingVenue || "Computer Lab A"}</span>
                </div>
                {activeClub.campusLocation && (
                  <div className="flex items-center justify-between py-1">
                    <span className="text-muted-foreground">Campus Block</span>
                    <span className="font-semibold">{activeClub.campusLocation}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Faculty Advisor & Official Contact */}
          <Card className="border shadow-2xs">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Official Information
              </h3>
              <div className="space-y-2 text-xs">
                {activeClub.facultyAdvisor && (
                  <div className="py-1 border-b space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Faculty Advisor</span>
                    <div className="font-semibold text-foreground">{activeClub.facultyAdvisor}</div>
                  </div>
                )}
                {activeClub.contactEmail && (
                  <div className="py-1 space-y-0.5">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Club Email</span>
                    <div className="font-mono text-primary font-medium">{activeClub.contactEmail}</div>
                  </div>
                )}
              </div>
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
