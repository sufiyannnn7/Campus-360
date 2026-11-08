import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StaggerContainer, StaggerItem, ScrollReveal } from "@/components/ui/scroll-reveal";
import {
  Award,
  Medal,
  Download,
  ExternalLink,
  Eye,
  ShieldCheck,
  AlertCircle,
  Building2,
  Calendar,
} from "lucide-react";
import { certificatesService } from "@/api/services/certificates.service";
import { Certificate } from "@/types/certificates";
import { CertificateTemplate } from "@/components/certificates/certificate-template";

export default function Certificates() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchCerts = async () => {
      setIsLoading(true);
      try {
        const data = await certificatesService.listCertificates();
        if (isMounted) setCerts(data);
      } catch (err) {
        console.warn("Error fetching certificates:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchCerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownloadPdf = (cert: Certificate) => {
    setSelectedCert(cert);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <ScrollReveal direction="down" duration={0.4}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">My Certificates</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Your official, cryptographically verified credentials and achievements on Campus 360.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="w-fit text-xs gap-1.5">
            <Link href="/certificates/verify/SAMPLE">
              <ShieldCheck className="h-4 w-4 text-primary" /> Certificate Verifier
            </Link>
          </Button>
        </div>
      </ScrollReveal>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-56 bg-muted/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !certs || certs.length === 0 ? (
        <div className="py-20 text-center border rounded-2xl border-dashed bg-card/50">
          <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold">No certificates yet</h3>
          <p className="text-muted-foreground text-sm mt-1 max-w-md mx-auto">
            Participate in club hackathons, technical workshops, and campus competitions to earn verified institutional credentials.
          </p>
        </div>
      ) : (
        <StaggerContainer staggerDelay={0.08} className="grid md:grid-cols-2 gap-6">
          {certs.map((cert: Certificate) => {
            const isRevoked = cert.status === "revoked";
            return (
              <StaggerItem key={cert.id || cert.verificationCode} className="h-full">
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Card className="overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all border-border bg-card h-full flex flex-col justify-between">
                    <div>
                      <div
                        className={`h-2.5 bg-gradient-to-r ${
                          isRevoked
                            ? "from-rose-500 to-red-600"
                            : "from-amber-500 via-primary to-teal-500"
                        }`}
                      />
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Award className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge
                              variant="outline"
                              className="font-mono text-[11px] text-muted-foreground"
                            >
                              {cert.verificationCode}
                            </Badge>
                            <Badge
                              className={`text-[10px] ${
                                isRevoked
                                  ? "bg-rose-500/15 text-rose-600 border-rose-500/20"
                                  : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                              }`}
                            >
                              {isRevoked ? "Revoked" : "Verified & Valid"}
                            </Badge>
                          </div>
                        </div>

                        <h3 className="font-extrabold text-lg text-foreground mb-1 leading-snug">
                          {cert.title || "Certificate of Participation"}
                        </h3>
                        <p className="text-sm font-semibold text-primary mb-2">
                          {cert.eventName || "Campus Event"}
                        </p>

                        <div className="space-y-1 text-xs text-muted-foreground mb-5">
                          {cert.clubName && (
                            <div className="flex items-center gap-1.5">
                              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                              <span>{cert.clubName}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span>Issued: {cert.issueDate || (cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "Recent")}</span>
                          </div>
                          {cert.teamName && (
                            <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                              Team: {cert.teamName}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => setSelectedCert(cert)}
                            className="flex-1 gap-1.5 text-xs font-bold cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5" /> View Certificate
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPdf(cert)}
                            className="gap-1.5 text-xs font-semibold cursor-pointer"
                            title="Print / Save PDF"
                          >
                            <Download className="h-3.5 w-3.5" /> PDF
                          </Button>

                          <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Public Verification Link"
                          >
                            <Link href={`/certificates/verify/${cert.verificationCode}`} target="_blank">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* View Certificate & Print Dialog */}
      <Dialog open={!!selectedCert} onOpenChange={() => setSelectedCert(null)}>
        <DialogContent className="max-w-4xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold flex items-center justify-between">
              <span>Official Institutional Certificate</span>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedCert?.verificationCode}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {selectedCert && (
            <div className="py-2">
              <CertificateTemplate
                title={selectedCert.title}
                recipientName={selectedCert.recipientName}
                eventName={selectedCert.eventName}
                eventDate={selectedCert.issueDate}
                clubName={selectedCert.clubName}
                clubLogoUrl={selectedCert.clubLogoUrl}
                bodyText={selectedCert.bodyText}
                verificationCode={selectedCert.verificationCode}
                leftSignatory={selectedCert.signatories?.[0]}
                rightSignatory={selectedCert.signatories?.[1]}
              />
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (selectedCert?.verificationCode) {
                  window.open(`/certificates/verify/${selectedCert.verificationCode}`, "_blank");
                }
              }}
              className="text-xs font-semibold gap-1.5 w-full sm:w-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Verify on Public Registry
            </Button>

            <Button
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-bold gap-1.5 bg-primary text-primary-foreground w-full sm:w-auto"
            >
              <Download className="h-4 w-4" /> Download / Print PDF (A4)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
