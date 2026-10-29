import { useGetMyCertificates } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/scroll-reveal";
import { Medal, Download, ExternalLink } from "lucide-react";

export default function Certificates() {
  const { data: certs, isLoading } = useGetMyCertificates();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScrollReveal direction="down" duration={0.4}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
          <p className="text-muted-foreground">Your verified achievements and event participations on Campus 360.</p>
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !certs || certs.length === 0 ? (
        <div className="py-20 text-center border rounded-xl border-dashed">
          <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No certificates yet</h3>
          <p className="text-muted-foreground mt-1">Attend events and complete requirements to earn certificates.</p>
        </div>
      ) : (
        <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-2 gap-6">
          {certs.map((cert: any) => (
            <StaggerItem key={cert.id} className="h-full">
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card className="overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all border-primary/20 bg-card h-full flex flex-col justify-between">
                  <div>
                    <div className="h-3 bg-gradient-to-r from-primary via-teal-500 to-amber-500" />
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Medal className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="font-mono text-xs text-muted-foreground">
                          ID: {cert.verificationCode}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-xl mb-1">{cert.title || cert.eventName || "Campus Certificate"}</h3>
                      <p className="text-muted-foreground text-sm mb-6">
                        Issued on {cert.issueDate || cert.issuedAt ? new Date(cert.issueDate || cert.issuedAt).toLocaleDateString() : "Recent"}
                      </p>

                      <div className="flex items-center gap-3">
                        <Button className="flex-1 gap-2 hover:scale-102 active:scale-98 transition-transform cursor-pointer">
                          <Download className="h-4 w-4" /> Download PDF
                        </Button>
                        <Button variant="outline" size="icon" className="hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}