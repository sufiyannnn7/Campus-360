/**
 * Events React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsService } from "@/api/services/events.service";
import { EventFilterParams } from "@/types/events";
import { toast } from "sonner";

export const eventQueryKeys = {
  all: ["/api/events"] as const,
  list: (params?: EventFilterParams) => ["/api/events", params] as const,
  detail: (id?: string | number) => ["/api/events", String(id)] as const,
};

export function useEvents(params?: EventFilterParams) {
  return useQuery({
    queryKey: eventQueryKeys.list(params),
    queryFn: () => eventsService.listEvents(params),
  });
}

export function useEvent(id?: string | number) {
  return useQuery({
    queryKey: eventQueryKeys.detail(id),
    queryFn: () => eventsService.getEventById(id!),
    enabled: !!id,
  });
}

export function useRegisterEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data?: any }) =>
      eventsService.registerEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
      toast.success("Registration confirmed successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to register for event");
    },
  });
}

export function useCancelEventRegistration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string | number }) =>
      eventsService.cancelRegistration(id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.all });
      toast.info("Registration cancelled");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to cancel registration");
    },
  });
}
