import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { QrCode, Camera, CheckCircle2, AlertTriangle, Search, UserCheck, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface QRScannerModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: number
  eventTitle: string
}

export function QRScannerModal({ isOpen, onClose, eventId, eventTitle }: QRScannerModalProps) {
  const { toast } = useToast()
  const [manualCode, setManualCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [scanResult, setScanResult] = useState<{
    status: "checked_in" | "already_checked_in" | "invalid"
    message?: string
    studentName?: string
    checkedInAt?: string
  } | null>(null)

  const handleScanCode = async (codePayload: string) => {
    if (!codePayload.trim()) return
    setLoading(true)
    setScanResult(null)

    try {
      const res = await fetch("/api/attendance/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrPayload: codePayload })
      })

      const data = await res.json()
      setScanResult(data)

      if (data.status === "checked_in") {
        toast({
          title: "Check-in Successful!",
          description: `${data.studentName || "Student"} checked in successfully.`
        })
      } else if (data.status === "already_checked_in") {
        toast({
          title: "Already Checked In",
          description: `Student was previously checked in at ${data.checkedInAt ? new Date(data.checkedInAt).toLocaleTimeString() : "earlier"}.`,
          variant: "destructive"
        })
      } else {
        toast({
          title: "Invalid Pass",
          description: data.message || "Unrecognized registration QR code.",
          variant: "destructive"
        })
      }
    } catch (err) {
      toast({
        title: "Scan Error",
        description: "Failed to communicate with attendance server.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Simulate scanning a test QR pass
  const handleSimulateScan = (userId: number) => {
    const payload = `QR-${userId}-${eventId}-${Date.now()}`
    setManualCode(payload)
    handleScanCode(payload)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <QrCode className="h-6 w-6 text-primary" /> QR Attendance Scanner
          </DialogTitle>
          <DialogDescription>
            Scan student event pass QR code or enter ticket payload for <strong className="text-foreground">{eventTitle}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          {/* Camera Viewfinder Simulation */}
          <div className="relative h-56 rounded-xl bg-slate-950 flex flex-col items-center justify-center border-2 border-dashed border-primary/40 overflow-hidden">
            {/* Viewfinder animation grid */}
            <div className="absolute inset-8 border-2 border-primary/70 rounded-lg animate-pulse pointer-events-none" />
            <Camera className="h-10 w-10 text-primary mb-2 animate-bounce" />
            <p className="text-xs text-slate-400 font-medium">Position QR code inside frame</p>
            <p className="text-[10px] text-slate-500 mt-1">Browser camera active</p>
          </div>

          {/* Quick Simulation Trigger Buttons */}
          <div className="p-3 rounded-lg bg-muted/40 border space-y-2">
            <span className="text-xs font-semibold text-muted-foreground block">Simulate Pass Scan (Dev Test):</span>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((uid) => (
                <Button key={uid} variant="outline" size="sm" onClick={() => handleSimulateScan(uid)}>
                  Scan Student #{uid} Pass
                </Button>
              ))}
            </div>
          </div>

          {/* Manual Input Fallback */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground block">Or Manual Pass Code:</label>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleScanCode(manualCode)
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="QR-1-10..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                className="text-sm font-mono"
              />
              <Button type="submit" disabled={loading || !manualCode.trim()}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Verify"}
              </Button>
            </form>
          </div>

          {/* Scan Outcome Alert Banner */}
          {scanResult && (
            <div
              className={cn(
                "p-4 rounded-xl border flex items-start gap-3 transition-all",
                scanResult.status === "checked_in" && "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300",
                scanResult.status === "already_checked_in" && "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
                scanResult.status === "invalid" && "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
              )}
            >
              {scanResult.status === "checked_in" && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />}
              {scanResult.status === "already_checked_in" && <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />}
              {scanResult.status === "invalid" && <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />}

              <div className="text-xs space-y-0.5">
                <div className="font-bold text-sm">
                  {scanResult.status === "checked_in" && "Check-in Confirmed"}
                  {scanResult.status === "already_checked_in" && "Duplicate Scan Detected"}
                  {scanResult.status === "invalid" && "Invalid Ticket"}
                </div>
                <p>
                  {scanResult.status === "checked_in" && `Checked in ${scanResult.studentName || "student"}. +20 points awarded.`}
                  {scanResult.status === "already_checked_in" && `Student was already verified at ${scanResult.checkedInAt ? new Date(scanResult.checkedInAt).toLocaleTimeString() : "earlier"}.`}
                  {scanResult.status === "invalid" && (scanResult.message || "This QR pass does not match any valid registration.")}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
