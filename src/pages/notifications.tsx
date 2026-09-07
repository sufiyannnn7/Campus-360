import { useListNotifications, useMarkAllNotificationsRead } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck, Info, Ticket, Star, Users } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { getListNotificationsQueryKey } from "@workspace/api-client-react"
import { cn } from "@/lib/utils"

export default function Notifications() {
  const { data, isLoading } = useListNotifications({})
  const queryClient = useQueryClient()
  const markAllMut = useMarkAllNotificationsRead()
  
  const handleMarkAll = () => {
    markAllMut.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() })
      }
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'event_reminder': return <Ticket className="h-5 w-5 text-indigo-500" />
      case 'points_awarded': return <Star className="h-5 w-5 text-amber-500" />
      case 'recruitment': return <Users className="h-5 w-5 text-teal-500" />
      default: return <Info className="h-5 w-5 text-primary" />
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your activities.</p>
        </div>
        <Button variant="outline" onClick={handleMarkAll} disabled={markAllMut.isPending || !data?.some((n: any) => !n.readStatus)}>
          <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </div>

      <Card>
        <div className="divide-y">
          {isLoading ? (
            <div className="p-8 text-center animate-pulse">Loading notifications...</div>
          ) : data?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
               <Bell className="h-12 w-12 mb-4 text-muted" />
               <p>No notifications yet</p>
            </div>
          ) : (
            data?.map((notif: any) => (
              <div key={notif.id} className={cn(
                "p-4 flex gap-4 transition-colors hover:bg-muted/30",
                !notif.readStatus ? "bg-primary/5" : ""
              )}>
                 <div className={cn(
                   "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                   !notif.readStatus ? "bg-background" : "bg-muted"
                 )}>
                   {getIcon(notif.type)}
                 </div>
                 <div className="flex-1">
                    <p className="text-sm font-semibold">{notif.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{notif.body}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2 uppercase tracking-wider">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                 </div>
                 {!notif.readStatus && (
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                 )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
