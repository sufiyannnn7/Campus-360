/**
 * News React Query Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { newsService } from "@/api/services/news.service";
import { NewsFilterParams } from "@/types/news";

export const newsQueryKeys = {
  all: ["/api/news"] as const,
  list: (params?: NewsFilterParams) => ["/api/news", params] as const,
  detail: (id?: string | number) => ["/api/news", String(id)] as const,
};

export function useNews(params?: NewsFilterParams) {
  return useQuery({
    queryKey: newsQueryKeys.list(params),
    queryFn: () => newsService.listNews(params),
  });
}

export function useNewsItem(id?: string | number, options?: { query?: { enabled?: boolean } }) {
  const isExplicitlyEnabled = options?.query?.enabled !== undefined ? options.query.enabled : !!id;

  return useQuery({
    queryKey: newsQueryKeys.detail(id),
    queryFn: () => newsService.getNewsById(id!),
    enabled: isExplicitlyEnabled,
  });
}
