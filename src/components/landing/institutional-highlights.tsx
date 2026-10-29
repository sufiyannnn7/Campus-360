import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeadingReveal } from "@/components/ui/scroll-reveal";
import { Award, Building, Users, ShieldCheck, CheckCircle2 } from "lucide-react";

export function InstitutionalHighlights() {
  const achievements = [
    {
      title: "Smart India Hackathon (SIH) 2025",
      subtitle: "National Finalists & Category Winners",
      description: "Student development squads from NKOCET Computer Science & IT represented the institute in national software problem statements.",
      tag: "Technical Excellence",
    },
    {
      title: "IIT Bombay e-Yantra Robotics Lab",
      subtitle: "Designated Nodal Resource Center",
      description: "Dedicated embedded systems and drone engineering lab conducting hands-on autonomous vehicle workshops every semester.",
      tag: "Applied Engineering",
    },
    {
      title: "Student Startup Incubation Cell",
      subtitle: "22 Student Startups Incubated",
      description: "Active mentorship by alumni founders and faculty coordinators supporting patent filings and venture seed grants.",
      tag: "Entrepreneurship",
    },
  ];

  return (
    <section className="py-16 md:py-24 border-b bg-card/40">
      <div className="container mx-auto max-w-6xl px-4 space-y-12">
        <HeadingReveal
          badge="Campus Governance & Milestones"
          badgeIcon={<ShieldCheck className="h-3.5 w-3.5 text-primary" />}
          title="Collegiate Excellence at NKOCET"
          subtitle="Authentic academic societies, departmental laboratories, and verified student achievements powering Campus 360."
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {achievements.map((item, idx) => (
            <Card key={idx} className="border shadow-2xs hover:border-primary/40 transition-colors bg-card">
              <CardContent className="p-6 space-y-3">
                <Badge variant="secondary" className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {item.tag}
                </Badge>
                <h3 className="font-extrabold text-base text-foreground leading-snug">{item.title}</h3>
                <p className="text-xs font-semibold text-primary">{item.subtitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-4 rounded-xl border bg-muted/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>N. K. Orchid College of Engineering & Technology, Solapur • Approved by AICTE & DTE Maharashtra</span>
          </div>
          <span className="font-bold text-foreground">Accredited by NAAC with Grade 'A'</span>
        </div>
      </div>
    </section>
  );
}

export default InstitutionalHighlights;
