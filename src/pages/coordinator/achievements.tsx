/**
 * Club Achievements & Gallery Media
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Showcase club awards, hackathon triumphs, and organized event photo galleries.
 */

import React, { useState, useEffect } from "react";
import {
  Award,
  Image as ImageIcon,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { ClubAchievementItem, ClubGalleryMediaItem } from "@/types/coordinator";
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorAchievements() {
  const { activeClub } = useCoordinator();
  const { toast } = useToast();

  const [achievements, setAchievements] = useState<ClubAchievementItem[]>([]);
  const [gallery, setGallery] = useState<ClubGalleryMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Achievement Modal
  const [isAchModalOpen, setIsAchModalOpen] = useState(false);
  const [achTitle, setAchTitle] = useState("");
  const [achOrg, setAchOrg] = useState("");
  const [achDesc, setAchDesc] = useState("");
  const [achDate, setAchDate] = useState("");
  const [achImg, setAchImg] = useState("");

  // Gallery Modal
  const [isGalModalOpen, setIsGalModalOpen] = useState(false);
  const [galTitle, setGalTitle] = useState("");
  const [galUrl, setGalUrl] = useState("");
  const [galCaption, setGalCaption] = useState("");
  const [galTag, setGalTag] = useState("");

  const loadData = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const [achData, galData] = await Promise.all([
        coordinatorService.getAchievements(activeClub.id),
        coordinatorService.getGallery(activeClub.id),
      ]);
      setAchievements(achData);
      setGallery(galData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeClub]);

  const handleSaveAchievement = async () => {
    if (!activeClub || !achTitle.trim()) {
      toast({ title: "Validation Error", description: "Title is required.", variant: "destructive" });
      return;
    }

    try {
      await coordinatorService.saveAchievement(activeClub.id, {
        title: achTitle.trim(),
        organization: achOrg.trim() || undefined,
        description: achDesc.trim() || undefined,
        awardDate: achDate || new Date().toISOString().slice(0, 10),
        imageUrl: achImg.trim() || undefined,
        isPublished: true,
      });

      await loadData();
      setIsAchModalOpen(false);
      setAchTitle("");
      setAchOrg("");
      setAchDesc("");
      toast({ title: "Achievement Added", description: "Showcased on club public profile." });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleDeleteAchievement = async (id: number) => {
    if (!activeClub) return;
    try {
      await coordinatorService.deleteAchievement(activeClub.id, id);
      await loadData();
      toast({ title: "Deleted", description: "Achievement removed." });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleSaveGallery = async () => {
    if (!activeClub || !galTitle.trim() || !galUrl.trim()) {
      toast({ title: "Validation Error", description: "Title and Image URL are required.", variant: "destructive" });
      return;
    }

    try {
      await coordinatorService.saveGalleryItem(activeClub.id, {
        title: galTitle.trim(),
        imageUrl: galUrl.trim(),
        caption: galCaption.trim() || undefined,
        eventTag: galTag.trim() || "General",
        displayOrder: gallery.length + 1,
        isPublished: true,
      });

      await loadData();
      setIsGalModalOpen(false);
      setGalTitle("");
      setGalUrl("");
      setGalCaption("");
      toast({ title: "Image Uploaded", description: "Added to club media gallery." });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleDeleteGallery = async (id: number) => {
    if (!activeClub) return;
    try {
      await coordinatorService.deleteGalleryItem(activeClub.id, id);
      await loadData();
      toast({ title: "Deleted", description: "Image removed from gallery." });
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" });
    }
  };

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Achievements & Media Gallery</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Highlight awards, competition victories, and visual event moments for {activeClub.name}.
          </p>
        </div>
      </div>

      <Tabs defaultValue="achievements" className="space-y-4">
        <TabsList className="bg-muted/70 p-1 rounded-xl">
          <TabsTrigger value="achievements" className="text-xs font-bold gap-1.5">
            <Award className="h-3.5 w-3.5" /> Club Achievements ({achievements.length})
          </TabsTrigger>
          <TabsTrigger value="gallery" className="text-xs font-bold gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" /> Media Gallery ({gallery.length})
          </TabsTrigger>
        </TabsList>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setIsAchModalOpen(true)} className="font-bold text-xs h-8 gap-1.5 shadow-2xs">
              <Plus className="h-3.5 w-3.5" /> Add Achievement
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <Card key={ach.id} className="border shadow-2xs p-4 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      {ach.organization || "College Recognition"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {ach.awardDate ? new Date(ach.awardDate).toLocaleDateString() : ""}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{ach.title}</h4>
                    {ach.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{ach.description}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 text-[11px]">Showcased on Profile</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => ach.id && handleDeleteAchievement(ach.id)}
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}

            {achievements.length === 0 && !isLoading && (
              <div className="md:col-span-3 p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
                <Award className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="font-bold text-sm">No achievements posted yet</div>
                <p>Click "Add Achievement" to showcase hackathon prizes and awards.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* GALLERY TAB */}
        <TabsContent value="gallery" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setIsGalModalOpen(true)} className="font-bold text-xs h-8 gap-1.5 shadow-2xs">
              <Plus className="h-3.5 w-3.5" /> Upload Photo
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden border bg-card shadow-2xs">
                <div className="h-36 w-full bg-muted overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2.5 space-y-1">
                  <div className="font-bold text-xs text-foreground truncate">{item.title}</div>
                  {item.caption && <div className="text-[10px] text-muted-foreground truncate">{item.caption}</div>}
                  <div className="flex items-center justify-between pt-1">
                    <Badge variant="outline" className="text-[9px] font-bold">{item.eventTag || "General"}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => item.id && handleDeleteGallery(item.id)}
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {gallery.length === 0 && !isLoading && (
              <div className="col-span-full p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
                <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="font-bold text-sm">No media gallery photos yet</div>
                <p>Click "Upload Photo" to curate memories from workshops and summits.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Achievement Modal */}
      <Dialog open={isAchModalOpen} onOpenChange={setIsAchModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">Add Club Achievement</DialogTitle>
            <DialogDescription className="text-xs">Showcase an official recognition or victory</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Achievement Title *</Label>
              <Input
                value={achTitle}
                onChange={(e) => setAchTitle(e.target.value)}
                placeholder="e.g. 1st Place - Smart India Hackathon 2025"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Conferring Organization / Contest</Label>
              <Input
                value={achOrg}
                onChange={(e) => setAchOrg(e.target.value)}
                placeholder="Ministry of Education / IEEE / CSI..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Award Date</Label>
              <Input
                type="date"
                value={achDate}
                onChange={(e) => setAchDate(e.target.value)}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Short Description</Label>
              <Textarea
                value={achDesc}
                onChange={(e) => setAchDesc(e.target.value)}
                placeholder="Brief summary of solution and team members..."
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAchModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveAchievement} className="font-bold text-xs">Save Achievement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Modal */}
      <Dialog open={isGalModalOpen} onOpenChange={setIsGalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">Add Photo to Gallery</DialogTitle>
            <DialogDescription className="text-xs">Provide a high-res image URL and event caption</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Photo Title *</Label>
              <Input
                value={galTitle}
                onChange={(e) => setGalTitle(e.target.value)}
                placeholder="e.g. Hack360 Team Hacking Session"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Image URL *</Label>
              <Input
                value={galUrl}
                onChange={(e) => setGalUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Event Tag</Label>
              <Input
                value={galTag}
                onChange={(e) => setGalTag(e.target.value)}
                placeholder="e.g. Hack360, Workshop, Induction"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Caption / Alt Description</Label>
              <Input
                value={galCaption}
                onChange={(e) => setGalCaption(e.target.value)}
                placeholder="Describe the moment in one sentence..."
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsGalModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveGallery} className="font-bold text-xs">Upload to Gallery</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
