/**
 * API Client React Bridge
 * 
 * Modular bridge providing backward-compatible hooks and query methods.
 * Refactored to delegate to domain services, unified client, and typed hooks.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/api/services/auth.service";
import { eventsService } from "@/api/services/events.service";
import { clubsService } from "@/api/services/clubs.service";
import { newsService } from "@/api/services/news.service";
import { recruitmentsService } from "@/api/services/recruitments.service";
import { certificatesService } from "@/api/services/certificates.service";
import { notificationsService } from "@/api/services/notifications.service";
import { leaderboardService } from "@/api/services/leaderboard.service";
import { dashboardService } from "@/api/services/dashboard.service";
import { searchService } from "@/api/services/search.service";
import { setAuthTokenGetter as setClientTokenGetter } from "@/api/client";
import {
  useEvents,
  useEvent,
  useRegisterEvent,
  useCancelEventRegistration,
} from "@/hooks/use-events";
import {
  useClubs,
  useClub,
  useJoinClub,
  useLeaveClub,
} from "@/hooks/use-clubs";
import { useNews, useNewsItem } from "@/hooks/use-news";
import { useRecruitments, useApplyRecruitment } from "@/hooks/use-recruitments";
import { useCertificates } from "@/hooks/use-certificates";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/use-notifications";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { useStudentDashboard, useAdminDashboard } from "@/hooks/use-dashboard";
import { useGlobalSearch } from "@/hooks/use-search";

export { setClientTokenGetter as setAuthTokenGetter };

// Query Key Helpers
export function getGetMeQueryKey() {
  return ["/api/auth/me"];
}

export function getGetEventQueryKey(id?: string | number) {
  return ["/api/events", id ? String(id) : undefined];
}

export function getGetClubQueryKey(id?: string | number) {
  return ["/api/clubs", id ? String(id) : undefined];
}

export function getGetNewsItemQueryKey(id?: string | number) {
  return ["/api/news", id ? String(id) : undefined];
}

export function getListNotificationsQueryKey() {
  return ["/api/notifications"];
}

// Auth Hooks
export function useGetMe() {
  return useQuery({
    queryKey: getGetMeQueryKey(),
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: any) => {
      const payload = credentials?.data || credentials;
      return authService.login(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: any) => {
      const payload = userData?.data || userData;
      return authService.signup(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(getGetMeQueryKey(), null);
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => {
      const payload = data?.data || data;
      return authService.updateProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
  });
}

// Dashboard Hooks
export { useStudentDashboard as useGetStudentDashboard };
export { useAdminDashboard as useGetAdminDashboard };

// Events Hooks
export function useGetEvents(params?: any) {
  return useEvents(params);
}
export function useListEvents(params?: any) {
  return useEvents(params);
}
export function useGetEvent(id?: string | number) {
  return useEvent(id);
}
export function useGetEventDetail(id?: string | number) {
  return useEvent(id);
}
export { useRegisterEvent, useCancelEventRegistration as useCancelRegistration };
export function useRegisterForEvent() {
  return useRegisterEvent();
}

// Clubs Hooks
export function useGetClubs(params?: any) {
  return useClubs(params);
}
export function useListClubs(params?: any) {
  return useClubs(params);
}
export function useGetClub(id?: string | number) {
  return useClub(id);
}
export function useGetClubDetail(id?: string | number) {
  return useClub(id);
}
export { useJoinClub, useLeaveClub as useLeaveClubMutation };
export function useJoinClubMutation() {
  return useJoinClub();
}

// News Hooks
export function useGetNews(params?: any) {
  return useNews(params);
}
export function useListNews(params?: any) {
  return useNews(params);
}
export function useGetNewsItem(id?: string | number, options?: any) {
  return useNewsItem(id, options);
}
export function useGetNewsArticle(id?: string | number, options?: any) {
  return useNewsItem(id, options);
}
export function useGetNewsDetail(id?: string | number, options?: any) {
  return useNewsItem(id, options);
}

// Recruitments Hooks
export function useGetRecruitments(params?: any) {
  return useRecruitments(params);
}
export function useListRecruitments(params?: any) {
  return useRecruitments(params);
}
export { useApplyRecruitment };

// Certificates Hooks
export function useGetCertificates(params?: any) {
  return useCertificates(params);
}
export function useGetMyCertificates(params?: any) {
  return useCertificates(params);
}
export function useListCertificates(params?: any) {
  return useCertificates(params);
}

// Notifications Hooks
export function useGetNotifications(params?: any) {
  return useNotifications(params);
}
export function useListNotifications(params?: any) {
  return useNotifications(params);
}
export { useMarkNotificationRead, useMarkAllNotificationsRead };

// Leaderboard Hooks
export function useGetLeaderboard(params?: any) {
  return useLeaderboard(params);
}
export function useListLeaderboard(params?: any) {
  return useLeaderboard(params);
}

// Search Hooks
export { useGlobalSearch };
