import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { compressImage } from "@/lib/image-compressor";
import { ZoomIn, ZoomOut, RotateCcw, Check, Move } from "lucide-react";

interface CircleCropperDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedDataUrl: string) => void;
}

export function CircleCropperDialog({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
}: CircleCropperDialogProps) {
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [baseDim, setBaseDim] = useState<{ width: number; height: number }>({ width: 250, height: 250 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const PREVIEW_CIRCLE_SIZE = 250;

  // Compute initial cover dimensions whenever an image loads
  const handleImageLoaded = () => {
    if (!imgRef.current) return;
    const nw = imgRef.current.naturalWidth || PREVIEW_CIRCLE_SIZE;
    const nh = imgRef.current.naturalHeight || PREVIEW_CIRCLE_SIZE;

    // Scale so the smaller dimension fits PREVIEW_CIRCLE_SIZE (cover mode)
    const minSide = Math.min(nw, nh);
    const fitFactor = PREVIEW_CIRCLE_SIZE / minSide;

    setBaseDim({
      width: Math.round(nw * fitFactor),
      height: Math.round(nh * fitFactor),
    });
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = async () => {
    if (!imgRef.current) return;
    try {
      setIsProcessing(true);
      const CROP_SIZE = 360; // Output dimension for avatar
      const canvas = document.createElement("canvas");
      canvas.width = CROP_SIZE;
      canvas.height = CROP_SIZE;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      const img = imgRef.current;
      const ratio = CROP_SIZE / PREVIEW_CIRCLE_SIZE;

      // Draw background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, CROP_SIZE, CROP_SIZE);

      // Save canvas state
      ctx.save();
      // Move to center of canvas
      ctx.translate(CROP_SIZE / 2, CROP_SIZE / 2);

      // Calculate rendered dimensions
      const drawWidth = baseDim.width * ratio * scale;
      const drawHeight = baseDim.height * ratio * scale;
      const drawX = -drawWidth / 2 + offset.x * ratio;
      const drawY = -drawHeight / 2 + offset.y * ratio;

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();

      // Compress and export
      canvas.toBlob(
        async (blob) => {
          if (!blob) return;
          try {
            const compressed = await compressImage(blob, {
              maxWidth: 400,
              maxHeight: 400,
              quality: 0.82,
            });
            onCropComplete(compressed.dataUrl);
            onClose();
          } catch {
            onCropComplete(canvas.toDataURL("image/jpeg", 0.85));
            onClose();
          } finally {
            setIsProcessing(false);
          }
        },
        "image/jpeg",
        0.88
      );
    } catch (e) {
      console.error("Crop error:", e);
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Crop Profile Picture</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Drag photo to center and adjust zoom. The circle shows your exact avatar.
          </DialogDescription>
        </DialogHeader>

        {/* Viewport Container */}
        <div className="flex flex-col items-center justify-center py-3">
          <div
            ref={containerRef}
            className="relative w-[250px] h-[250px] rounded-full overflow-hidden border-2 border-primary shadow-inner bg-slate-900 cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {imageSrc && (
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                onLoad={handleImageLoaded}
                draggable={false}
                className="absolute pointer-events-none origin-center"
                style={{
                  width: `${baseDim.width}px`,
                  height: `${baseDim.height}px`,
                  maxWidth: "none",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                }}
              />
            )}

            {/* Circular overlay border guide */}
            <div className="absolute inset-0 rounded-full border-[3px] border-white/70 pointer-events-none ring-1 ring-black/20" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] text-white flex items-center gap-1 pointer-events-none backdrop-blur-xs font-semibold">
              <Move className="h-2.5 w-2.5" /> Drag to adjust
            </div>
          </div>

          {/* Zoom controls */}
          <div className="w-full max-w-[280px] mt-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <ZoomOut className="h-3.5 w-3.5" /> Zoom Level
              </span>
              <span className="font-bold text-foreground">{Math.round(scale * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <Slider
                value={[scale]}
                min={0.8}
                max={2.5}
                step={0.05}
                onValueChange={(val) => setScale(val[0])}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setScale(1);
                  setOffset({ x: 0, y: 0 });
                }}
                title="Reset zoom and position"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleCrop}
            disabled={isProcessing || !imageSrc}
            className="gap-1.5 font-bold"
          >
            <Check className="h-3.5 w-3.5" />
            {isProcessing ? "Processing..." : "Apply & Crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
