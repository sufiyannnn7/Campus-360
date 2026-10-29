/**
 * Notifications React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsService } from "@/api/services/notifications.service";
import { toast } from "sonner";

export const notificationQueryKeys = {
  all: ["/api/notifications"] as const,
  list: (params?: any) => ["/api/notifications", params] as const,
};

export function useNotifications(params?: any) {
  return useQuery({
    queryKey: notificationQueryKeys.list(params),
    queryFn: () => notificationsService.listNotifications(params),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string | number }) =>
      notificationsService.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsService.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
      toast.success("All notifications marked as read");
    },
  });
}
