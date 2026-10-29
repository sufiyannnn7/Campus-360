/**
 * Club Events Management
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Schedule club workshops, hackathons, guest lectures, and manage registrations.
 */

import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Users,
  Eye,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EventMediaUploader } from "@/components/events/event-media-uploader";
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

export default function CoordinatorEvents() {
  const { activeClub } = useCoordinator();
  const { toast } = useToast();

  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Technical");
  const [startDatetime, setStartDatetime] = useState("");
  const [endDatetime, setEndDatetime] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState(100);
  const [mode, setMode] = useState("offline");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  const loadEvents = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const data = await coordinatorService.getClubEvents(activeClub.id);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [activeClub]);

  const handleOpenModal = (event?: any) => {
    if (event) {
      setEditingEvent(event);
      setTitle(event.title);
      setTagline(event.tagline || "");
      setDescription(event.description || "");
      setCategory(event.category || "Technical");
      setStartDatetime(event.startDatetime ? event.startDatetime.slice(0, 16) : "");
      setEndDatetime(event.endDatetime ? event.endDatetime.slice(0, 16) : "");
      setVenue(event.venue || "Computer Lab A");
      setCapacity(event.capacity || 100);
      setMode(event.mode || "offline");
      setImageUrl(event.imageUrl || event.bannerUrl || "");
      setGalleryUrls(event.galleryUrls || []);
    } else {
      setEditingEvent(null);
      setTitle("");
      setTagline("");
      setDescription("");
      setCategory("Technical");
      const defaultStart = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16);
      setStartDatetime(defaultStart);
      setEndDatetime("");
      setVenue("Computer Lab A, IT Block");
      setCapacity(60);
      setMode("offline");
      setImageUrl("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80");
      setGalleryUrls([]);
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!activeClub || !title.trim() || !startDatetime) {
      toast({ title: "Validation Error", description: "Title and start date-time are required.", variant: "destructive" });
      return;
    }

    try {
      await coordinatorService.saveClubEvent(activeClub.id, {
        id: editingEvent?.id,
        title: title.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        category,
        startDatetime: new Date(startDatetime).toISOString(),
        endDatetime: endDatetime ? new Date(endDatetime).toISOString() : null,
        capacity,
        venue,
        mode,
        imageUrl: imageUrl.trim() || undefined,
        bannerUrl: imageUrl.trim() || undefined,
        galleryUrls,
      });

      await loadEvents();
      setIsModalOpen(false);

      toast({
        title: editingEvent ? "Event Updated" : "Event Scheduled",
        description: `Event "${title}" has been published to Campus 360 calendar.`,
      });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!activeClub) return;
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await coordinatorService.deleteClubEvent(activeClub.id, eventId);
      toast({ title: "Event Deleted", description: "The event has been removed." });
      await loadEvents();
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
          <h2 className="text-2xl font-black tracking-tight text-foreground">Club Events & Workshops</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Schedule workshops, competitions, webinars, and check registrations for {activeClub.name}.
          </p>
        </div>

        <Button size="sm" onClick={() => handleOpenModal()} className="font-bold text-xs h-9 gap-1.5 shadow-2xs">
          <Plus className="h-4 w-4" /> Create Club Event
        </Button>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => (
          <Card key={e.id} className="border shadow-2xs p-4 flex flex-col justify-between space-y-3">
            {e.imageUrl && (
              <div className="h-28 w-full rounded-xl overflow-hidden border bg-muted/20">
                <img src={e.imageUrl} alt={e.title} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {e.category}
                </Badge>
                <Badge
                  className={
                    e.status === "upcoming"
                      ? "bg-emerald-600 text-white text-[10px] capitalize"
                      : "bg-muted text-muted-foreground text-[10px] capitalize"
                  }
                >
                  {e.status}
                </Badge>
              </div>

              <div>
                <h4 className="font-extrabold text-sm text-foreground">{e.title}</h4>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>{new Date(e.startDatetime).toLocaleString()}</span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{e.venue || "Campus Venue"}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t flex items-center justify-between text-xs">
              <span className="font-bold text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {e.registeredCount} / {e.capacity} Registered
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenModal(e)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Edit Event"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEvent(e.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
                <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Link href={`/events/${e.id}`} target="_blank">
                    <Eye className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {events.length === 0 && !isLoading && (
          <div className="md:col-span-3 p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="font-bold text-sm">No events scheduled yet</div>
            <p>Click "Create Club Event" to host bootcamps, hackathons, or talks.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">
              {editingEvent ? "Edit Club Event" : "Create Club Event"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Published events will automatically appear on Campus 360 calendar and the club page.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Event Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hack360 24-Hour Hackathon"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Category</Label>
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Workshop, Technical, Cultural..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">Max Capacity</Label>
                <Input
                  type="number"
                  min={10}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Start Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={startDatetime}
                  onChange={(e) => setStartDatetime(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold">End Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={endDatetime}
                  onChange={(e) => setEndDatetime(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Venue / Room</Label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Main Seminar Hall, IT Block"
                className="h-9 text-xs"
              />
            </div>

            <EventMediaUploader
              mainImageUrl={imageUrl}
              onMainImageChange={setImageUrl}
              galleryUrls={galleryUrls}
              onGalleryUrlsChange={setGalleryUrls}
            />

            <div className="space-y-1">
              <Label className="text-xs font-bold">Description & Agenda</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed event description, prerequisites, schedule..."
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} className="font-bold text-xs">Publish Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
