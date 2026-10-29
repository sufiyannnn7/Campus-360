/**
 * Recruitments React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recruitmentsService } from "@/api/services/recruitments.service";
import { toast } from "sonner";

export const recruitmentQueryKeys = {
  all: ["/api/recruitments"] as const,
  list: (params?: any) => ["/api/recruitments", params] as const,
};

export function useRecruitments(params?: any) {
  return useQuery({
    queryKey: recruitmentQueryKeys.list(params),
    queryFn: () => recruitmentsService.listRecruitments(params),
  });
}

export function useApplyRecruitment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data?: any }) =>
      recruitmentsService.applyRecruitment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recruitmentQueryKeys.all });
      toast.success("Application submitted successfully! Check your email for next steps.");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to submit recruitment application");
    },
  });
}
