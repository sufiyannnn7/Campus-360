import { Link } from "wouter";
import { LANDING_STATS } from "@/data/landing-data";
import { Calendar, Users, GraduationCap, Award, ArrowUpRight } from "lucide-react";

const STAT_ICONS = [Calendar, Users, GraduationCap, Award];
const STAT_COLORS = [
  "text-indigo-600 bg-indigo-500/10 border-indigo-200 dark:border-indigo-900/50",
  "text-teal-600 bg-teal-500/10 border-teal-200 dark:border-teal-900/50",
  "text-blue-600 bg-blue-500/10 border-blue-200 dark:border-blue-900/50",
  "text-amber-600 bg-amber-500/10 border-amber-200 dark:border-amber-900/50",
];

export function Stats() {
  return (
    <section className="py-4 bg-muted/30 border-b">
      <div className="container mx-auto max-w-7xl px-4">
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {LANDING_STATS.map((stat, idx) => {
            const Icon = STAT_ICONS[idx % STAT_ICONS.length];
            const colorStyle = STAT_COLORS[idx % STAT_COLORS.length];

            return (
              <Link key={stat.label} href={stat.href || "/events"}>
                <div className="relative rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all group overflow-hidden cursor-pointer h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                        {stat.label}
                      </span>
                      <div className={`p-2 rounded-xl border ${colorStyle} transition-transform group-hover:scale-110 flex items-center gap-1`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-3xl sm:text-4xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {stat.value}
                      </div>
                      <p className="text-xs text-muted-foreground font-medium leading-relaxed line-clamp-1">
                        {stat.description}
                      </p>
                    </div>
                  </div>

                  {stat.change && (
                    <div className="mt-3 pt-2 border-t border-border/50 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                      <span className="truncate">{stat.change}</span>
                      <span className="text-primary font-black text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0">View →</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
