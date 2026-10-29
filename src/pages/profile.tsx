import React, { useState, useEffect, useRef } from "react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/context/auth-context";
import { authService } from "@/api/services/auth.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCropperDialog } from "@/components/profile/circle-cropper-dialog";
import {
  Camera,
  Upload,
  Loader2,
  CheckCircle2,
  Shield,
  Building,
  GraduationCap,
  Phone,
  Hash,
  Award,
  Calendar,
} from "lucide-react";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Artificial Intelligence & Data Science (AI & DS)",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

const YEARS = ["FE (First Year)", "SE (Second Year)", "TE (Third Year)", "BE (Final Year)"];

export default function Profile() {
  const { user: authUser, refreshUser } = useAuth();
  const { data: meUser, isLoading } = useGetMe();
  const user = authUser || meUser;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Form Fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [prn, setPrn] = useState("");
  const [division, setDivision] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Circle Cropper State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setDepartment(user.department || "Computer Science & Engineering");
      setYear(user.year || "SE (Second Year)");
      setPrn(user.prn || "");
      setDivision(user.division || "");
      setPhone(user.phone || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  // Handle image selection via file browser or drag-and-drop
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload an image file (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImageSrc(e.target?.result as string);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setAvatarUrl(croppedDataUrl);
    toast({
      title: "Avatar Cropped",
      description: "Profile picture adjusted. Click 'Save Profile' to apply changes.",
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await authService.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
        department,
        year,
        prn: prn.trim(),
        division: division.trim(),
        phone: phone.trim(),
        avatarUrl,
      });

      await refreshUser();
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });

      toast({
        title: "Profile Saved",
        description: "Your academic information has been updated successfully.",
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

  if (isLoading && !user) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-3">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        <p className="text-xs text-muted-foreground font-medium">Loading campus profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in-50 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">Student & Faculty Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your campus credentials, personal records, and avatar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize text-xs font-bold px-3 py-1 border-primary/30 text-primary">
            Role: {user?.role || "student"}
          </Badge>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Info Card */}
        <Card className="md:col-span-1 border shadow-2xs h-fit">
          <CardHeader className="pb-3 text-center">
            <CardTitle className="text-sm font-bold">Profile Picture</CardTitle>
            <CardDescription className="text-xs">Drag and drop or upload below</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer rounded-full p-1.5 transition-all duration-200 ${
                isDraggingOver ? "scale-105 ring-4 ring-primary/40" : "hover:ring-2 hover:ring-primary/20"
              }`}
            >
              <Avatar className="h-32 w-32 rounded-full border-2 border-border shadow-sm">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="text-3xl font-black bg-primary/10 text-primary">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>

              {/* Hover overlay with crop badge */}
              <div className="absolute inset-1.5 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-2xs">
                <Camera className="h-6 w-6 mb-1" />
                <span className="text-[10px] font-bold">Change / Crop</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="text-center space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold gap-1.5 h-8"
              >
                <Upload className="h-3.5 w-3.5" /> Upload & Circle Crop
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Drop image here or click to crop circle avatar
              </p>
            </div>

            <div className="w-full border-t pt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Account Status</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Verified Member
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Total Points</span>
                <span className="font-bold text-foreground">{user?.points || user?.totalPoints || 0} pts</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Events Attended</span>
                <span className="font-bold text-foreground">{user?.eventsAttended || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Academic Details Form */}
        <Card className="md:col-span-2 border shadow-2xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Academic & Personal Information</CardTitle>
            <CardDescription className="text-xs">
              Official collegiate identifiers used across club memberships and certificates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold">Campus Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="h-9 text-xs bg-muted/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="prn" className="text-xs font-bold">PRN Number *</Label>
                <Input
                  id="prn"
                  placeholder="e.g. 2024BCSE042"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-xs font-bold">Department *</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department" className="h-9 text-xs">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept} className="text-xs">
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="year" className="text-xs font-bold">Year of Study</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year" className="h-9 text-xs">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={y} className="text-xs">
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="division" className="text-xs font-bold">Division / Batch</Label>
                <Input
                  id="division"
                  placeholder="e.g. Div A / B2"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-xs font-bold">Bio & Interests</Label>
              <Textarea
                id="bio"
                rows={3}
                placeholder="Brief summary of your academic interests, coding stacks, or club roles..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="text-xs resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="text-xs font-bold h-9 px-5 gap-1.5 cursor-pointer shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Profile Changes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Circle Cropper Modal */}
      <CircleCropperDialog
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={selectedImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
