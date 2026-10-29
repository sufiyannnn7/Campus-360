import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-xl rounded-3xl overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-primary via-blue-500 to-indigo-500" />
        <CardContent className="pt-8 pb-8 px-6 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            <Compass className="h-8 w-8 animate-pulse" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-black tracking-widest text-primary uppercase">Error 404</span>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              Page Not Found
            </h1>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            The campus module or page you are looking for doesn't exist, has been moved, or is temporarily offline.
          </p>

          <div className="pt-2">
            <Link href="/">
              <Button size="sm" className="font-bold text-xs gap-2 shadow-sm">
                <Home className="h-3.5 w-3.5" /> Return to Campus Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
