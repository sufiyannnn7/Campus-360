import { useGetMe, useUpdateProfile } from "@workspace/api-client-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { getGetMeQueryKey } from "@workspace/api-client-react"

export default function Profile() {
  const { data: user, isLoading } = useGetMe()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const updateMut = useUpdateProfile()
  
  const [name, setName] = useState(user?.name || "")
  const [bio, setBio] = useState(user?.bio || "")
  const [department, setDepartment] = useState(user?.department || "")
  
  // Re-sync local state when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name)
      setBio(user.bio || "")
      setDepartment(user.department || "")
    }
  }, [user])

  if (isLoading || !user) return <div className="p-8 text-center animate-pulse">Loading profile...</div>

  const handleSave = () => {
    updateMut.mutate({
      data: {
        name,
        bio,
        department
      }
    }, {
      onSuccess: () => {
        toast({ title: "Profile updated" })
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() })
      },
      onError: (err: any) => {
        toast({ title: "Update failed", description: err.message, variant: "destructive" })
      }
    })
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border shadow-sm">
               <AvatarImage src={user.avatarUrl || ''} />
               <AvatarFallback className="text-3xl bg-primary/10 text-primary">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
               <Button variant="outline">Change Avatar</Button>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={user.role} disabled className="capitalize" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short bio about yourself..." />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button onClick={handleSave} disabled={updateMut.isPending}>
              {updateMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
           <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-xl bg-muted/30 text-center">
                 <div className="text-2xl font-bold">{user.totalPoints || 0}</div>
                 <div className="text-xs text-muted-foreground uppercase">Points</div>
              </div>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
