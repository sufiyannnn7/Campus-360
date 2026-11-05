/**
 * Image Upload Dropzone Component
 * Campus 360 - NKOCET
 *
 * Supports drag-and-drop, device file picking, automatic client-side canvas compression,
 * and deterministic Supabase Storage replacement (upsert) to avoid filling storage.
 */

import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, Sparkles, RefreshCw, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { uploadClubImage, formatBytes } from "@/lib/storage";

export interface ImageUploadDropzoneProps {
  value?: string;
  onChange: (url: string) => void;
  clubId?: number | string;
  assetType?: "banner" | "logo";
  tempId?: string;
  aspect?: "banner" | "square";
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function ImageUploadDropzone({
  value,
  onChange,
  clubId,
  assetType = "banner",
  tempId,
  aspect = "banner",
  label,
  description,
  className = "",
  disabled = false,
}: ImageUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalSize: number;
    compressedSize: number;
    reductionPercent: number;
  } | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP, SVG)");
      return;
    }

    // Limit maximum upload size before compression to 15MB
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is too large. Please select an image under 15 MB.");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await uploadClubImage({
        file,
        clubId,
        assetType,
        tempId,
        compress: true,
      });

      onChange(result.url);
      setManualUrl(result.url);

      if (result.stats && result.stats.reductionPercent > 0) {
        setCompressionStats(result.stats);
        toast.success(
          `Compressed ${formatBytes(result.stats.originalSize)} → ${formatBytes(
            result.stats.compressedSize
          )} (-${result.stats.reductionPercent}%) & saved!`
        );
      } else {
        toast.success("Image uploaded successfully!");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Failed to process and upload image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleProcessFile(files[0]);
      }
    },
    [disabled, clubId, assetType, tempId]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleProcessFile(files[0]);
    }
    // Reset file input so re-selecting same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setManualUrl("");
    setCompressionStats(null);
  };

  const handleApplyUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setCompressionStats(null);
      toast.success("Image URL updated");
    }
  };

  const isSquare = aspect === "square";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground">{label}</label>
          {compressionStats && (
            <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Sparkles className="h-2.5 w-2.5" /> -{compressionStats.reductionPercent}% saved
            </Badge>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        disabled={disabled || isProcessing}
      />

      {/* Upload Box / Preview */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => {
          if (!disabled && !isProcessing) fileInputRef.current?.click();
        }}
        className={`relative group rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center text-center select-none ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40"
        } ${
          isSquare
            ? "h-28 w-28 mx-auto"
            : "h-32 w-full"
        }`}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center p-3 gap-1.5">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
            <span className="text-xs font-semibold text-primary">Compressing & saving...</span>
            <span className="text-[10px] text-muted-foreground">Replacing storage asset</span>
          </div>
        ) : value ? (
          <>
            {/* Live Preview */}
            <img
              src={value}
              alt="Uploaded preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                // Handle broken URL fallback
                (e.target as HTMLElement).style.display = "none";
              }}
            />

            {/* Hover overlay with Replace / Clear buttons */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 px-2 text-[11px] font-bold gap-1 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <RefreshCw className="h-3 w-3" /> Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-7 w-7 p-0 shadow-sm"
                onClick={handleClear}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="p-3 flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <UploadCloud className="h-4 w-4" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">
                Drag & drop or <span className="text-primary underline">browse</span>
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isSquare ? "1:1 Square (Max 5MB)" : "16:9 Banner (Auto-compressed)"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* URL Fallback Option */}
      <div className="flex items-center justify-between text-[11px] pt-0.5">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors font-medium cursor-pointer"
        >
          <LinkIcon className="h-3 w-3" />
          {showUrlInput ? "Hide image URL" : "Or use direct image URL"}
        </button>

        {value && !isProcessing && (
          <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">
            {value.startsWith("data:") ? "Local Compressed Data" : value.split("/").pop()?.split("?")[0]}
          </span>
        )}
      </div>

      {showUrlInput && (
        <div className="flex gap-1.5 pt-1">
          <Input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="h-7 text-xs font-mono bg-background"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleApplyUrl}
            className="h-7 text-xs font-semibold px-2.5 shrink-0"
          >
            Apply
          </Button>
        </div>
      )}

      {description && <p className="text-[10px] text-muted-foreground">{description}</p>}
    </div>
  );
}
export default ImageUploadDropzone;

