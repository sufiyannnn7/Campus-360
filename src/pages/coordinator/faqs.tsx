/**
 * Club FAQs & Official Contact
 * Campus 360 - NKOCET, Team NEXUS
 *
 * Manage student questions regarding membership, workshops, and official channels.
 */

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Plus,
  Trash2,
  Mail,
  Compass,
  Edit2,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { ClubFaqItem } from "@/types/coordinator";
import { useToast } from "@/hooks/use-toast";

export default function CoordinatorFaqs() {
  const { activeClub } = useCoordinator();
  const { toast } = useToast();

  const [faqs, setFaqs] = useState<ClubFaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<ClubFaqItem> | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("Membership");

  const loadFaqs = async () => {
    if (!activeClub) return;
    setIsLoading(true);
    try {
      const data = await coordinatorService.getFaqs(activeClub.id);
      setFaqs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, [activeClub]);

  const handleOpenModal = (faq?: ClubFaqItem) => {
    if (faq) {
      setEditingFaq(faq);
      setQuestion(faq.question);
      setAnswer(faq.answer);
      setCategory(faq.category || "Membership");
    } else {
      setEditingFaq(null);
      setQuestion("");
      setAnswer("");
      setCategory("Membership");
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!activeClub || !question.trim() || !answer.trim()) {
      toast({ title: "Validation Error", description: "Question and answer are required.", variant: "destructive" });
      return;
    }

    try {
      await coordinatorService.saveFaq(activeClub.id, {
        id: editingFaq?.id,
        question: question.trim(),
        answer: answer.trim(),
        category,
        displayOrder: faqs.length + 1,
        isPublished: true,
      });

      await loadFaqs();
      setIsModalOpen(false);

      toast({
        title: editingFaq ? "FAQ Updated" : "FAQ Added",
        description: "Published to public club FAQ accordion.",
      });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err?.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!activeClub) return;
    try {
      await coordinatorService.deleteFaq(activeClub.id, id);
      await loadFaqs();
      toast({ title: "Deleted", description: "FAQ removed." });
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
          <h2 className="text-2xl font-black tracking-tight text-foreground">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground font-medium">
            Answer recurring student questions about membership eligibility, prerequisites, and activities.
          </p>
        </div>

        <Button size="sm" onClick={() => handleOpenModal()} className="font-bold text-xs h-9 gap-1.5 shadow-2xs">
          <Plus className="h-4 w-4" /> Add FAQ Item
        </Button>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((faq) => (
          <Card key={faq.id} className="border shadow-2xs p-4 flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {faq.category}
                </Badge>
                <h4 className="font-extrabold text-sm text-foreground">{faq.question}</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-1">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenModal(faq)}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => faq.id && handleDelete(faq.id)}
                className="h-7 w-7 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}

        {faqs.length === 0 && !isLoading && (
          <div className="p-8 border rounded-2xl border-dashed text-center text-xs text-muted-foreground space-y-2">
            <HelpCircle className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="font-bold text-sm">No FAQs configured yet</div>
            <p>Click "Add FAQ Item" to resolve common student queries.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold">
              {editingFaq ? "Edit FAQ Item" : "Add FAQ Item"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Displayed in the public club detail page accordion.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Category</Label>
              <Input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Membership, Eligibility, Meetings, Events..."
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Question *</Label>
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Do I need prior coding knowledge to join?"
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Answer *</Label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Clear and welcoming response for students..."
                rows={4}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave} className="font-bold text-xs">Save FAQ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
