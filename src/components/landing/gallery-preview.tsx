import { useState } from "react";
import { GALLERY_PHOTOS_DATA, GalleryPhotoItem } from "@/data/landing-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, Maximize2, Sparkles, X, Calendar, Tag } from "lucide-react";

export function GalleryPreview() {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhotoItem | null>(null);

  return (
    <section className="py-16 md:py-24 bg-background border-b">
      <div className="container mx-auto max-w-7xl px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Camera className="h-3.5 w-3.5" />
            <span>Campus Memories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Campus Life Photo Gallery
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Highlights from hackathons, cultural festivals, sports tournaments, and student workshops.
          </p>
        </div>

        {/* Responsive Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_PHOTOS_DATA.map((photo: GalleryPhotoItem) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border bg-muted cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Photo Image */}
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Content Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur border-none text-xs font-medium">
                    {photo.category}
                  </Badge>
                  
                  <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-bold text-base sm:text-lg text-white leading-snug">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-light">
                    {photo.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-card border">
            {selectedPhoto && (
              <div className="flex flex-col">
                {/* Lightbox Image View */}
                <div className="relative aspect-[16/10] bg-black flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className="max-h-[70vh] w-full object-contain"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-black/60 backdrop-blur text-white text-xs font-medium">
                      {selectedPhoto.category}
                    </Badge>
                  </div>
                </div>

                {/* Lightbox Details Bar */}
                <div className="p-6 space-y-3 bg-card">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground">
                      {selectedPhoto.title}
                    </h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {selectedPhoto.date}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedPhoto.caption}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </section>
  );
}
