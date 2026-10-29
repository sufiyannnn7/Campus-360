/**
 * Club Profile Editor
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Full multi-tab editor for club identity, branding, mission/vision, meetings, and sections.
 */

import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Building2,
  Image as ImageIcon,
  Compass,
  Calendar,
  Layers,
  Save,
  Check,
  Send,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCoordinator } from "./coordinator-context";
import { coordinatorService } from "@/api/services/coordinator.service";
import { ClubSectionItem } from "@/types/coordinator";

export default function CoordinatorProfile() {
  const { activeClub, refreshClubs } = useCoordinator();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<ClubSectionItem[]>([]);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Technical");
  const [tagline, setTagline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [establishedYear, setEstablishedYear] = useState<number>(2020);
  const [facultyAdvisor, setFacultyAdvisor] = useState("");
  const [meetingFrequency, setMeetingFrequency] = useState("Weekly");
  const [meetingDayTime, setMeetingDayTime] = useState("");
  const [meetingVenue, setMeetingVenue] = useState("");
  const [campusLocation, setCampusLocation] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  // Sync state with activeClub
  useEffect(() => {
    if (!activeClub) return;

    setName(activeClub.name || "");
    setSlug(activeClub.slug || "");
    setCategory(activeClub.category || "Technical");
    setTagline(activeClub.tagline || "");
    setShortDescription(activeClub.tagline || "");
    setDescription(activeClub.description || "");
    setMission(activeClub.mission || "");
    setVision(activeClub.vision || "");
    setObjectives(activeClub.objectives || []);
    setIntroduction(activeClub.introduction || "");
    setFacultyAdvisor(activeClub.facultyAdvisor || "");
    setMeetingFrequency(activeClub.meetingFrequency || "Weekly");
    setMeetingDayTime(activeClub.meetingDayTime || "Saturdays, 3:30 PM");
    setMeetingVenue(activeClub.meetingVenue || "Campus Tech Lab");
    setCampusLocation(activeClub.campusLocation || "Main Building, Block B");
    setContactEmail(activeClub.contactEmail || "");
    setWebsiteUrl(activeClub.socialLinks?.website || "");
    setInstagramUrl(activeClub.socialLinks?.instagram || "");
    setLinkedinUrl(activeClub.socialLinks?.linkedin || "");
    setGithubUrl(activeClub.socialLinks?.github || "");
    setLogoUrl(activeClub.logoUrl || "");
    setBannerUrl(activeClub.bannerUrl || "");

    // Load sections
    coordinatorService.getClubSections(activeClub.id).then(setSections).catch(console.error);
  }, [activeClub]);

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    setObjectives([...objectives, newObjective.trim()]);
    setNewObjective("");
  };

  const handleRemoveObjective = (idx: number) => {
    setObjectives(objectives.filter((_, i) => i !== idx));
  };

  const handleSaveProfile = async (asDraft = false) => {
    if (!activeClub) return;
    setIsSaving(true);

    try {
      await coordinatorService.updateClubProfile(activeClub.id, {
        name,
        slug,
        category,
        tagline,
        shortDescription,
        description,
        mission,
        vision,
        objectives,
        introduction,
        establishedYear,
        facultyAdvisor,
        meetingFrequency,
        meetingDayTime,
        meetingVenue,
        campusLocation,
        contactEmail,
        websiteUrl,
        instagramUrl,
        linkedinUrl,
        githubUrl,
        logoUrl,
        bannerUrl,
      });

      // Save sections
      for (const sec of sections) {
        await coordinatorService.saveClubSection(activeClub.id, sec);
      }

      await refreshClubs();

      toast({
        title: asDraft ? "Draft Saved" : "Profile Updated Successfully",
        description: "Your club profile modifications have been persisted.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err?.message || "Could not save profile changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!activeClub) return;
    try {
      await coordinatorService.submitApprovalRequest(activeClub.id, "profile_update", {
        name,
        tagline,
        mission,
        vision,
        objectives,
        meetingVenue,
      });

      await refreshClubs();

      toast({
        title: "Submitted for Admin Approval",
        description: "Your profile changes were queued for Administrator review.",
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err?.message || "Could not submit for approval.",
        variant: "destructive",
      });
    }
  };

  if (!activeClub) {
    return <div className="p-8 text-center">No assigned club selected.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Club Profile & Public Page Editor</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Customize official club details, statements, branding assets, meeting logistics, and public visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-semibold">
            <Link href={`/clubs/${activeClub.id}`} target="_blank">
              <Eye className="h-3.5 w-3.5" /> Preview Public Page
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => handleSaveProfile(false)}
            disabled={isSaving}
            className="h-9 font-bold text-xs gap-1.5 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" /> {isSaving ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={handleSubmitForApproval}
            className="h-9 font-bold text-xs gap-1.5 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" /> Submit to Admin
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/70 p-1 rounded-xl h-auto flex flex-wrap gap-1">
          <TabsTrigger value="basic" className="text-xs font-bold gap-1.5 py-1.5">
            <Building2 className="h-3.5 w-3.5" /> 1. Basic Info
          </TabsTrigger>
          <TabsTrigger value="mission" className="text-xs font-bold gap-1.5 py-1.5">
            <Compass className="h-3.5 w-3.5" /> 2. Mission & Meetings
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs font-bold gap-1.5 py-1.5">
            <ImageIcon className="h-3.5 w-3.5" /> 3. Branding & Links
          </TabsTrigger>
          <TabsTrigger value="sections" className="text-xs font-bold gap-1.5 py-1.5">
            <Layers className="h-3.5 w-3.5" /> 4. Public Page Sections
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: BASIC INFO */}
        <TabsContent value="basic">
          <Card className="border shadow-2xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-extrabold">Official Club Identity</CardTitle>
              <CardDescription className="text-xs">
                Essential metadata visible on campus club discovery cards and platform headers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Official Club Name *</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Coding Club NKOCET" className="h-9 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">URL Slug Identifier *</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. coding-club" className="h-9 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Technical, Cultural, Sports..." className="h-9 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Faculty Advisor</Label>
                  <Input value={facultyAdvisor} onChange={(e) => setFacultyAdvisor(e.target.value)} placeholder="Prof. S. R. Kulkarni" className="h-9 text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Official Contact Email</Label>
                  <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="club@nkocet.edu.in" className="h-9 text-xs" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Tagline (Catchphrase) *</Label>
                <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A concise 1-sentence summary of your society" className="h-9 text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Full Club Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed background, goals, projects, history, and activities..."
                  rows={5}
                  className="text-xs resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Club Introduction / Welcome Note</Label>
                <Textarea
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="Welcoming message displayed to prospective new members..."
                  rows={3}
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: MISSION, VISION & MEETINGS */}
        <TabsContent value="mission">
          <Card className="border shadow-2xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-extrabold">Mission, Vision & Meeting Operations</CardTitle>
              <CardDescription className="text-xs">
                Clarify purpose and inform students about physical gathering times on campus.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Mission Statement</Label>
                  <Textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="What does your club aim to accomplish every semester?"
                    rows={3}
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Vision Statement</Label>
                  <Textarea
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    placeholder="Where do you see the club in 3-5 years?"
                    rows={3}
                    className="text-xs"
                  />
                </div>
              </div>

              {/* Objectives List */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-xs font-bold">Core Objectives & Milestones</Label>
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add an actionable objective (e.g. Conduct weekly DSA bootcamps)..."
                    className="h-9 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddObjective();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={handleAddObjective} className="h-9 font-bold text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                </div>

                <div className="space-y-2 mt-2">
                  {objectives.map((obj, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border bg-muted/30 text-xs">
                      <span>• {obj}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveObjective(i)} className="h-7 w-7 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  {objectives.length === 0 && (
                    <p className="text-xs text-muted-foreground italic">No objectives added yet. Add 2-4 key goals.</p>
                  )}
                </div>
              </div>

              {/* Meeting Logistics */}
              <div className="pt-2 border-t space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Meeting Schedule & Physical Venue</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Meeting Frequency</Label>
                    <Input value={meetingFrequency} onChange={(e) => setMeetingFrequency(e.target.value)} placeholder="e.g. Weekly, Bi-weekly" className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Meeting Day & Time</Label>
                    <Input value={meetingDayTime} onChange={(e) => setMeetingDayTime(e.target.value)} placeholder="e.g. Saturdays, 3:30 PM" className="h-9 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Venue / Room</Label>
                    <Input value={meetingVenue} onChange={(e) => setMeetingVenue(e.target.value)} placeholder="e.g. Computer Lab A, IT Block" className="h-9 text-xs" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BRANDING & LINKS */}
        <TabsContent value="branding">
          <Card className="border shadow-2xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-extrabold">Branding Assets & Social Links</CardTitle>
              <CardDescription className="text-xs">
                Upload image assets or enter CDN links. Images must be high-resolution PNG or JPG.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Logo Section */}
                <div className="space-y-3 border p-4 rounded-2xl bg-muted/20">
                  <Label className="text-xs font-bold">Club Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl border-2 border-dashed bg-card flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Club Logo Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <Input
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="Paste image URL (or upload)"
                        className="h-8 text-xs font-mono"
                      />
                      <p className="text-[10px] text-muted-foreground">Square aspect ratio (1:1), 500x500px recommended.</p>
                    </div>
                  </div>
                </div>

                {/* Banner Section */}
                <div className="space-y-3 border p-4 rounded-2xl bg-muted/20">
                  <Label className="text-xs font-bold">Cover Banner</Label>
                  <div className="space-y-2">
                    <div className="h-20 w-full rounded-2xl border-2 border-dashed bg-card flex items-center justify-center overflow-hidden shadow-2xs">
                      {bannerUrl ? (
                        <img src={bannerUrl} alt="Banner Preview" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <Input
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      placeholder="Paste cover banner URL"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2 border-t space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Official Web & Social Channels</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Website / Blog URL</Label>
                    <Input value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">GitHub Organization</Label>
                    <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">LinkedIn Page</Label>
                    <Input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/company/..." className="h-9 text-xs font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold">Instagram Handle</Label>
                    <Input value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} placeholder="https://instagram.com/..." className="h-9 text-xs font-mono" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: SECTIONS MANAGER */}
        <TabsContent value="sections">
          <Card className="border shadow-2xs">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-extrabold">Public Page Section Visibility</CardTitle>
              <CardDescription className="text-xs">
                Enable, disable, and rename sections displayed on your club's public student-facing page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sections.map((sec, idx) => (
                <div key={sec.sectionKey} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs text-foreground flex items-center gap-2">
                      <span>{sec.title}</span>
                      <Badge variant="outline" className="text-[10px] font-mono">{sec.sectionKey}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Order position: #{sec.displayOrder}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={sec.isEnabled}
                      onCheckedChange={(checked) => {
                        const updated = [...sections];
                        updated[idx].isEnabled = checked;
                        setSections(updated);
                      }}
                    />
                    <span className="text-xs font-semibold w-16">{sec.isEnabled ? "Visible" : "Hidden"}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
