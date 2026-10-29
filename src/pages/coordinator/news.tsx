/**
 * Club News & Announcements
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Publish verified club bulletins, victory reports, recruitment announcements, and circulars.
 */

import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Newspaper,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  Eye,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorNews() {
  const { activeClub } = useCoordinator();
  const { toast } = useToast();

  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General Announcement");
  const [imageUrl, setImageUrl] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  const loadNews = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const data = await coordinatorService.getClubNews(activeClub.id);
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [activeClub]);

  const handleOpenModal = (art?: any) => {
    if (art) {
      setEditingArticle(art);
      setTitle(art.title);
      setSummary(art.summary || "");
      setContent(art.content || "");
      setCategory(art.category || "General Announcement");
      setImageUrl(art.imageUrl || "");
      setIsImportant(art.isImportant ?? false);
      setIsPublished(art.isPublished ?? true);
    } else {
      setEditingArticle(null);
      setTitle("");
      setSummary("");
      setContent("");
      setCategory("General Announcement");
      setImageUrl("");
      setIsImportant(false);
      setIsPublished(true);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!activeClub || !title.trim() || !summary.trim()) {
      toast({ title: "Validation Error", description: "Title and summary are required.", variant: "destructive" });
      return;
    }

    try {
      await coordinatorService.saveClubNews(activeClub.id, {
        id: editingArticle?.id,
        title: title.trim(),
        summary: summary.trim(),
        content: content.trim(),
        category,
        imageUrl: imageUrl.trim() || null,
        isImportant,
        isPublished,
      });

      await loadNews();
      setIsModalOpen(false);

      toast({
        title: editingArticle ? "Article Updated" : "Article Published",
        description: `Announcement "${title}" is live on Campus 360 news.`,
      });
    } catch (err: any) {
      toast({ title: "Publish Failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!activeClub) return;
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await coordinatorService.deleteClubNews(activeClub.id, id);
      toast({ title: "Article Deleted", description: "Announcement removed from news feed." });
      await loadNews();
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err?.message, variant: "destructive" });
    }
  };

  if (!activeClub) return <div>No active club selected.</div>;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">News & Announcements</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Publish circulars, contest achievements, recruitment results, and official bulletins for {activeClub.name}.
          </p>
        </div>

        <Button size="sm" onClick={() => handleOpenModal()} className="font-bold text-xs h-9 gap-1.5 shadow-2xs">
          <Plus className="h-4 w-4" /> Publish Announcement
        </Button>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((art) => (
          <Card key={art.id} className="border shadow-2xs p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {art.category}
                </Badge>
                {art.isImportant && (
                  <Badge className="bg-amber-500 text-white text-[10px] font-bold">
                    Important
                  </Badge>
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-foreground">{art.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{art.summary}</p>
              </div>

              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(art.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <span className={art.isPublished ? "font-bold text-emerald-600" : "font-bold text-muted-foreground"}>
                {art.isPublished ? "Published" : "Draft"}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenModal(art)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteArticle(art.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Link href={`/news/${art.id}`} target="_blank">
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {articles.length === 0 && !isLoading && (
          <div className="md:col-span-3 p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
            <Newspaper className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="font-bold text-sm">No announcements posted yet</div>
            <p>Click "Publish Announcement" to share updates with the student body.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">
              {editingArticle ? "Edit Announcement" : "Publish Announcement"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Broadcast circulars and news connected with your club.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Headline / Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NKOCET Teams Win Top Honors at Hackathon"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="General Announcement, Achievement, Recruitment, Workshop..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Short Summary *</Label>
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary displayed on news cards..."
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Full Article Content</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed article body, winner names, instructions..."
                rows={4}
                className="text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Cover Image URL (optional)</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="space-y-0.5">
                <div className="text-xs font-bold">Pin / Mark as Important</div>
                <div className="text-[11px] text-muted-foreground">Highlights with a badge on the campus news feed</div>
              </div>
              <Switch checked={isImportant} onCheckedChange={setIsImportant} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="space-y-0.5">
                <div className="text-xs font-bold">Publish Immediately</div>
                <div className="text-[11px] text-muted-foreground">Make visible on campus news without drafting</div>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} className="font-bold text-xs">Save & Broadcast</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
