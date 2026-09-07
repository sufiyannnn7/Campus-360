import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { TESTIMONIALS_DATA } from "@/data/landing-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeadingReveal } from "@/components/ui/scroll-reveal";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const next = () => setActiveIndex((p) => (p + 1) % TESTIMONIALS_DATA.length);
  const prev = () => setActiveIndex((p) => (p - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);

  useEffect(() => {
    const t = setInterval(next, 6500);
    return () => clearInterval(t);
  }, []);

  const current = TESTIMONIALS_DATA[activeIndex];

  return (
    <section className="py-20 md:py-28 border-b relative overflow-hidden" ref={ref}>
      {/* Background warm gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-accent/6 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 space-y-14 relative z-10">

        <HeadingReveal
          badge="Community Feedback"
          badgeIcon={<Quote className="h-3.5 w-3.5" />}
          title="Loved by Students, Faculty & Clubs"
          subtitle="See how Campus 360 simplifies campus life for thousands of active users every day."
          centered
        />

        {/* Main testimonial card — slides in from below */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="relative border border-border/60 shadow-xl bg-card/90 backdrop-blur-sm overflow-hidden">

            {/* Giant quote watermark */}
            <div className="absolute top-4 right-6 text-primary/6 pointer-events-none select-none">
              <Quote className="h-36 w-36" />
            </div>

            <CardContent className="p-8 sm:p-12 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, x: 28, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -28, filter: "blur(4px)" }}
                  transition={{ duration: 0.42, ease: "easeOut" }}
                  className="space-y-7"
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.07, type: "spring", stiffness: 320 }}
                      >
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote text */}
                  <blockquote
                    className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed"
                    style={{ fontFamily: 'var(--font-serif, serif)', fontStyle: 'italic' }}
                  >
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>

                  {/* Author + nav */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-4">
                      <img
                        src={current.avatarUrl}
                        alt={current.name}
                        className="h-12 w-12 rounded-full border-2 border-primary/30 object-cover ring-2 ring-background"
                      />
                      <div>
                        <h4 className="font-bold text-base text-foreground">{current.name}</h4>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">{current.role} · {current.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={prev}
                        className="h-9 w-9 rounded-full hover:scale-105 active:scale-95 transition-all border-border/60 hover:border-primary/40 hover:bg-primary/6"
                        aria-label="Previous testimonial"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={next}
                        className="h-9 w-9 rounded-full hover:scale-105 active:scale-95 transition-all border-border/60 hover:border-primary/40 hover:bg-primary/6"
                        aria-label="Next testimonial"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-2">
          {TESTIMONIALS_DATA.map((_, idx) => (
            <motion.button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              animate={{ width: activeIndex === idx ? 28 : 8, opacity: activeIndex === idx ? 1 : 0.4 }}
              transition={{ duration: 0.3 }}
              className={`h-2 rounded-full cursor-pointer ${activeIndex === idx ? "bg-primary" : "bg-muted-foreground/40"}`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
