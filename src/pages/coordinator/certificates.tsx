/**
 * Coordinator Certificate Management & Bulk Issuance Hub
 * Campus 360 - NKOCET, Team NEXUS
 * 
 * Features:
 * - Club events certificate status overview
 * - Template configuration with live certificate preview
 * - Team and Individual participant selection
 * - Bulk generation with collision-resistant unique IDs
 * - Instant issuance & student ledger synchronization
 */

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Award,
  CheckCircle2,
  Clock,
  Search,
  Users,
  ShieldCheck,
  Calendar,
  Eye,
  Sliders,
  Send,
  ArrowLeft,
  Check,
  FileCheck2,
  UserCheck,
  Building2,
  Layers,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCoordinator } from "./coordinator-context";
import { coordinatorService } from "@/api/services/coordinator.service";
import { certificatesService } from "@/api/services/certificates.service";
import {
  EventCertificateSettings,
  EventParticipantItem,
  Certificate,
} from "@/types/certificates";
import { CertificateSettingsPanel } from "@/components/certificates/certificate-settings-panel";
import { CertificateTemplate } from "@/components/certificates/certificate-template";
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorCertificates() {
  const { activeClub } = useCoordinator();
  const { toast } = useToast();
  const [location] = useLocation();

  const [events, setEvents] = useState<any[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  // Selected event for participant issuance or template config
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<"list" | "issue" | "template">("list");

  // Template settings for active event
  const [certSettings, setCertSettings] = useState<EventCertificateSettings>({
    enabled: false,
    title: "Certificate of Participation",
    bodyText: "",
    leftSignatory: {
      name: "Dr. S. R. Kulkarni",
      designation: "Faculty Advisor",
      department: "Computer Science & Engineering",
    },
    rightSignatory: {
      name: "Club Coordinator",
      designation: "Lead Coordinator",
      department: activeClub?.name || "Student Society",
    },
  });

  // Participant roster for active event
  const [participants, setParticipants] = useState<EventParticipantItem[]>([]);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "pending" | "issued" | "teams">("all");

  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedResult, setIssuedResult] = useState<{ count: number; certs: Certificate[] } | null>(null);

  // Preview single certificate modal
  const [previewCert, setPreviewCert] = useState<any | null>(null);

  // Load events
  const loadEvents = async () => {
    if (!activeClub) return;
    setIsLoadingEvents(true);
    try {
      const data = await coordinatorService.getClubEvents(activeClub.id);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [activeClub]);

  // Check URL query for direct event selection (e.g. /coordinator/certificates?event=1)
  useEffect(() => {
    if (events.length === 0) return;
    const searchParams = new URLSearchParams(window.location.search);
    const eventParam = searchParams.get("event");
    if (eventParam) {
      const found = events.find((e) => String(e.id) === eventParam);
      if (found) {
        handleOpenManage(found);
      }
    }
  }, [events]);

  const handleOpenManage = async (event: any) => {
    setSelectedEvent(event);
    setActiveView("issue");
    setIsLoadingRoster(true);
    setSelectedUserIds([]);
    setSearchQuery("");

    try {
      const [settings, roster] = await Promise.all([
        certificatesService.getEventCertificateSettings(event.id),
        certificatesService.getEventParticipants(event.id),
      ]);
      setCertSettings(settings);
      setParticipants(roster);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingRoster(false);
    }
  };

  const handleOpenTemplate = async (event: any) => {
    setSelectedEvent(event);
    setActiveView("template");
    try {
      const settings = await certificatesService.getEventCertificateSettings(event.id);
      setCertSettings(settings);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    if (!selectedEvent) return;
    try {
      await certificatesService.saveEventCertificateSettings(selectedEvent.id, certSettings);
      toast({
        title: "Certificate Template Saved",
        description: certSettings.enabled
          ? `Certificates enabled for "${selectedEvent.title}". You can now issue certificates to participants.`
          : `Certificate generation disabled for "${selectedEvent.title}".`,
      });
      await loadEvents();
      if (activeView === "template") {
        setActiveView("list");
      }
    } catch (err: any) {
      toast({ title: "Failed to Save Template", description: err?.message, variant: "destructive" });
    }
  };

  // Participant selection helpers
  const handleToggleParticipant = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAllPending = () => {
    const pendingIds = filteredParticipants.filter((p) => !p.isIssued).map((p) => p.userId);
    setSelectedUserIds(pendingIds);
  };

  const handleDeselectAll = () => {
    setSelectedUserIds([]);
  };

  const handleSelectTeam = (teamName: string) => {
    const teamUserIds = participants.filter((p) => p.teamName === teamName && !p.isIssued).map((p) => p.userId);
    setSelectedUserIds((prev) => {
      const combined = new Set([...prev, ...teamUserIds]);
      return Array.from(combined);
    });
    toast({
      title: `Team Selected: ${teamName}`,
      description: `${teamUserIds.length} eligible team members added to issuance selection.`,
    });
  };

  // Filter participants
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.teamName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.prn || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === "pending") return !p.isIssued;
    if (filterTab === "issued") return p.isIssued;
    if (filterTab === "teams") return Boolean(p.teamName);
    return true;
  });

  // Group teams for display
  const teamsMap = participants.reduce((acc, p) => {
    if (p.teamName) {
      if (!acc[p.teamName]) acc[p.teamName] = [];
      acc[p.teamName].push(p);
    }
    return acc;
  }, {} as Record<string, EventParticipantItem[]>);

  // Execute Certificate Issuance
  const handleExecuteIssuance = async () => {
    if (!selectedEvent || selectedUserIds.length === 0) return;

    const selectedParticipants = participants.filter((p) => selectedUserIds.includes(p.userId));

    setIsIssuing(true);
    try {
      const res = await certificatesService.issueCertificates({
        eventId: selectedEvent.id,
        eventName: selectedEvent.title,
        clubId: activeClub?.id,
        clubName: activeClub?.name,
        clubLogoUrl: activeClub?.logoUrl,
        eventDate: selectedEvent.startDatetime
          ? new Date(selectedEvent.startDatetime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
          : "Academic Year 2026",
        settings: certSettings,
        participants: selectedParticipants.map((p) => ({
          userId: p.userId,
          recipientName: p.name,
          recipientEmail: p.email,
          teamName: p.teamName,
          department: p.department,
          prn: p.prn,
        })),
      });

      setIssuedResult({ count: res.issuedCount, certs: res.certificates });
      setIsConfirmModalOpen(false);

      toast({
        title: "🎉 Certificates Successfully Issued!",
        description: `${res.issuedCount} official Campus 360 certificates have been generated and credited to student accounts.`,
      });

      // Reload participant roster
      const updatedRoster = await certificatesService.getEventParticipants(selectedEvent.id);
      setParticipants(updatedRoster);
      setSelectedUserIds([]);
    } catch (err: any) {
      toast({
        title: "Issuance Failed",
        description: err?.message || "Could not generate certificates.",
        variant: "destructive",
      });
    } finally {
      setIsIssuing(false);
    }
  };

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* View 1: Event List View */}
      {activeView === "list" && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  Event Certificates & Awards
                </h2>
                <Badge variant="outline" className="text-xs font-bold bg-primary/5 text-primary border-primary/20">
                  {activeClub.name}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground font-medium mt-1">
                Configure institutional certificate templates, affix two official signatories, and issue verifiable digital credentials.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <Card className="p-3.5 rounded-xl border bg-card shadow-2xs">
              <div className="text-[10px] text-muted-foreground font-extrabold uppercase">Total Club Events</div>
              <div className="text-2xl font-black mt-1 text-foreground">{events.length}</div>
            </Card>
            <Card className="p-3.5 rounded-xl border bg-card shadow-2xs">
              <div className="text-[10px] text-muted-foreground font-extrabold uppercase">Certificates Active</div>
              <div className="text-2xl font-black mt-1 text-emerald-600">
                {events.filter((e) => e.certificateEnabled).length}
              </div>
            </Card>
            <Card className="p-3.5 rounded-xl border bg-card shadow-2xs">
              <div className="text-[10px] text-muted-foreground font-extrabold uppercase">Registered Attendees</div>
              <div className="text-2xl font-black mt-1 text-primary">
                {events.reduce((sum, e) => sum + (e.registeredCount || 0), 0)}
              </div>
            </Card>
            <Card className="p-3.5 rounded-xl border bg-card shadow-2xs">
              <div className="text-[10px] text-muted-foreground font-extrabold uppercase">Accredited Standard</div>
              <div className="text-xs font-bold mt-2.5 text-amber-600 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> NAAC 'A' Grade Format
              </div>
            </Card>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((e) => (
              <Card key={e.id} className="border shadow-2xs p-4 flex flex-col justify-between space-y-3.5 bg-card hover:border-primary/40 transition-colors">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {e.category}
                    </Badge>
                    <Badge
                      className={
                        e.certificateEnabled
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border-emerald-500/30 text-[10px]"
                          : "bg-muted text-muted-foreground font-medium text-[10px]"
                      }
                    >
                      {e.certificateEnabled ? "Certificates Enabled" : "Certificates Disabled"}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm text-foreground">{e.title}</h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{new Date(e.startDatetime).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Registrations:</span>
                      <strong className="text-foreground">{e.registeredCount || 0} participants</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Issuance Mode:</span>
                      <span className="font-semibold text-primary">Cryptographic QR Passes</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleOpenManage(e)}
                    className="flex-1 font-bold text-xs h-8.5 gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Award className="h-3.5 w-3.5" />
                    Manage & Issue
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenTemplate(e)}
                    className="h-8.5 text-xs font-semibold gap-1 cursor-pointer"
                    title="Configure Template"
                  >
                    <Sliders className="h-3.5 w-3.5" /> Template
                  </Button>
                </div>
              </Card>
            ))}

            {events.length === 0 && !isLoadingEvents && (
              <div className="md:col-span-3 p-10 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
                <Award className="h-10 w-10 mx-auto text-muted-foreground opacity-60" />
                <div className="font-bold text-sm text-foreground">No Club Events Scheduled</div>
                <p>Schedule your workshop or hackathon under Club Events to generate certificates.</p>
                <Button asChild size="sm" className="mt-2 text-xs font-bold">
                  <Link href="/coordinator/events">Create Event</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* View 2: Template Configuration & Preview */}
      {activeView === "template" && selectedEvent && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("list")}
              className="text-xs font-semibold gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Certificates Hub
            </Button>

            <Button
              size="sm"
              onClick={handleSaveSettings}
              className="font-bold text-xs h-8.5 gap-1.5 shadow-2xs"
            >
              <Check className="h-3.5 w-3.5" /> Save Certificate Template
            </Button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-foreground">Certificate Settings: {selectedEvent.title}</h2>
              <Badge variant="outline" className="text-[10px] font-bold">
                {selectedEvent.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Configure the certificate title, body text, and two institutional signatories. Preview updates live in real-time.
            </p>
          </div>

          <CertificateSettingsPanel
            settings={certSettings}
            onChange={setCertSettings}
            clubName={activeClub.name}
            clubLogoUrl={activeClub.logoUrl}
            eventName={selectedEvent.title}
            eventDate={selectedEvent.startDatetime ? new Date(selectedEvent.startDatetime).toLocaleDateString() : "Recent Date"}
          />
        </div>
      )}

      {/* View 3: Participant Selection & Issuance Panel */}
      {activeView === "issue" && selectedEvent && (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView("list")}
              className="text-xs font-semibold gap-1.5 w-fit"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Certificates
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenTemplate(selectedEvent)}
                className="text-xs h-8.5 font-bold gap-1.5"
              >
                <Sliders className="h-3.5 w-3.5" /> Edit Template & Signatories
              </Button>
              <Button
                size="sm"
                disabled={selectedUserIds.length === 0 || !certSettings.enabled}
                onClick={() => setIsConfirmModalOpen(true)}
                className="font-bold text-xs h-8.5 gap-1.5 bg-primary text-primary-foreground shadow-2xs"
              >
                <Award className="h-3.5 w-3.5" />
                Issue Certificates ({selectedUserIds.length})
              </Button>
            </div>
          </div>

          {/* Event Context Banner */}
          <div className="p-4 rounded-2xl border bg-card flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-foreground">{selectedEvent.title}</span>
                <Badge
                  className={
                    certSettings.enabled
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border-emerald-500/30 text-[10px]"
                      : "bg-destructive/15 text-destructive font-bold border-destructive/30 text-[10px]"
                  }
                >
                  {certSettings.enabled ? "Template Ready" : "Certificates Disabled"}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-3">
                <span>Date: <strong>{new Date(selectedEvent.startDatetime).toLocaleDateString()}</strong></span>
                <span>•</span>
                <span>Venue: <strong>{selectedEvent.venue || "Campus Venue"}</strong></span>
                <span>•</span>
                <span>Signatories: <strong>{certSettings.leftSignatory?.name} & {certSettings.rightSignatory?.name}</strong></span>
              </div>
            </div>

            {!certSettings.enabled && (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-xs text-amber-700 dark:text-amber-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Enable certificates in the template editor before issuing credentials.</span>
              </div>
            )}
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border">
            <div className="relative flex-1 max-w-sm">
              <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search participant name, PRN, or team..."
                className="pl-8 h-8.5 text-xs bg-background"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setFilterTab("all")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterTab === "all" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                All ({participants.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("pending")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterTab === "pending" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Pending ({participants.filter((p) => !p.isIssued).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("issued")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterTab === "issued" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Issued ({participants.filter((p) => p.isIssued).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab("teams")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterTab === "teams" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Teams ({Object.keys(teamsMap).length})
              </button>
            </div>
          </div>

          {/* Bulk Selection Actions */}
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllPending}
                className="h-7 text-xs font-bold"
              >
                Select All Pending
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeselectAll}
                disabled={selectedUserIds.length === 0}
                className="h-7 text-xs text-muted-foreground"
              >
                Clear Selection
              </Button>
            </div>

            <div className="text-xs font-bold text-primary">
              {selectedUserIds.length} participant(s) selected for issuance
            </div>
          </div>

          {/* Teams Section (If Any Teams Registered) */}
          {Object.keys(teamsMap).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Users className="h-4 w-4" /> Registered Teams ({Object.keys(teamsMap).length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(teamsMap).map(([teamName, members]) => {
                  const pendingCount = members.filter((m) => !m.isIssued).length;
                  const allSelected = members.every((m) => selectedUserIds.includes(m.userId) || m.isIssued);

                  return (
                    <div
                      key={teamName}
                      className="p-3.5 rounded-xl border bg-card space-y-2.5 shadow-2xs hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-xs text-foreground">
                            <span className="h-2 w-2 rounded-full bg-teal-500" />
                            {teamName}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {members.length} members ({pendingCount} pending certificates)
                          </p>
                        </div>

                        {pendingCount > 0 ? (
                          <Button
                            size="sm"
                            variant={allSelected ? "secondary" : "outline"}
                            onClick={() => handleSelectTeam(teamName)}
                            className="h-7 text-[10px] font-bold"
                          >
                            {allSelected ? "Team Selected" : "Select Entire Team"}
                          </Button>
                        ) : (
                          <Badge className="bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                            All Issued
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1 border-t">
                        {members.map((mem) => (
                          <span
                            key={mem.userId}
                            className={`text-[10px] px-2 py-0.5 rounded-md font-medium border ${
                              mem.isIssued
                                ? "bg-emerald-500/10 text-emerald-700 border-emerald-300"
                                : selectedUserIds.includes(mem.userId)
                                ? "bg-primary/10 text-primary border-primary font-bold"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {mem.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Participant Roster Table */}
          <Card className="border shadow-2xs overflow-hidden">
            <div className="divide-y text-xs">
              {isLoadingRoster ? (
                <div className="py-12 text-center text-muted-foreground animate-pulse">
                  Loading registered attendees and verified profiles...
                </div>
              ) : filteredParticipants.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground space-y-2">
                  <Users className="h-8 w-8 mx-auto opacity-50" />
                  <p className="font-semibold">No participants match your criteria</p>
                </div>
              ) : (
                filteredParticipants.map((p) => {
                  const isChecked = selectedUserIds.includes(p.userId);

                  return (
                    <div
                      key={p.userId}
                      onClick={() => !p.isIssued && handleToggleParticipant(p.userId)}
                      className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                        p.isIssued
                          ? "bg-muted/10 opacity-75"
                          : isChecked
                          ? "bg-primary/5 cursor-pointer"
                          : "hover:bg-muted/30 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkbox */}
                        <input
                          type="checkbox"
                          checked={isChecked || p.isIssued}
                          disabled={p.isIssued}
                          onChange={() => !p.isIssued && handleToggleParticipant(p.userId)}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary shrink-0 cursor-pointer disabled:cursor-not-allowed"
                        />

                        {/* Recipient Details */}
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-foreground truncate">{p.name}</span>
                            <Badge variant="outline" className="text-[10px] font-bold">
                              {p.registrationType === "team" ? `Team: ${p.teamName}` : "Individual"}
                            </Badge>
                            {p.department && (
                              <span className="text-[11px] text-muted-foreground">({p.department})</span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
                            <span>{p.email}</span>
                            <span>•</span>
                            <span>PRN: <strong>{p.prn || "N/A"}</strong></span>
                            <span>•</span>
                            <span className="capitalize">Status: <strong>{p.status}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Status & View Action */}
                      <div className="flex items-center gap-2 shrink-0 sm:self-center">
                        {p.isIssued ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold border-emerald-500/30 text-[10px]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Issued ({p.issuedCertificateCode})
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-[11px] text-primary hover:underline cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewCert({
                                  title: certSettings.title,
                                  recipientName: p.name,
                                  eventName: selectedEvent.title,
                                  eventDate: new Date(selectedEvent.startDatetime).toLocaleDateString(),
                                  clubName: activeClub.name,
                                  clubLogoUrl: activeClub.logoUrl,
                                  bodyText: certSettings.bodyText,
                                  verificationCode: p.issuedCertificateCode || "C360-CERT-2026-ISSUED",
                                  leftSignatory: certSettings.leftSignatory,
                                  rightSignatory: certSettings.rightSignatory,
                                });
                              }}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> View
                            </Button>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-muted-foreground">
                            Pending Issuance
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Confirm Certificate Issuance
            </DialogTitle>
            <DialogDescription className="text-xs">
              You are about to issue official, cryptographically verified Campus 360 certificates for{" "}
              <strong className="text-foreground">{selectedEvent?.title}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3.5 rounded-xl bg-muted/40 border space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recipients Count:</span>
              <strong className="text-primary font-bold">{selectedUserIds.length} Participants</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Certificate Title:</span>
              <span className="font-semibold text-foreground">{certSettings.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Organizing Club:</span>
              <span className="font-semibold text-foreground">{activeClub.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Affixed Signatures:</span>
              <span className="text-foreground">
                {certSettings.leftSignatory?.name} &amp; {certSettings.rightSignatory?.name}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Each participant will receive a collision-resistant unique certificate identifier and public QR verification link. Credentials will instantly appear in their student accounts.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              disabled={isIssuing}
              onClick={() => setIsConfirmModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={isIssuing}
              onClick={handleExecuteIssuance}
              className="font-bold text-xs gap-1.5 bg-primary text-primary-foreground shadow-2xs cursor-pointer"
            >
              {isIssuing ? (
                <>Issuing {selectedUserIds.length} Certificates...</>
              ) : (
                <>
                  <Check className="h-4 w-4" /> Confirm &amp; Issue ({selectedUserIds.length})
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Single Certificate Modal */}
      <Dialog open={!!previewCert} onOpenChange={() => setPreviewCert(null)}>
        <DialogContent className="max-w-4xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold flex items-center justify-between">
              <span>Official Institutional Certificate</span>
              <Badge variant="outline" className="font-mono text-xs">
                {previewCert?.verificationCode}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {previewCert && (
            <div className="py-2">
              <CertificateTemplate
                title={previewCert.title}
                recipientName={previewCert.recipientName}
                eventName={previewCert.eventName}
                eventDate={previewCert.eventDate}
                clubName={previewCert.clubName}
                clubLogoUrl={previewCert.clubLogoUrl}
                bodyText={previewCert.bodyText}
                verificationCode={previewCert.verificationCode}
                leftSignatory={previewCert.leftSignatory}
                rightSignatory={previewCert.rightSignatory}
              />
            </div>
          )}

          <DialogFooter className="flex items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (previewCert?.verificationCode) {
                  window.open(`/certificates/verify/${previewCert.verificationCode}`, "_blank");
                }
              }}
              className="text-xs font-semibold gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Public Verification
            </Button>

            <Button
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-bold gap-1.5"
            >
              Print / Save PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

