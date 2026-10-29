/**
 * Clubs React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clubsService } from "@/api/services/clubs.service";
import { ClubFilterParams } from "@/types/clubs";
import { toast } from "sonner";

export const clubQueryKeys = {
  all: ["/api/clubs"] as const,
  list: (params?: ClubFilterParams) => ["/api/clubs", params] as const,
  detail: (id?: string | number) => ["/api/clubs", String(id)] as const,
};

export function useClubs(params?: ClubFilterParams) {
  return useQuery({
    queryKey: clubQueryKeys.list(params),
    queryFn: () => clubsService.listClubs(params),
  });
}

export function useClub(id?: string | number) {
  return useQuery({
    queryKey: clubQueryKeys.detail(id),
    queryFn: () => clubsService.getClubById(id!),
    enabled: !!id,
  });
}

export function useJoinClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string | number }) => clubsService.joinClub(id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.all });
      toast.success("Membership requested! Welcome to the club.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to join club");
    },
  });
}

export function useLeaveClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string | number }) => clubsService.leaveClub(id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.all });
      toast.info("You have left the club.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to leave club");
    },
  });
}

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      name: string;
      category: string;
      tagline?: string;
      description?: string;
      facultyAdvisor?: string;
      bannerUrl?: string;
      logoUrl?: string;
    }) => clubsService.createClub(payload),
    onSuccess: (newClub) => {
      queryClient.invalidateQueries({ queryKey: clubQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
      toast.success(`Club "${newClub.name}" created successfully!`);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to create club");
    },
  });
}
