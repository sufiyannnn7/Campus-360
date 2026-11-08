/**
 * Certificate Settings Panel & Live Preview Editor
 * Campus 360 - NKOCET, Team NEXUS
 * 
 * Embedded in Event Creation, Event Editing, and Certificate Management.
 * Provides live template tweaking, dual signature configuration,
 * character counter, and instant real-time certificate preview.
 */

import React, { useState } from "react";
import {
  Award,
  Check,
  Eye,
  Sliders,
  Sparkles,
  Upload,
  Info,
  Building2,
  FileCheck2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCertificateSettings } from "@/types/certificates";
import { CertificateTemplate } from "./certificate-template";
import { ImageUploadDropzone } from "@/components/ui/image-upload-dropzone";

interface CertificateSettingsPanelProps {
  settings: EventCertificateSettings;
  onChange: (updated: EventCertificateSettings) => void;
  clubName?: string;
  clubLogoUrl?: string;
  eventName?: string;
  eventDate?: string;
}

const BODY_CHAR_LIMIT = 350;

export function CertificateSettingsPanel({
  settings,
  onChange,
  clubName = "Coding Club NKOCET",
  clubLogoUrl,
  eventName = "Campus Technical Symposium 2026",
  eventDate = "November 2026",
}: CertificateSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  const updateSetting = <K extends keyof EventCertificateSettings>(
    key: K,
    val: EventCertificateSettings[K]
  ) => {
    onChange({
      ...settings,
      [key]: val,
    });
  };

  const updateLeftSignatory = (field: string, val: string) => {
    onChange({
      ...settings,
      leftSignatory: {
        ...settings.leftSignatory,
        [field]: val,
      },
    });
  };

  const updateRightSignatory = (field: string, val: string) => {
    onChange({
      ...settings,
      rightSignatory: {
        ...settings.rightSignatory,
        [field]: val,
      },
    });
  };

  const bodyLength = (settings.bodyText || "").length;

  return (
    <div className="rounded-2xl border border-primary/20 bg-card p-4 sm:p-5 space-y-5 shadow-2xs">
      {/* Enable Toggle Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-foreground">Official Event Certificates</span>
              <Badge
                variant="outline"
                className={settings.enabled ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-[10px] font-bold" : "text-[10px] text-muted-foreground"}
              >
                {settings.enabled ? "Active" : "Disabled"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Automatically award verifiable digital certificates to registered attendees and team members.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Label htmlFor="cert-enable-switch" className="text-xs font-bold cursor-pointer">
            {settings.enabled ? "Certificates Enabled" : "Enable Certificates"}
          </Label>
          <Switch
            id="cert-enable-switch"
            checked={settings.enabled}
            onCheckedChange={(checked) => updateSetting("enabled", checked)}
          />
        </div>
      </div>

      {/* Editor & Live Preview (Rendered when enabled) */}
      {settings.enabled ? (
        <div className="space-y-4">
          {/* Sub Navigation: Config Form vs Live Certificate Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-xl border">
              <button
                type="button"
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "editor"
                    ? "bg-background text-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sliders className="h-3.5 w-3.5" /> Template Configuration
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "preview"
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3.5 w-3.5" /> Live Certificate Preview
              </button>
            </div>

            <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
              Landscape A4 Format (Institutional Grade)
            </span>
          </div>

          {activeTab === "editor" ? (
            <div className="space-y-4 pt-1 animate-in fade-in-50 duration-200">
              {/* Title & Body */}
              <div className="grid grid-cols-1 gap-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">Certificate Title *</Label>
                    <span className="text-[10px] text-muted-foreground">Appears prominently at top</span>
                  </div>
                  <Input
                    value={settings.title}
                    onChange={(e) => updateSetting("title", e.target.value)}
                    placeholder="e.g. Certificate of Participation / Certificate of Excellence"
                    className="text-xs h-9 bg-background font-medium"
                    maxLength={60}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold">Custom Certificate Body Text</Label>
                    <span className={`text-[10px] font-mono ${bodyLength > BODY_CHAR_LIMIT ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                      {bodyLength} / {BODY_CHAR_LIMIT} characters
                    </span>
                  </div>
                  <Textarea
                    value={settings.bodyText}
                    onChange={(e) => updateSetting("bodyText", e.target.value.slice(0, BODY_CHAR_LIMIT))}
                    placeholder={`e.g. for active and successful participation in ${eventName} organized by ${clubName} at N. K. Orchid College of Engineering & Technology, Solapur.`}
                    rows={3}
                    className="text-xs resize-none bg-background leading-relaxed"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Leave blank to use the standard university institutional wording. Recipient name and club logo are populated automatically.
                  </p>
                </div>
              </div>

              {/* Two Official Signatures Configuration */}
              <div className="space-y-2 pt-2 border-t border-border/70">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-foreground">Two Official Signatory Credentials</Label>
                  <span className="text-[10px] text-muted-foreground">Exactly two signatures required</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Signatory */}
                  <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <FileCheck2 className="h-4 w-4 text-primary" /> Left Signatory (Faculty / Authority)
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Label className="text-[10px] font-semibold">Signatory Full Name *</Label>
                        <Input
                          value={settings.leftSignatory?.name || ""}
                          onChange={(e) => updateLeftSignatory("name", e.target.value)}
                          placeholder="e.g. Dr. S. R. Kulkarni"
                          className="text-xs h-8 bg-background"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] font-semibold">Designation *</Label>
                          <Input
                            value={settings.leftSignatory?.designation || ""}
                            onChange={(e) => updateLeftSignatory("designation", e.target.value)}
                            placeholder="e.g. Faculty Advisor"
                            className="text-xs h-8 bg-background"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] font-semibold">Department / Org</Label>
                          <Input
                            value={settings.leftSignatory?.department || ""}
                            onChange={(e) => updateLeftSignatory("department", e.target.value)}
                            placeholder="e.g. CSE Dept"
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                      </div>

                      {/* Signature Upload / Dropzone */}
                      <div>
                        <Label className="text-[10px] font-semibold mb-1 block">Signature Image (Transparent PNG / WebP)</Label>
                        <ImageUploadDropzone
                          value={settings.leftSignatory?.signatureUrl}
                          onChange={(url: string) => updateLeftSignatory("signatureUrl", url)}
                          aspect="banner"
                          label="Upload Left Signature"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Signatory */}
                  <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <FileCheck2 className="h-4 w-4 text-primary" /> Right Signatory (Student Lead / Coordinator)
                    </div>

                    <div className="space-y-2">
                      <div>
                        <Label className="text-[10px] font-semibold">Signatory Full Name *</Label>
                        <Input
                          value={settings.rightSignatory?.name || ""}
                          onChange={(e) => updateRightSignatory("name", e.target.value)}
                          placeholder="e.g. Sufiyan Shaikh"
                          className="text-xs h-8 bg-background"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-[10px] font-semibold">Designation *</Label>
                          <Input
                            value={settings.rightSignatory?.designation || ""}
                            onChange={(e) => updateRightSignatory("designation", e.target.value)}
                            placeholder="e.g. Club Lead"
                            className="text-xs h-8 bg-background"
                            required
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] font-semibold">Department / Org</Label>
                          <Input
                            value={settings.rightSignatory?.department || ""}
                            onChange={(e) => updateRightSignatory("department", e.target.value)}
                            placeholder="e.g. Coding Club"
                            className="text-xs h-8 bg-background"
                          />
                        </div>
                      </div>

                      {/* Signature Upload / Dropzone */}
                      <div>
                        <Label className="text-[10px] font-semibold mb-1 block">Signature Image (Transparent PNG / WebP)</Label>
                        <ImageUploadDropzone
                          value={settings.rightSignatory?.signatureUrl}
                          onChange={(url: string) => updateRightSignatory("signatureUrl", url)}
                          aspect="banner"
                          label="Upload Right Signature"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Live Interactive Preview Mode */
            <div className="space-y-3 pt-1 animate-in fade-in-50 duration-200">
              <div className="rounded-xl overflow-hidden border bg-slate-950/5 p-2 sm:p-4">
                <CertificateTemplate
                  title={settings.title || "Certificate of Participation"}
                  recipientName="Participant Full Name (Sample)"
                  eventName={eventName}
                  eventDate={eventDate}
                  clubName={clubName}
                  clubLogoUrl={clubLogoUrl}
                  bodyText={settings.bodyText}
                  leftSignatory={settings.leftSignatory}
                  rightSignatory={settings.rightSignatory}
                  verificationCode="C360-CERT-2026-DEMO"
                  isPreview={true}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border">
                <span className="flex items-center gap-1.5 font-medium">
                  <Info className="h-4 w-4 text-primary shrink-0" />
                  Live WYSIWYG preview updating in real-time. Participant names are injected dynamically upon generation.
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveTab("editor")}
                  className="text-xs h-7 shrink-0"
                >
                  Edit Template
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 border rounded-xl bg-muted/10 text-center space-y-1 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Certificates are currently turned off for this event.</p>
          <p>Toggle the switch above to enable automated institutional certificate generation and custom signatories.</p>
        </div>
      )}
    </div>
  );
}

export default CertificateSettingsPanel;
