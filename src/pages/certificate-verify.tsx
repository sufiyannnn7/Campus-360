import React, { useState, useEffect } from "react";
import { useRoute, useLocation, Link } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  XCircle,
  Award,
  Calendar,
  User,
  ShieldCheck,
  Download,
  ArrowLeft,
  Search,
  Building2,
  AlertTriangle,
  Eye,
  FileX,
} from "lucide-react";
import { certificatesService } from "@/api/services/certificates.service";
import { Certificate, CertificateVerification } from "@/types/certificates";
import { CertificateTemplate } from "@/components/certificates/certificate-template";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function CertificateVerifyPage() {
  const [, params] = useRoute("/certificates/verify/:code");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const codeParam = params?.code || "";
  const [searchInput, setSearchInput] = useState(codeParam === "SAMPLE" ? "" : codeParam);
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<CertificateVerification | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Revocation Modal (Admin only)
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);

  const fetchVerification = async (targetCode: string) => {
    if (!targetCode || targetCode === "SAMPLE") {
      setLoading(false);
      setVerification(null);
      return;
    }
    setLoading(true);
    try {
      const result = await certificatesService.verifyCertificate(targetCode);
      setVerification(result);
    } catch {
      setVerification({
        isValid: false,
        message: "Failed to communicate with the university credential ledger.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (codeParam && codeParam !== "SAMPLE") {
      setSearchInput(codeParam);
      fetchVerification(codeParam);
    } else {
      setLoading(false);
      setVerification(null);
    }
  }, [codeParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    if (!clean) return;
    setLocation(`/certificates/verify/${clean}`);
  };

  const handleRevokeConfirm = async () => {
    if (!verification?.certificate?.verificationCode || !revokeReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide an official reason for revoking this certificate.",
        variant: "destructive",
      });
      return;
    }
    setIsRevoking(true);
    try {
      await certificatesService.revokeCertificate(
        verification.certificate.verificationCode,
        revokeReason.trim()
      );
      toast({
        title: "Certificate Revoked",
        description: "This certificate has been marked invalid on the campus public registry.",
      });
      setIsRevokeModalOpen(false);
      setRevokeReason("");
      // Refresh verification
      await fetchVerification(verification.certificate.verificationCode);
    } catch (err: any) {
      toast({
        title: "Revocation Failed",
        description: err.message || "Failed to revoke certificate.",
        variant: "destructive",
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const cert = verification?.certificate;
  const isRevoked = cert?.status === "revoked" || (!verification?.isValid && !!cert);
  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-teal-400 hover:underline font-semibold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Campus 360
          </Link>
          <span className="text-xs text-slate-400 font-mono">NKOCET Credential Registry</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Certificate ID (e.g. C360-CERT-2026-ABCD-1234)..."
              className="pl-9 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-500 font-mono text-xs uppercase"
            />
          </div>
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs"
          >
            Verify
          </Button>
        </form>

        {loading ? (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center animate-pulse">
            <Award className="h-10 w-10 text-teal-500 mx-auto mb-4 animate-spin" />
            <p className="text-slate-400 font-medium text-xs">
              Verifying Official Certificate Credentials...
            </p>
          </Card>
        ) : !codeParam || codeParam === "SAMPLE" ? (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center space-y-3">
            <ShieldCheck className="h-12 w-12 text-teal-400 mx-auto" />
            <h2 className="text-lg font-bold text-slate-100">
              Campus 360 Public Credential Verification
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-xs leading-relaxed">
              Enter any official Campus 360 certificate code or scan a physical certificate's QR
              code to verify its authenticity, issue date, recipient, and validity status.
            </p>
          </Card>
        ) : !verification || !cert ? (
          <Card className="bg-slate-900 border-rose-500/30 p-8 text-center space-y-4">
            <XCircle className="h-14 w-14 text-rose-500 mx-auto" />
            <h2 className="text-xl font-bold text-slate-100">Invalid Certificate Code</h2>
            <p className="text-slate-400 max-w-md mx-auto text-xs">
              The certificate verification code{" "}
              <code className="text-rose-400 font-mono font-bold">{codeParam}</code> could not be
              validated in the university ledger. It may have been typed incorrectly or not yet issued.
            </p>
            <Button asChild variant="outline" className="border-slate-700 text-slate-200 text-xs">
              <Link href="/">Return to Campus 360</Link>
            </Button>
          </Card>
        ) : (
          <Card
            className={`bg-slate-900 shadow-2xl overflow-hidden relative border ${isRevoked ? "border-rose-500/50" : "border-teal-500/40"
              }`}
          >
            {/* Background Decorative Crest */}
            <div
              className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isRevoked ? "bg-rose-500/10" : "bg-teal-500/10"
                }`}
            />

            <CardHeader className="bg-slate-800/80 border-b border-slate-700/80 p-5 flex flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center border ${isRevoked
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      : "bg-teal-500/20 text-teal-400 border-teal-500/30"
                    }`}
                >
                  {isRevoked ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <ShieldCheck className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-100">
                    Campus 360 Verified Credential
                  </CardTitle>
                  <p className="text-xs text-slate-400 font-mono">
                    ID: {cert.verificationCode}
                  </p>
                </div>
              </div>

              <Badge
                className={`px-3 py-1 text-xs font-bold ${isRevoked
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
              >
                {isRevoked ? "REVOKED" : "Official & Valid"}
              </Badge>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-6">
              {isRevoked && (
                <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> This Certificate Has Been Revoked
                  </div>
                  <p className="text-rose-200/80 leading-relaxed">
                    Reason:{" "}
                    <span className="font-semibold text-rose-100">
                      {cert.revocationReason || verification.message || "Revoked by Academic Board"}
                    </span>
                  </p>
                  {cert.revokedAt && (
                    <p className="text-rose-400 text-[11px]">
                      Revocation recorded: {new Date(cert.revokedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              <div className="text-center space-y-2 border-b border-slate-800 pb-6">
                <p className="text-[11px] uppercase tracking-widest text-teal-400 font-semibold">
                  {cert.title || "Certificate of Participation"}
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {cert.eventName}
                </h1>
                <p className="text-xs text-slate-400">This certifies that</p>
                <p className="text-xl font-bold text-teal-300 flex items-center justify-center gap-2">
                  <User className="h-5 w-5 text-teal-400" /> {cert.recipientName}
                </p>
                {cert.teamName && (
                  <p className="text-xs text-amber-400 font-semibold">
                    Representing Team: {cert.teamName}
                  </p>
                )}
                {cert.bodyText && (
                  <p className="text-xs text-slate-300 max-w-lg mx-auto pt-2 leading-relaxed italic">
                    "{cert.bodyText}"
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">Issuing Society / Club:</span>
                  <span className="font-semibold text-slate-200">
                    {cert.clubName || "Campus 360 Student Council"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Issue Date:</span>
                  <span className="font-semibold text-slate-200">
                    {cert.issueDate || (cert.issuedAt ? new Date(cert.issuedAt).toLocaleDateString() : "Official")}
                  </span>
                </div>
                {cert.signatories && cert.signatories.length > 0 && (
                  <div className="sm:col-span-2 pt-2 border-t border-slate-800/80">
                    <span className="text-slate-500 block text-[11px] mb-1">
                      Validated Signatories:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {cert.signatories.map((sig: any, idx: number) => (
                        <div key={idx} className="text-[11px]">
                          <div className="font-bold text-slate-200">{sig.name}</div>
                          <div className="text-slate-400">{sig.designation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsViewModalOpen(true)}
                  className="border-slate-700 text-slate-200 hover:bg-slate-800 text-xs gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5 text-teal-400" /> View Official Certificate
                </Button>

                <div className="flex items-center gap-2">
                  {isAdmin && !isRevoked && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setIsRevokeModalOpen(true)}
                      className="text-xs gap-1.5"
                    >
                      <FileX className="h-3.5 w-3.5" /> Revoke (Admin)
                    </Button>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsViewModalOpen(true);
                      setTimeout(() => window.print(), 200);
                    }}
                    className="bg-teal-600 hover:bg-teal-500 text-white text-xs gap-1.5 font-bold"
                  >
                    <Download className="h-3.5 w-3.5" /> Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
              <span>Verified via Campus 360 Digital Credential Registry • NKOCET Solapur</span>
              <span className="font-mono">{cert.verificationCode}</span>
            </CardFooter>
          </Card>
        )}
      </div>

      {/* Full Certificate Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl p-4 sm:p-6 bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold flex items-center justify-between">
              <span>Institutional Certificate Preview</span>
              <Badge variant="outline" className="font-mono text-xs">
                {cert?.verificationCode}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {cert && (
            <div className="py-2">
              <CertificateTemplate
                title={cert.title}
                recipientName={cert.recipientName}
                eventName={cert.eventName}
                eventDate={cert.issueDate}
                clubName={cert.clubName}
                clubLogoUrl={cert.clubLogoUrl}
                bodyText={cert.bodyText}
                verificationCode={cert.verificationCode}
                leftSignatory={cert.signatories?.[0]}
                rightSignatory={cert.signatories?.[1]}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-bold gap-1.5"
            >
              <Download className="h-3.5 w-3.5" /> Print / Save PDF (A4)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin Revocation Dialog */}
      <Dialog open={isRevokeModalOpen} onOpenChange={setIsRevokeModalOpen}>
        <DialogContent className="max-w-md bg-card text-foreground">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Revoke Official Certificate
            </DialogTitle>
            <DialogDescription className="text-xs">
              Revoking this credential will flag it as INVALID across all Campus 360 registries and
              QR scans. An audit record will be logged.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-muted rounded-xl space-y-1">
              <div className="font-bold text-foreground">Recipient: {cert?.recipientName}</div>
              <div className="text-muted-foreground font-mono">Code: {cert?.verificationCode}</div>
              <div className="text-muted-foreground">Event: {cert?.eventName}</div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">
                Official Revocation Reason *
              </label>
              <Textarea
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="e.g. Recipient forfeited attendance, clerical issuance error, disciplinary action..."
                rows={3}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isRevoking}
              onClick={() => setIsRevokeModalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isRevoking || !revokeReason.trim()}
              onClick={handleRevokeConfirm}
              className="text-xs font-bold"
            >
              {isRevoking ? "Revoking..." : "Confirm Revocation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
