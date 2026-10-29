/**
 * Leaderboard React Query Hook
 */

import { useQuery } from "@tanstack/react-query";
import { leaderboardService } from "@/api/services/leaderboard.service";
import { LeaderboardEntry } from "@/types/leaderboard";

export const leaderboardQueryKeys = {
  all: ["/api/leaderboard"] as const,
  list: (params?: any) => ["/api/leaderboard", params] as const,
};

export function useLeaderboard(params?: any) {
  return useQuery<LeaderboardEntry[]>({
    queryKey: leaderboardQueryKeys.list(params),
    queryFn: () => leaderboardService.getLeaderboard(params),
  });
}
