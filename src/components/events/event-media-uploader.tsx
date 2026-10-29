import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { compressImage } from "@/lib/image-compressor";
import { Upload, X, Image as ImageIcon, Check, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventMediaUploaderProps {
  mainImageUrl: string;
  onMainImageChange: (url: string) => void;
  galleryUrls?: string[];
  onGalleryUrlsChange?: (urls: string[]) => void;
}

export function EventMediaUploader({
  mainImageUrl,
  onMainImageChange,
  galleryUrls = [],
  onGalleryUrlsChange,
}: EventMediaUploaderProps) {
  const { toast } = useToast();
  const [isCompressingMain, setIsCompressingMain] = useState(false);
  const [isCompressingGallery, setIsCompressingGallery] = useState(false);
  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);
  const [mainSizeInfo, setMainSizeInfo] = useState<string | null>(null);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const processMainFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please select an image (JPG, PNG, WebP).",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCompressingMain(true);
      const result = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.78,
      });

      onMainImageChange(result.dataUrl);
      const savedPct = Math.round((1 - result.compressedSize / result.originalSize) * 100);
      setMainSizeInfo(
        `${formatBytes(result.originalSize)} → ${formatBytes(result.compressedSize)} (${savedPct > 0 ? `-${savedPct}%` : "optimized"})`
      );

      toast({
        title: "Image Compressed & Ready",
        description: `Reduced size by ${savedPct}% for fast loading on campus devices.`,
      });
    } catch (err: any) {
      toast({
        title: "Compression Failed",
        description: err.message || "Could not process image.",
        variant: "destructive",
      });
    } finally {
      setIsCompressingMain(false);
    }
  };

  const processGalleryFiles = async (files: FileList | File[]) => {
    if (!onGalleryUrlsChange) return;

    try {
      setIsCompressingGallery(true);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const res = await compressImage(file, {
            maxWidth: 1000,
            maxHeight: 1000,
            quality: 0.75,
          });
          newUrls.push(res.dataUrl);
        }
      }

      onGalleryUrlsChange([...galleryUrls, ...newUrls]);
      toast({
        title: "Gallery Updated",
        description: `Added ${newUrls.length} compressed photo(s) to detailed event post.`,
      });
    } catch (err: any) {
      toast({
        title: "Gallery Upload Failed",
        description: err.message || "Failed to compress gallery images.",
        variant: "destructive",
      });
    } finally {
      setIsCompressingGallery(false);
    }
  };

  const handleRemoveGalleryItem = (index: number) => {
    if (!onGalleryUrlsChange) return;
    const updated = galleryUrls.filter((_, i) => i !== index);
    onGalleryUrlsChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* 1. Event Main Card Banner / Poster */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-foreground">
            Event Main Card Image (Poster / Banner) *
          </Label>
          {mainSizeInfo && (
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {mainSizeInfo}
            </span>
          )}
        </div>

        {/* Drag & Drop Card Container */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingMain(true);
          }}
          onDragLeave={() => setIsDraggingMain(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingMain(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processMainFile(e.dataTransfer.files[0]);
            }
          }}
          className={`relative border-2 border-dashed rounded-xl p-3 transition-colors ${
            isDraggingMain ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          {mainImageUrl ? (
            <div className="relative rounded-lg overflow-hidden border bg-muted/20 aspect-[16/9] max-h-48 group">
              <img
                src={mainImageUrl}
                alt="Main Event Poster"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-8 text-xs font-bold"
                  onClick={() => mainInputRef.current?.click()}
                >
                  Replace Image
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="h-8 text-xs font-bold"
                  onClick={() => {
                    onMainImageChange("");
                    setMainSizeInfo(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => mainInputRef.current?.click()}
              className="py-6 flex flex-col items-center justify-center text-center cursor-pointer space-y-2"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {isCompressingMain ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-foreground">
                  {isCompressingMain
                    ? "Compressing image on client..."
                    : "Drag & drop main poster or click to browse"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  High-res camera & phone photos will be automatically compressed before saving
                </p>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={mainInputRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processMainFile(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Or enter URL */}
        <div className="flex items-center gap-2 pt-1">
          <Input
            placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
            value={mainImageUrl.startsWith("data:") ? "" : mainImageUrl}
            onChange={(e) => {
              onMainImageChange(e.target.value);
              setMainSizeInfo(null);
            }}
            className="h-8 text-xs"
          />
        </div>
      </div>

      {/* 2. Multiple Images for Detailed Post / Event Gallery */}
      {onGalleryUrlsChange && (
        <div className="space-y-1.5 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-bold text-foreground">
              Multiple Images for Detailed Post & Gallery ({galleryUrls.length} added)
            </Label>
            <span className="text-[10px] text-muted-foreground">
              Will appear on the event detail page
            </span>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingGallery(true);
            }}
            onDragLeave={() => setIsDraggingGallery(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingGallery(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                processGalleryFiles(e.dataTransfer.files);
              }
            }}
            className={`border-2 border-dashed rounded-xl p-3 transition-colors ${
              isDraggingGallery ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  Drag and drop multiple photos (schedules, speaker photos, venue maps)
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 text-xs font-semibold gap-1"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isCompressingGallery}
              >
                {isCompressingGallery ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Upload className="h-3 w-3" />
                )}
                Add Photos
              </Button>
            </div>

            <input
              type="file"
              ref={galleryInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  processGalleryFiles(e.target.files);
                }
              }}
            />

            {/* Gallery Thumbnails List */}
            {galleryUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-3 pt-2 border-t">
                {galleryUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg overflow-hidden border bg-muted/20 group"
                  >
                    <img src={url} alt={`Gallery item ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(idx)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      title="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
