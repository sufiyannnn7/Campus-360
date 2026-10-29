/**
 * Dashboard React Query Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/api/services/dashboard.service";

export const dashboardQueryKeys = {
  student: ["/api/dashboard/student"] as const,
  admin: ["/api/dashboard/admin"] as const,
};

export function useStudentDashboard() {
  return useQuery({
    queryKey: dashboardQueryKeys.student,
    queryFn: () => dashboardService.getStudentDashboard(),
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: dashboardQueryKeys.admin,
    queryFn: () => dashboardService.getAdminDashboard(),
  });
}
