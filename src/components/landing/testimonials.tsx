import { useState, useEffect } from "react";
import { TESTIMONIALS_DATA, TestimonialItem } from "@/data/landing-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, Star, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  // Auto-advance testimonial every 6 seconds
  useEffect(() => {
    const timer = setInterval(nextTestimonial, 6000);
    return () => clearInterval(timer);
  }, []);

  const current = TESTIMONIALS_DATA[activeIndex];

  return (
    <section className="py-16 md:py-24 bg-muted/20 border-b relative overflow-hidden">
      <div className="container mx-auto max-w-5xl px-4 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            <span>Community Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Loved by Students, Faculty & Clubs
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            See how CampusHub simplifies campus life for thousands of active users every day.
          </p>
        </div>

        {/* Testimonial Showcase Card */}
        <Card className="relative border shadow-xl bg-card/90 backdrop-blur overflow-hidden p-8 sm:p-12">
          
          <div className="absolute top-6 right-8 text-primary/10 pointer-events-none">
            <Quote className="h-32 w-32" />
          </div>

          <CardContent className="p-0 space-y-8 relative z-10">
            
            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote Body */}
            <blockquote className="text-lg sm:text-2xl font-medium text-foreground leading-relaxed italic">
              "{current.quote}"
            </blockquote>

            {/* Author Profile */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="flex items-center gap-4">
                <img
                  src={current.avatarUrl}
                  alt={current.name}
                  className="h-12 w-12 rounded-full border-2 border-primary bg-muted p-0.5 object-cover"
                />
                <div>
                  <h4 className="font-bold text-base text-foreground">{current.name}</h4>
                  <p className="text-xs text-muted-foreground font-medium">{current.role} • {current.department}</p>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={prevTestimonial}
                  className="h-9 w-9 rounded-full"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={nextTestimonial}
                  className="h-9 w-9 rounded-full"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

          </CardContent>

        </Card>

        {/* Carousel Indicators */}
        <div className="flex justify-center items-center gap-2">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`h-2.5 rounded-full transition-all ${
                activeIndex === idx ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
