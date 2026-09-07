import { useState, useEffect } from "react"
import { useRoute, Link } from "wouter"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Award, Calendar, User, ShieldCheck, Download, Share2, ArrowLeft } from "lucide-react"
import { formatDateTime } from "@/lib/utils"

export default function CertificateVerifyPage() {
  const [, params] = useRoute("/certificates/verify/:code")
  const code = params?.code || ""
  const [loading, setLoading] = useState(true)
  const [cert, setCert] = useState<any | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!code) return
    setLoading(true)
    fetch(`/api/certificates/verify/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error("Certificate not found")
        return res.json()
      })
      .then((data) => {
        setCert(data)
        setNotFound(false)
      })
      .catch(() => {
        setNotFound(true)
        setCert(null)
      })
      .finally(() => setLoading(false))
  }, [code])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-teal-400 hover:underline font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to Campus 360
        </Link>

        {loading ? (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center animate-pulse">
            <Award className="h-12 w-12 text-teal-500 mx-auto mb-4 animate-spin" />
            <p className="text-slate-400 font-medium">Verifying Official Certificate Credentials...</p>
          </Card>
        ) : notFound ? (
          <Card className="bg-slate-900 border-rose-500/30 p-8 text-center space-y-4">
            <XCircle className="h-16 w-16 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-bold text-slate-100">Invalid Certificate Code</h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm">
              The certificate verification code <code className="text-rose-400 font-mono">{code}</code> could not be validated in the university ledger.
            </p>
            <Button asChild variant="outline" className="border-slate-700 text-slate-200">
              <Link href="/">Return to Homepage</Link>
            </Button>
          </Card>
        ) : (
          <Card className="bg-slate-900 border-teal-500/40 shadow-2xl overflow-hidden relative">
            {/* Background Decorative Crest */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="bg-slate-800/80 border-b border-slate-700/80 p-6 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-100">CampusHub Verified Certificate</CardTitle>
                  <p className="text-xs text-slate-400 font-mono">ID: {cert.verificationCode}</p>
                </div>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 px-3 py-1 text-xs">
                Official & Valid
              </Badge>
            </CardHeader>

            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2 border-b border-slate-800 pb-6">
                <p className="text-xs uppercase tracking-widest text-teal-400 font-semibold">Certificate of Completion</p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">{cert.title || "Event Participation"}</h1>
                <p className="text-sm text-slate-400">This certifies that</p>
                <p className="text-xl font-bold text-teal-300 flex items-center justify-center gap-2">
                  <User className="h-5 w-5 text-teal-400" /> {cert.recipientName}
                </p>
                <p className="text-sm text-slate-400">has successfully attended and fulfilled all requirements for</p>
                <p className="text-lg font-semibold text-slate-200">{cert.eventName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">Issuing Authority:</span>
                  <span className="font-semibold">{cert.issuingAuthority || "Campus 360 Academic Board"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Issue Date:</span>
                  <span className="font-semibold">{formatDateTime(cert.issuedAt)}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-950 p-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
              <span>Verified via Campus 360 Digital Credential Registry</span>
              <Button size="sm" variant="ghost" className="text-teal-400 hover:text-teal-300" onClick={() => window.print()}>
                <Download className="mr-1.5 h-4 w-4" /> Download Copy
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
