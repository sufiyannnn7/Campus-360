import { useState } from "react"
import { useListRecruitments, useGetMe } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Calendar, Users, Briefcase, ArrowRight, CheckCircle2, Clock, Upload, FileText, UserCheck, ChevronRight, Layers } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type ViewTab = "board" | "kanban" | "volunteers"
type AppStage = "applied" | "under_review" | "shortlisted" | "interview" | "accepted" | "rejected"

interface SampleApplication {
  id: number
  applicantName: string
  roleTitle: string
  clubName: string
  stage: AppStage
  appliedDate: string
  portfolioUrl?: string
}

const INITIAL_APPLICATIONS: SampleApplication[] = [
  { id: 101, applicantName: "Aisha Sharma", roleTitle: "Frontend Developer Lead", clubName: "Coding Club", stage: "applied", appliedDate: "2026-08-01" },
  { id: 102, applicantName: "Rohan Verma", roleTitle: "UI/UX Designer", clubName: "Design Society", stage: "under_review", appliedDate: "2026-08-02", portfolioUrl: "https://dribbble.com/rohan" },
  { id: 103, applicantName: "Priya Patel", roleTitle: "Event Lead", clubName: "Robotics Club", stage: "shortlisted", appliedDate: "2026-07-28" },
  { id: 104, applicantName: "Karan Singh", roleTitle: "Sponsorship Manager", clubName: "E-Cell", stage: "interview", appliedDate: "2026-07-25" },
  { id: 105, applicantName: "Neha Gupta", roleTitle: "Social Media Lead", clubName: "Cultural Club", stage: "accepted", appliedDate: "2026-07-20" }
]

export default function Recruitments() {
  const { data: me } = useGetMe()
  const { toast } = useToast()
  const { data, isLoading } = useListRecruitments({})

  const [activeTab, setActiveTab] = useState<ViewTab>("board")
  const [selectedRecruitment, setSelectedRecruitment] = useState<any | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [portfolioUrl, setPortfolioUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Kanban Board state for Club Coordinators & Admins
  const [applications, setApplications] = useState<SampleApplication[]>(INITIAL_APPLICATIONS)

  const handleApply = async () => {
    if (!selectedRecruitment) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/recruitments/${selectedRecruitment.id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter, portfolioUrl })
      })

      if (!res.ok) throw new Error("Application failed")

      toast({
        title: "Application Submitted!",
        description: `Your application for ${selectedRecruitment.title} has been received.`
      })
      setSelectedRecruitment(null)
      setCoverLetter("")
      setPortfolioUrl("")
    } catch (err) {
      toast({
        title: "Submission Error",
        description: "Could not submit application. Please check requirements.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleStageMove = (appId: number, newStage: AppStage) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, stage: newStage } : app))
    )
    toast({
      title: "Applicant Status Updated",
      description: `Moved candidate to ${newStage.replace("_", " ").toUpperCase()}`
    })
  }

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruitment & Volunteer Hub</h1>
          <p className="text-muted-foreground">Find open club positions, manage applications, and coordinate volunteer shifts.</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center border rounded-lg p-1 bg-muted/40 text-xs font-medium self-start">
          <button
            onClick={() => setActiveTab("board")}
            className={cn(
              "px-3.5 py-1.5 rounded-md capitalize transition-all",
              activeTab === "board" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Open Positions
          </button>
          <button
            onClick={() => setActiveTab("kanban")}
            className={cn(
              "px-3.5 py-1.5 rounded-md capitalize transition-all flex items-center gap-1.5",
              activeTab === "kanban" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Layers className="h-3.5 w-3.5" /> Coordinator Pipeline
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === "board" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : data?.length === 0 ? (
            <div className="py-20 text-center border rounded-xl border-dashed">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No open recruitments</h3>
              <p className="text-muted-foreground mt-1">Check back later when new positions are posted.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {data?.map((rec: any) => (
                <Card key={rec.id} className="hover-elevate transition-all border-border/50 shadow-2xs">
                  <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-xl">{rec.title}</h3>
                        <Badge
                          variant={rec.status === "open" ? "default" : "secondary"}
                          className={rec.status === "open" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        >
                          {rec.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center font-medium text-foreground">
                          <Users className="mr-1.5 h-4 w-4 text-primary" />
                          {rec.club?.name}
                        </span>
                        <span className="flex items-center text-primary font-medium bg-primary/10 px-2.5 py-0.5 rounded-md">
                          <Briefcase className="mr-1.5 h-3.5 w-3.5" />
                          {rec.positionsAvailable} position{rec.positionsAvailable !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {rec.requirements && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          <strong>Requirements:</strong> {rec.requirements}
                        </p>
                      )}
                      {rec.deadline && (
                        <p className="text-xs text-destructive font-medium flex items-center mt-1">
                          <Calendar className="mr-1 h-3.5 w-3.5" />
                          Deadline: {new Date(rec.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Button
                        className="w-full md:w-auto"
                        disabled={rec.status !== "open"}
                        onClick={() => setSelectedRecruitment(rec)}
                      >
                        Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Coordinator Kanban Pipeline View */}
      {activeTab === "kanban" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-muted/30 border flex items-center justify-between text-xs text-muted-foreground">
            <span>Drag or move candidate cards between recruitment evaluation stages.</span>
            <Badge variant="outline">Coordinator Board</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {(["applied", "under_review", "shortlisted", "interview", "accepted"] as AppStage[]).map((stage) => {
              const stageApps = applications.filter(a => a.stage === stage)
              const stageTitles: Record<AppStage, string> = {
                applied: "Applied",
                under_review: "Under Review",
                shortlisted: "Shortlisted",
                interview: "Interviewing",
                accepted: "Accepted",
                rejected: "Rejected"
              }

              return (
                <div key={stage} className="bg-muted/40 p-3 rounded-xl border space-y-3 min-w-[220px]">
                  <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wider text-muted-foreground pb-2 border-b">
                    <span>{stageTitles[stage]}</span>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {stageApps.length}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {stageApps.map((app) => (
                      <Card key={app.id} className="p-3 bg-background border hover:border-primary transition-all shadow-2xs space-y-2">
                        <div className="font-bold text-sm leading-tight">{app.applicantName}</div>
                        <div className="text-xs text-muted-foreground">{app.roleTitle}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center justify-between pt-1 border-t">
                          <span>{app.clubName}</span>
                          <span>{app.appliedDate}</span>
                        </div>

                        {/* Move Actions */}
                        <div className="flex items-center gap-1 pt-1">
                          {stage !== "applied" && (
                            <button
                              onClick={() => {
                                const stages: AppStage[] = ["applied", "under_review", "shortlisted", "interview", "accepted"]
                                const prevIdx = stages.indexOf(stage) - 1
                                if (prevIdx >= 0) handleStageMove(app.id, stages[prevIdx])
                              }}
                              className="text-[10px] text-muted-foreground hover:text-foreground px-1 py-0.5 border rounded"
                            >
                              ← Move Back
                            </button>
                          )}
                          {stage !== "accepted" && (
                            <button
                              onClick={() => {
                                const stages: AppStage[] = ["applied", "under_review", "shortlisted", "interview", "accepted"]
                                const nextIdx = stages.indexOf(stage) + 1
                                if (nextIdx < stages.length) handleStageMove(app.id, stages[nextIdx])
                              }}
                              className="text-[10px] text-primary font-semibold hover:underline ml-auto"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </Card>
                    ))}
                    {stageApps.length === 0 && (
                      <div className="py-8 text-center text-xs text-muted-foreground/60 italic border border-dashed rounded-lg">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Application Drawer / Dialog */}
      {selectedRecruitment && (
        <Dialog open={!!selectedRecruitment} onOpenChange={(open) => !open && setSelectedRecruitment(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl">Apply for {selectedRecruitment.title}</DialogTitle>
              <DialogDescription>
                Submit your application details to <strong>{selectedRecruitment.club?.name}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 my-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Cover Letter / Statement of Interest:</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Explain why you are a great fit for this role..."
                  className="w-full p-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground block">Portfolio / Resume Link (URL):</label>
                <Input
                  placeholder="https://github.com/username or LinkedIn link"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary shrink-0" />
                <span>Your student profile details will be attached automatically.</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" onClick={() => setSelectedRecruitment(null)}>Cancel</Button>
              <Button onClick={handleApply} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
