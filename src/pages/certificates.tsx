import { useGetMyCertificates } from "@workspace/api-client-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Medal, Download, ExternalLink } from "lucide-react"

export default function Certificates() {
  const { data: certs, isLoading } = useGetMyCertificates()

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-muted-foreground">Your verified achievements and event participations.</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2].map(i => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : certs?.length === 0 ? (
        <div className="py-20 text-center border rounded-xl border-dashed">
          <Medal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No certificates yet</h3>
          <p className="text-muted-foreground mt-1">Attend events and complete requirements to earn certificates.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
           {certs?.map(cert => (
             <Card key={cert.id} className="overflow-hidden hover-elevate transition-all border-primary/20">
               <div className="h-3 bg-gradient-to-r from-primary via-teal-500 to-amber-500" />
               <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                     <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Medal className="h-6 w-6 text-primary" />
                     </div>
                     <Badge variant="outline" className="font-mono text-xs text-muted-foreground">ID: {cert.verificationCode}</Badge>
                  </div>
                  <h3 className="font-bold text-xl mb-1">{cert.event?.title || 'Unknown Event'}</h3>
                  <p className="text-muted-foreground text-sm mb-6">Issued on {new Date(cert.issuedAt).toLocaleDateString()}</p>
                  
                  <div className="flex items-center gap-3">
                     <Button className="flex-1 gap-2"><Download className="h-4 w-4" /> Download PDF</Button>
                     <Button variant="outline" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                  </div>
               </CardContent>
             </Card>
           ))}
        </div>
      )}
    </div>
  )
}

function Badge({ className, variant, children, ...props }: any) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</span>
}