/**
 * Global Search React Query Hook
 */

import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/api/services/search.service";

export function useGlobalSearch(query?: { q?: string }) {
  const q = query?.q || "";
  return useQuery({
    queryKey: ["/api/search", q],
    queryFn: () => searchService.globalSearch(q),
    enabled: !!q.trim(),
  });
}
